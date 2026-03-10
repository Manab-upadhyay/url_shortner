import { Router } from "express";
import { sendWelcomeEmailController, SendEmailToAuthorityController, SendFeedBackEmailResponseController } from "./email.controller";

const router = Router();

router.post("/send-welcome-email", sendWelcomeEmailController);
router.post("/send-feedback-response", SendFeedBackEmailResponseController)
router.post("/send-email-to-authority", SendEmailToAuthorityController)

export default router;