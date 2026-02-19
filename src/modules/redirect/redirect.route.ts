import { redirectController } from "./redirect.controller";
import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
const router = Router();
router.get("/:shortCode", protect, redirectController);
export default router;
