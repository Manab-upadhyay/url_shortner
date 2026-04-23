// src/modules/rag/rag.service.ts

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { Document } from "@langchain/core/documents";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import pdfParse from "pdf-parse";
import { getPineconeIndex } from "../../config/pinecone.config";
import logger from "../../utils/logger";

// ─────────────────────────────────────────────
//  Shared instances (lazy-initialized)
// ─────────────────────────────────────────────

let embeddings: GoogleGenerativeAIEmbeddings | null = null;
let vectorStore: PineconeStore | null = null;

function getEmbeddings(): GoogleGenerativeAIEmbeddings {
  if (!embeddings) {
    embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      modelName: "text-embedding-004",
    });
  }
  return embeddings;
}

async function getVectorStore(): Promise<PineconeStore> {
  if (!vectorStore) {
    const pineconeIndex = getPineconeIndex();
    vectorStore = await PineconeStore.fromExistingIndex(getEmbeddings(), {
      pineconeIndex,
    });
  }
  return vectorStore;
}

// ─────────────────────────────────────────────
//  PDF Ingestion Pipeline
// ─────────────────────────────────────────────

export async function ingestPDF(
  fileBuffer: Buffer,
  fileName: string
): Promise<{ chunksIngested: number; totalCharacters: number }> {
  logger.info(`Starting PDF ingestion for: ${fileName}`);

  // 1. Parse PDF → raw text
  const pdfData = await pdfParse(fileBuffer);
  const rawText = pdfData.text;

  if (!rawText || rawText.trim().length === 0) {
    throw new Error("PDF appears to be empty or could not be parsed");
  }

  logger.info(
    `Parsed PDF: ${pdfData.numpages} pages, ${rawText.length} characters`
  );

  // 2. Split into chunks
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
    separators: ["\n\n", "\n", ". ", " ", ""],
  });

  const documents = await textSplitter.createDocuments(
    [rawText],
    [
      {
        source: fileName,
        totalPages: pdfData.numpages,
        ingestedAt: new Date().toISOString(),
      },
    ]
  );

  // Add chunk index metadata to each document
  documents.forEach((doc: Document, index: number) => {
    doc.metadata.chunkIndex = index;
    doc.metadata.totalChunks = documents.length;
  });

  logger.info(`Split into ${documents.length} chunks`);

  // 3. Embed & upsert into Pinecone
  const pineconeIndex = getPineconeIndex();

  await PineconeStore.fromDocuments(documents, getEmbeddings(), {
    pineconeIndex,
  });

  // Reset cached vector store so it picks up new documents
  vectorStore = null;

  logger.info(
    `Successfully ingested ${documents.length} chunks into Pinecone`
  );

  return {
    chunksIngested: documents.length,
    totalCharacters: rawText.length,
  };
}

// ─────────────────────────────────────────────
//  RAG Chat Pipeline
// ─────────────────────────────────────────────

const SYSTEM_PROMPT = `You are an expert API documentation assistant for LinkTrace — a URL shortener and analytics platform.

Your job is to answer user questions accurately based ONLY on the provided context from the API documentation.

Rules:
1. Answer ONLY using information from the context below. If the answer is not in the context, say "I don't have enough information in the docs to answer that."
2. Be precise and technical. Include endpoint paths, HTTP methods, request/response formats when relevant.
3. Use markdown formatting for code blocks, lists, and emphasis.
4. If you reference an endpoint, always include the full path (e.g., POST /api/v1/links).
5. Keep answers concise but complete.

Context from API Documentation:
---
{context}
---`;

export async function ragChat(
  question: string
): Promise<{ answer: string; sources: Array<{ content: string; metadata: Record<string, any> }> }> {
  logger.info(`RAG chat query: "${question}"`);

  // 1. Retrieve relevant chunks
  const store = await getVectorStore();
  const retriever = store.asRetriever({
    k: 4,
  });

  const relevantDocs = await retriever.invoke(question);

  if (relevantDocs.length === 0) {
    return {
      answer:
        "I couldn't find any relevant information in the API documentation. Please make sure the docs have been ingested, or try rephrasing your question.",
      sources: [],
    };
  }

  // 2. Build context from retrieved documents
  const contextText = relevantDocs
    .map(
      (doc: Document, i: number) =>
        `[Chunk ${i + 1}] (Source: ${doc.metadata.source || "unknown"}):\n${doc.pageContent}`
    )
    .join("\n\n");

  // 3. Create the prompt chain
  const chatModel = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
    modelName: "gemini-2.0-flash",
    temperature: 0.2, // Low temperature for factual answers
    maxOutputTokens: 2048,
  });

  const prompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(SYSTEM_PROMPT),
    HumanMessagePromptTemplate.fromTemplate("{question}"),
  ]);

  const chain = prompt.pipe(chatModel).pipe(new StringOutputParser());

  // 4. Generate answer
  const answer = await chain.invoke({
    context: contextText,
    question: question,
  });

  // 5. Build source references
  const sources = relevantDocs.map((doc: Document) => ({
    content: doc.pageContent.substring(0, 200) + "...",
    metadata: doc.metadata,
  }));

  logger.info(`RAG chat completed. Retrieved ${relevantDocs.length} chunks.`);

  return { answer, sources };
}
