import {
  getLinkAnalyticsController,
  getUserAnalyticsController,
  getTopLinksController,
  getHourlyClicksController,
  getLinkAnalyticsPerHourController,
  getLastWeekClicksController,
} from "./analytics.controller";

import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
const router = Router();
router.get("/user", protect, getUserAnalyticsController);
router.get("/link/:linkId", protect, getLinkAnalyticsController);
router.get("/link/:linkId/hourly", protect, getLinkAnalyticsPerHourController);
router.get("/hourly-clicks", protect, getHourlyClicksController);
router.get("/top-links", protect, getTopLinksController);
router.get("/last-week-clicks", protect, getLastWeekClicksController);
export default router;
