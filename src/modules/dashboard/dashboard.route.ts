import { getDashboardDataController } from "./dashboard.controller";

import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
const dashboardRoute = Router();
dashboardRoute.get("/", protect, getDashboardDataController);
export default dashboardRoute;
