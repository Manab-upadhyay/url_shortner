import { redis } from "../config/cache.redis";
import bcrypt from "bcrypt";
import { sendMail } from "../email/email.service";
export async function VerifyOtp(email:string, otp:string){
    const otpRecord= await redis.get(`otp:${email}`)
    if(!otpRecord){
        throw new Error("OTP not found");
    }
    const isMatch = await bcrypt.compare(otp, otpRecord);
    if(!isMatch){
        throw new Error("Invalid OTP");
    }
    await redis.del(`otp:${email}`);
    return true;

}
export async function SendOtp(to:string, otp:string){
  return sendMail({
    to,
    subject: "OTP for LinkTrace",
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: auto; padding: 32px; border-radius: 12px; background: #f9fafb;">
        <h2 style="color: #111827;">OTP for LinkTrace</h2>
        <p style="color: #374151; line-height: 1.6;">
          Your OTP is ${otp}. It will expire in 15 minutes.
        </p>
        <p style="margin-top: 24px; font-size: 12px; color: #9ca3af;">
          If you didn't request this, just ignore this email — your password won't change.
        </p>
      </div>
    `,
  });
}
