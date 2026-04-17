// src/config/pinecone.config.ts

import { Pinecone } from "@pinecone-database/pinecone";
import logger from "../utils/logger";

let pineconeClient: Pinecone | null = null;

/**
 * Returns a singleton Pinecone client instance.
 */
export function getPineconeClient(): Pinecone {
  if (!pineconeClient) {
    const apiKey = process.env.PINECONE_API_KEY;
    if (!apiKey) {
      throw new Error("PINECONE_API_KEY is not set in environment variables");
    }

    pineconeClient = new Pinecone({ apiKey });
    logger.info("Pinecone client initialized");
  }

  return pineconeClient;
}

/**
 * Returns the Pinecone index for RAG operations.
 */
export function getPineconeIndex() {
  const indexName = process.env.PINECONE_INDEX_NAME;
  if (!indexName) {
    throw new Error("PINECONE_INDEX_NAME is not set in environment variables");
  }

  const client = getPineconeClient();
  return client.index(indexName);
}
