import { Router } from "express";
import { sendWelcomeEmailController, SendEmailToAuthorityController, SendFeedBackEmailResponseController } from "./email.controller";

const emailRoute = Router();

emailRoute.post("/send-welcome-email", sendWelcomeEmailController);
emailRoute.post("/send-feedback-response", SendFeedBackEmailResponseController)
emailRoute.post("/send-email-to-authority", SendEmailToAuthorityController)

export default emailRoute;