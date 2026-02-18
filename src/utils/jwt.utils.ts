import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;

export function generateToken(userId: string, tokenVersion: number) {
  return jwt.sign({ userId, tokenVersion }, JWT_SECRET, { expiresIn: "1h" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
