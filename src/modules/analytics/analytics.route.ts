import {
  getLinkAnalyticsController,
  getUserAnalyticsController,
  getTopLinksController,
  getHourlyClicksController,
  getLinkAnalyticsPerHourController,
  getWeeklyTrendController,
  getWeeklyTrendPerLinkController,
  getPerLinkDashboardController,
} from "./analytics.controller";

import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
const analyticsRoute = Router();
analyticsRoute.get("/user", protect, getUserAnalyticsController);
analyticsRoute.get("/link/:linkId", protect, getLinkAnalyticsController);
analyticsRoute.get("/link/:linkId/hourly", protect, getLinkAnalyticsPerHourController);
analyticsRoute.get("/hourly-clicks", protect, getHourlyClicksController);
analyticsRoute.get("/top-links", protect, getTopLinksController);
analyticsRoute.get("/weekly-trend", protect, getWeeklyTrendController);
analyticsRoute.get("/weekly-trend/:linkId", protect, getWeeklyTrendPerLinkController);
analyticsRoute.get("/dashboard/:linkId", protect, getPerLinkDashboardController);

export default analyticsRoute;
