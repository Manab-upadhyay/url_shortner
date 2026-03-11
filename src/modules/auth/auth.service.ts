import User from "./auth.model";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/jwt.utils";
import { ApiError } from "../../utils/ApiError";
import { redis } from "../../config/cache.redis";
import { generateOTP } from "../../utils/generateOTP";
import { SendOtp, sendWelcomeEmail } from "../../email/email.service";
import { OAuth2Client } from "google-auth-library";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function comparePassword(this: any, password: string) {
  return await bcrypt.compare(password, this.password);
}

// ── Step 1: Signup → validate, store temp user in Redis, send OTP ──
async function signup(email: string, password: string, name: string) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }
  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long");
  }

  // Store temp signup data in Redis (expires in 15 min)
  const tempData = JSON.stringify({ email, password, name });
  await redis.set(`signup:${email}`, tempData, "EX", 900);

  // Generate & store hashed OTP
  const otp = generateOTP();
  const hashedOtp = await bcrypt.hash(otp, 10);
  await redis.set(`otp:${email}`, hashedOtp, "EX", 900);

  // Send OTP via email
  await SendOtp(email, otp);

  return { message: "OTP sent to your email. Verify to complete signup." };
}

// ── Step 2: Verify OTP → create user in DB, return token ──
async function verifySignupOtp(email: string, otp: string) {
  // Check OTP
  const hashedOtp = await redis.get(`otp:${email}`);
  if (!hashedOtp) {
    throw new ApiError(400, "OTP expired or not found. Please sign up again.");
  }

  const isMatch = await bcrypt.compare(otp, hashedOtp);
  if (!isMatch) {
    throw new ApiError(400, "Invalid OTP");
  }

  // Retrieve temp signup data
  const tempData = await redis.get(`signup:${email}`);
  if (!tempData) {
    throw new ApiError(400, "Signup session expired. Please sign up again.");
  }

  const { password, name } = JSON.parse(tempData);

  // Create user in DB
  const user = new User({ email, password, name });
  await user.save();

  // Cleanup Redis
  await redis.del(`otp:${email}`);
  await redis.del(`signup:${email}`);

  // Generate JWT
  const token = generateToken(user._id.toString(), user.tokenversion);
  const safeUser = {
    id: user._id,
    email: user.email,
    name: user.name,
    bio: user.bio,
    image: user.avatar,
  };

  // Send welcome email (fire-and-forget)
  sendWelcomeEmail(email, name).catch(() => {});

  return { user: safeUser, token };
}

// ── Login ──
async function login(email: string, password: string) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }
  const isMatch = await comparePassword.call(user, password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }
  const token = generateToken(user._id.toString(), user.tokenversion);
  const safeUser = {
    id: user._id,
    email: user.email,
    name: user.name,
    bio: user.bio,
    image: user.avatar,
  };
  return { user: safeUser, token };
}

// ── Google Login ──
async function googleLogin(idToken: string) {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload) {
    throw new ApiError(400, "Invalid Google token");
  }

  const { sub: googleId, email, name, picture } = payload;
  if (!email || !name) {
     throw new ApiError(400, "Missing email or name from Google payload");
  }

  let user = await User.findOne({ email });

  if (!user) {
    // Create new google user
    user = new User({
      email,
      name,
      provider: "google",
      googleId,
      avatar: picture || "",
    });
    await user.save();
    
    // Optional: send welcome email locally
    sendWelcomeEmail(email, name).catch(() => {});
  } else {
    // Optionally link google account if changing provider logic is needed
    if (user.provider !== "google" && !user.googleId) {
       user.googleId = googleId;
       await user.save();
    }
  }

  const token = generateToken(user._id.toString(), user.tokenversion);
  const safeUser = {
    id: user._id,
    email: user.email,
    name: user.name,
    bio: user.bio,
    image: user.avatar,
    provider: user.provider,
  };

  return { user: safeUser, token };
}

// ── Logout ──
async function logout(userId: string) {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  user.tokenversion += 1;
  await user.save();
}

// ── Get user by ID ──
async function getUserById(userId: string) {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}

// ── Update password ──
async function updatePassword(email: string, newPassword: string) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }
  if (newPassword.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long");
  }
  user.password = newPassword;
  user.tokenversion += 1;
  await user.save();
}

export { signup, verifySignupOtp, login, logout, getUserById, updatePassword, googleLogin };
