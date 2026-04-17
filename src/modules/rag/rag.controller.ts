// src/modules/rag/rag.controller.ts

import { asyncHandler } from "../../utils/asynchandler";
import { ApiError } from "../../utils/ApiError";
import { ragChat, ingestPDF } from "./rag.service";
import logger from "../../utils/logger";

/**
 * POST /api/rag/chat
 * Body: { question: string }
 * Returns: { answer: string, sources: Array }
 */
export const chatController = asyncHandler(async (req: any, res: any) => {
  const { question } = req.body;

  if (!question || typeof question !== "string" || question.trim().length === 0) {
    throw new ApiError(400, "A non-empty 'question' string is required");
  }

  if (question.length > 1000) {
    throw new ApiError(400, "Question must be under 1000 characters");
  }

  const result = await ragChat(question.trim());

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * POST /api/rag/ingest
 * Body: multipart/form-data with a 'pdf' file field
 * Returns: { chunksIngested: number, totalCharacters: number }
 */
export const ingestController = asyncHandler(async (req: any, res: any) => {
  if (!req.file) {
    throw new ApiError(400, "A PDF file is required. Upload via 'pdf' form field.");
  }

  const file = req.file;

  // Validate file type
  if (file.mimetype !== "application/pdf") {
    throw new ApiError(400, "Only PDF files are accepted");
  }

  // Validate file size (max 20MB)
  const MAX_SIZE = 20 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new ApiError(400, "PDF file must be under 20MB");
  }

  logger.info(`Ingesting PDF: ${file.originalname} (${(file.size / 1024).toFixed(1)} KB)`);

  const result = await ingestPDF(file.buffer, file.originalname);

  res.status(200).json({
    success: true,
    message: `Successfully ingested "${file.originalname}"`,
    data: result,
  });
});
