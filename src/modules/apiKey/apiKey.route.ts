import {
  createApiContoller,
  getApiKeysController,
  revokeApiKeyController,
} from "./apikey.controller";
import { protect } from "../../middleware/auth.middleware";

import { Router } from "express";
const router = Router();
router.get("/dashboard/api-keys", protect, getApiKeysController);
router.post("/dashboard/api-key", protect, createApiContoller);
router.delete(
  "/dashboard/deleteApiKey/:apiKeyId",
  protect,
  revokeApiKeyController,
);
export default router;
