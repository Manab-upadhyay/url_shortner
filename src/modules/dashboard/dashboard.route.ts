import { getDashboardDataController } from "./dashboard.controller";

import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
const router = Router();
router.get("/", protect, getDashboardDataController);
export default router;
