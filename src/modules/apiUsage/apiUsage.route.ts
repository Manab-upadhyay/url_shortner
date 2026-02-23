import { protect } from "../../middleware/auth.middleware";
import getApiUsageController from "./apiUsage.controller";
import Router from "express";
const router = Router();

router.get("/apiUsage", protect, getApiUsageController);
export default router;
