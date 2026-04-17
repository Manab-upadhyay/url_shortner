// src/modules/rag/rag.route.ts

import { Router } from "express";
import multer from "multer";
import { protect } from "../../middleware/auth.middleware";
import { chatController, ingestController } from "./rag.controller";

const ragRoute = Router();

// Multer config: memory storage for PDF buffer access
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB max
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

// POST /api/rag/chat — Ask a question about the API docs
ragRoute.post("/chat", protect, chatController);

// POST /api/rag/ingest — Upload & ingest a PDF into the vector store
ragRoute.post("/ingest", protect, upload.single("pdf"), ingestController);

export default ragRoute;
