import {
  getLinkAnalyticsController,
  getUserAnalyticsController,
  getTopLinksController,
  getHourlyClicksController,
  getLinkAnalyticsPerHourController,
  getWeeklyTrendController,
  getWeeklyTrendPerLinkController,
} from "./analytics.controller";

import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
const router = Router();
router.get("/user", protect, getUserAnalyticsController);
router.get("/link/:linkId", protect, getLinkAnalyticsController);
router.get("/link/:linkId/hourly", protect, getLinkAnalyticsPerHourController);
router.get("/hourly-clicks", protect, getHourlyClicksController);
router.get("/top-links", protect, getTopLinksController);
router.get("/weekly-trend", protect, getWeeklyTrendController);
router.get("/weekly-trend/:linkId", protect, getWeeklyTrendPerLinkController);
export default router;
