import {
  createApiContoller,
  revokeApiKeyController,
} from "./apikey.controller";
import { protect } from "../../middleware/auth.middleware";

import { Router } from "express";
const router = Router();

router.post("/dashboard/api-key", protect, createApiContoller);
router.delete(
  "dashboard/deleteApiKey/:apiKeyId",
  protect,
  revokeApiKeyController,
);
export default router;
