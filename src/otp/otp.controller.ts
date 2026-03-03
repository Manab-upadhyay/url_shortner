import { VerifyOtp } from "./otp.service";
import { asyncHandler } from "../utils/asynchandler";
import { generateOTP } from "../utils/generateOTP";
import { SendOtp } from "../email/email.service";
import bcrypt from "bcrypt";
import { redis } from "../config/cache.redis";

// Send OTP (general purpose – for password reset, etc.)
export const sendOtpController = asyncHandler(async (req: any, res: any) => {
  const { email } = req.body;
  const otp = generateOTP();
  const hashedOtp = await bcrypt.hash(otp, 10);

  await redis.set(`otp:${email}`, hashedOtp, "EX", 900);
  await SendOtp(email, otp);

  return res.status(200).json({ message: "OTP sent successfully" });
});

// Verify OTP (general purpose)
export const verifyOtpController = asyncHandler(async (req: any, res: any) => {
  const { email, otp } = req.body;
  await VerifyOtp(email, otp);
  return res.status(200).json({ message: "OTP verified successfully" });
});