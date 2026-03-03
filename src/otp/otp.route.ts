import { Router } from "express";
import { verifyOtpController, sendOtpController } from "./otp.controller";

const router = Router();

router.post("/send-otp", sendOtpController);
router.post("/verify-otp", verifyOtpController);

export default router;