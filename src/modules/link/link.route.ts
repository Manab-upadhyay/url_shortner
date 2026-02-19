import {
  addLinkController,
  getLinkController,
  getUserLinksController,
  deleteLinkController,
} from "./link.controller";
import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
const router = Router();
router.post("/addLink", protect, addLinkController);
router.get("/getLink/:shortCode", protect, getLinkController);
router.get("/getUserLinks", protect, getUserLinksController);
router.delete("/deleteLink/:linkId", protect, deleteLinkController);
export default router;
