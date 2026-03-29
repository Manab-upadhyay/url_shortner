import {
  addLinkController,
  getLinkController,
  getUserLinksController,
  deleteLinkController,
  getTopLinksController,
} from "./link.controller";
import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middlewere";
import {
  createLinkSchema,
  redirectSchema,
} from "../../validator/link.validator";
import { checkLinkLimit } from "../../middleware/usage.middleware";
const linkRoute = Router();
linkRoute.post(
  "/addLink",
  protect,
  validate(createLinkSchema),
  checkLinkLimit,
  addLinkController,
);
linkRoute.get(
  "/getLink/:shortCode",
  protect,
  validate(redirectSchema),
  getLinkController,
);
linkRoute.get("/getUserLinks", protect, getUserLinksController);
linkRoute.get("/getTopLinks", protect, getTopLinksController);
linkRoute.delete("/deleteLink/:linkId", protect, deleteLinkController);

export default linkRoute;
