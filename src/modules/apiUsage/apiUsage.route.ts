import { protect } from "../../middleware/auth.middleware";
import getApiUsageController from "./apiUsage.controller";
import Router from "express";
const apiUsageRoute = Router();

apiUsageRoute.get("/apiUsage", protect, getApiUsageController);
export default apiUsageRoute;
