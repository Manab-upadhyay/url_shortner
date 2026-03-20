import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { getUsageController } from "./overAllUsage.controller";

const overAllUsageRoute = Router();

overAllUsageRoute.get("/current", protect, getUsageController);

export default overAllUsageRoute;
