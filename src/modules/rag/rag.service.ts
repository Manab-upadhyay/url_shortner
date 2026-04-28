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
import { PDFParse } from "pdf-parse";
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
      model: "gemini-embedding-2",
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
  // Convert Node.js Buffer to Uint8Array for pdf-parse compatibility
  const uint8Data = new Uint8Array(fileBuffer.buffer, fileBuffer.byteOffset, fileBuffer.byteLength);
  console.log(`[DEBUG] Buffer size: ${fileBuffer.length}, Uint8Array size: ${uint8Data.length}`);

  const pdf = new PDFParse({ data: uint8Data });
  const textResult = await pdf.getText();

  const rawText = textResult.text;
  const numpages = textResult.total;

  
  // Debug: log what we got back
  console.log(`[DEBUG] getText() returned: total=${numpages}, text length=${rawText?.length ?? 0}, pages count=${textResult.pages?.length ?? 0}`);
  console.log(`[DEBUG] First 300 chars: "${rawText?.substring(0, 300)}"`);
  logger.info(`getText() returned: total=${numpages}, text length=${rawText?.length ?? 0}, pages=${textResult.pages?.length ?? 0}`);

  if (!rawText || rawText.trim().length === 0) {
    throw new Error("PDF appears to be empty or could not be parsed. It may be a scanned/image-based PDF with no extractable text.");
  }

  logger.info(
    `Parsed PDF: ${numpages} pages, ${rawText.length} characters`
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
        totalPages: numpages,
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

  if (documents.length === 0) {
    throw new Error("PDF text was extracted but produced 0 chunks after splitting. The PDF may not contain enough meaningful text.");
  }

  // 3. Embed & upsert into Pinecone
  const pineconeIndex = getPineconeIndex();

  // Debug: test embeddings first
  try {
    const testEmbedding = await getEmbeddings().embedQuery(documents[0].pageContent);
    console.log(`[DEBUG] Test embedding dimension: ${testEmbedding.length}, first 3 values: [${testEmbedding.slice(0, 3).join(', ')}]`);
  } catch (embErr: any) {
    console.error(`[DEBUG] Embedding FAILED:`, embErr.message);
    throw new Error(`Embedding generation failed: ${embErr.message}`);
  }

  // Debug: log documents being sent
  console.log(`[DEBUG] Sending ${documents.length} documents to PineconeStore.fromDocuments()`);
  documents.forEach((doc, i) => {
    console.log(`[DEBUG]   Chunk ${i}: ${doc.pageContent.length} chars, metadata keys: ${Object.keys(doc.metadata).join(', ')}`);
  });

  try {
    await PineconeStore.fromDocuments(documents, getEmbeddings(), {
      pineconeIndex,
    });
    console.log(`[DEBUG] PineconeStore.fromDocuments() succeeded`);
  } catch (pineconeErr: any) {
    console.error(`[DEBUG] Pinecone upsert FAILED:`, pineconeErr.message);
    console.error(`[DEBUG] Full error:`, JSON.stringify(pineconeErr, null, 2));
    throw pineconeErr;
  }

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
    model: "gemini-2.0-flash",
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
