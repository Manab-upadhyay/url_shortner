import { redis } from "../config/cache.redis";
import bcrypt from "bcrypt";

// General-purpose OTP verification (for non-signup flows like password reset)
export async function VerifyOtp(email: string, otp: string) {
  const hashedOtp = await redis.get(`otp:${email}`);
  if (!hashedOtp) {
    throw new Error("OTP expired or not found");
  }

  const isMatch = await bcrypt.compare(otp, hashedOtp);
  if (!isMatch) {
    throw new Error("Invalid OTP");
  }

  await redis.del(`otp:${email}`);
  return true;
}
