import {
  addLinkController,
  getLinkController,
  getUserLinksController,
  deleteLinkController,
} from "./link.controller";
import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middlewere";
import {
  createLinkSchema,
  redirectSchema,
} from "../../validator/link.validator";
const router = Router();
router.post("/addLink", protect, validate(createLinkSchema), addLinkController);
router.get(
  "/getLink/:shortCode",
  protect,
  validate(redirectSchema),
  getLinkController,
);
router.get("/getUserLinks", protect, getUserLinksController);
router.delete("/deleteLink/:linkId", protect, deleteLinkController);
export default router;
