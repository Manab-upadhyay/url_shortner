import { Router } from "express";
import { apiKeyAuth } from "../../middleware/apikeyAuth.middleware";
import { validate } from "../../middleware/validate.middlewere";
import {
  addLinkController,
  getLinkController,
  deleteLinkController,
} from "./link.controller";
import {
  createLinkSchema,
  redirectSchema,
} from "../../validator/link.validator";

const router = Router();

// All routes here require API key
router.use(apiKeyAuth);

// Create link via API
router.post("/links", validate(createLinkSchema), addLinkController);

// Get link info
router.get("/links/:shortCode", validate(redirectSchema), getLinkController);

// Delete link
router.delete("/links/:linkId", deleteLinkController);

export default router;
