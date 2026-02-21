import crypto from "crypto";

export function generateRandomString(length: number = 32) {
  return crypto.randomBytes(length).toString("hex");
}
export function hashString(secret: string) {
  return crypto.createHash("sha256").update(secret).digest("hex");
}
