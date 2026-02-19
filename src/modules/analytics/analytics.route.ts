import {
  getLinkAnalyticsController,
  getUserAnalyticsController,
  getTopLinksController,
} from "./analytics.controller";

import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
const router = Router();
router.get("/user", protect, getUserAnalyticsController);
router.get("/link/:linkId", protect, getLinkAnalyticsController);
router.get("/top-links", protect, getTopLinksController);
export default router;
