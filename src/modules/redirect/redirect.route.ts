import { redirectController } from "./redirect.controller";
import { Router } from "express";

const router = Router();
router.get("/:shortCode", redirectController);
export default router;
