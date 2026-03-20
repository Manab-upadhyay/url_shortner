import { verifyOtpController,sendOtpController } from "./otp.controller";
import Router from "express"

const otpRoute= Router()

otpRoute.post("/verify-otp", verifyOtpController)
otpRoute.post("/send-otp", sendOtpController)
export default otpRoute