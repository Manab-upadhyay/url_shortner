import nodemailer from "nodemailer";
import dotenv from "dotenv";
import dns from "dns";
import { Resend } from "resend";
import axios from "axios";
import logger from "../utils/logger";
interface Feedback {
  mail: string;
  subject: string;
  type: string;
  message: string;
}
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);
// Railway sometimes fails on IPv6 connections to Gmail. Force IPv4.
dns.setDefaultResultOrder("ipv4first");

// ── Transporter (Brevo SMTP) ──
// const transporter = nodemailer.createTransport({
//   host: "smtp-relay.brevo.com",
//   port: 587,
//   secure: false, // Use `true` for port 465, `false` for all other ports
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.BREVO_SMTP_KEY,
//   },
// });  

// // ── Verify connection on startup ──
// transporter.verify().then(() => {
//   logger.info("📧 Email service ready");
// }).catch((err) => {
//   logger.error("📧 Email service error:", err.message);
// });

// ── Generic send helper ──
interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendMail({ to, subject, html, text }: SendMailOptions) {
 logger.info("calling email")
  try {
    logger.info(process.env.BREVO_API_KEY)
    const payload: any = {
      sender: {
        email: process.env.EMAIL_USER, // your verified email
        name: "LinkTrace"
      },
      to: [{ email: to }],
      subject: subject,
      htmlContent: html,
    };
    
    if (text) {
      payload.textContent = text;
    }

    const res = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      payload,
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    logger.info(`✅ Email sent: ${JSON.stringify(res.data)}`);
  } catch (error: any) {
    logger.error("❌ Email send error:", error.response?.data || error.message);
  }
}

// ── Pre-built templates ──

export async function sendWelcomeEmail(to: string, name: string) {
  return sendMail({
    to,
    subject: "Welcome to LinkTrace! 🚀",
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: auto; padding: 32px; border-radius: 12px; background: #f9fafb;">
        <h2 style="color: #111827;">Hey ${name} 👋</h2>
        <p style="color: #374151; line-height: 1.6;">
          Welcome aboard! Your LinkTrace account is ready. Start shortening links, tracking clicks, and analyzing your audience.
        </p>
        <a href="http://localhost:5173/dashboard"
           style="display: inline-block; margin-top: 16px; padding: 12px 24px; background: #6366f1; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Go to Dashboard →
        </a>
        <p style="margin-top: 24px; font-size: 12px; color: #9ca3af;">
          If you didn't create this account, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(to: string, resetToken: string) {
  const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;
  return sendMail({
    to,
    subject: "Reset your LinkTrace password",
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: auto; padding: 32px; border-radius: 12px; background: #f9fafb;">
        <h2 style="color: #111827;">Password Reset</h2>
        <p style="color: #374151; line-height: 1.6;">
          We received a request to reset your password. Click the button below to choose a new one. This link expires in 15 minutes.
        </p>
        <a href="${resetLink}"
           style="display: inline-block; margin-top: 16px; padding: 12px 24px; background: #6366f1; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Reset Password
        </a>
        <p style="margin-top: 24px; font-size: 12px; color: #9ca3af;">
          If you didn't request this, just ignore this email — your password won't change.
        </p>
      </div>
    `,
  });
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
export function SendFeedBackResponseEmail(to: string, feedback: Feedback) {
  return sendMail({
    to,
    subject: "Thanks for your feedback — LinkTrace",
    html: `
    <div style="font-family:Segoe UI, Arial, sans-serif; background:#f3f4f6; padding:30px;">
      <div style="max-width:520px;margin:auto;background:white;border-radius:12px;padding:28px;border:1px solid #e5e7eb">

        <h2 style="margin:0;color:#111827;">Thank you for your feedback</h2>

        <p style="color:#374151;font-size:14px;line-height:1.6;margin-top:12px;">
          We appreciate you taking the time to share your thoughts about <strong>LinkTrace</strong>.
          Our team will review your feedback and use it to improve the product.
        </p>

        <div style="margin-top:20px;padding:16px;border-radius:8px;background:#f9fafb;border:1px solid #e5e7eb;">
          <p style="margin:0;font-size:13px;color:#6b7280;"><strong>Feedback Type</strong></p>
          <p style="margin:4px 0 12px 0;font-size:14px;color:#111827;">${feedback.type}</p>

          <p style="margin:0;font-size:13px;color:#6b7280;"><strong>Subject</strong></p>
          <p style="margin:4px 0 12px 0;font-size:14px;color:#111827;">${feedback.subject}</p>

          <p style="margin:0;font-size:13px;color:#6b7280;"><strong>Message</strong></p>
          <p style="margin:4px 0;font-size:14px;color:#111827;line-height:1.6;">
            ${feedback.message}
          </p>
        </div>

        <p style="margin-top:20px;font-size:14px;color:#374151;">
          If we need additional details, our team may contact you.
        </p>

        <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0"/>

        <p style="font-size:12px;color:#9ca3af;">
          — LinkTrace Team
        </p>

      </div>
    </div>
    `,
  });
}
export function SendEmailToAuthority(feedback: Feedback) {
  return sendMail({
    to: process.env.EMAIL_USER || "",
    subject: "📩 New Feedback Received — LinkTrace",
    html: `
    <div style="font-family:Segoe UI, Arial, sans-serif;background:#f3f4f6;padding:30px;">
      <div style="max-width:520px;margin:auto;background:white;border-radius:12px;padding:28px;border:1px solid #e5e7eb">

        <h2 style="margin:0;color:#111827;">New Feedback Submitted</h2>

        <p style="color:#374151;font-size:14px;margin-top:10px;">
          A user has submitted feedback for <strong>LinkTrace</strong>.
        </p>

        <div style="margin-top:20px;border:1px solid #e5e7eb;border-radius:8px;background:#fafafa;padding:16px">

          <p style="margin:0;font-size:13px;color:#6b7280;"><strong>User Email</strong></p>
          <p style="margin:4px 0 12px 0;font-size:14px;color:#111827;">${feedback.mail}</p>

          <p style="margin:0;font-size:13px;color:#6b7280;"><strong>Feedback Type</strong></p>
          <p style="margin:4px 0 12px 0;font-size:14px;color:#111827;">${feedback.type}</p>

          <p style="margin:0;font-size:13px;color:#6b7280;"><strong>Subject</strong></p>
          <p style="margin:4px 0 12px 0;font-size:14px;color:#111827;">${feedback.subject}</p>

          <p style="margin:0;font-size:13px;color:#6b7280;"><strong>Message</strong></p>
          <p style="margin:4px 0;font-size:14px;color:#111827;line-height:1.6;">
            ${feedback.message}
          </p>

        </div>

        <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0"/>

        <p style="font-size:12px;color:#9ca3af;">
          This email was generated automatically by LinkTrace.
        </p>

      </div>
    </div>
    `,
  });
}