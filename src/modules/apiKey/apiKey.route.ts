import {
  createApiContoller,
  getApiKeysController,
  revokeApiKeyController,
} from "./apikey.controller";
import { protect } from "../../middleware/auth.middleware";

import { Router } from "express";
const apiKeyRoute = Router();
apiKeyRoute.get("/dashboard/api-keys", protect, getApiKeysController);
apiKeyRoute.post("/dashboard/api-key", protect, createApiContoller);
apiKeyRoute.delete(
  "/dashboard/deleteApiKey/:apiKeyId",
  protect,
  revokeApiKeyController,
);
export default apiKeyRoute;
