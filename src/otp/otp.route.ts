import { verifyOtpController,sendOtpController } from "./otp.controller";
import Router from "express"

const router= Router()

router.post("/verify-otp", verifyOtpController)
router.post("/send-otp", sendOtpController)
export default router