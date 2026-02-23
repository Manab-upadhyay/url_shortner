import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { getUsageController } from "./overAllUsage.controller";

const router = Router();

router.get("/current", protect, getUsageController);

export default router;
