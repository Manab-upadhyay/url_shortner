export default function generateShortcode(length: number = 6): string {
  const chars =
    process.env.SHORTCODE_VALUE_CHARS ||
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let shortCode = "";

  for (let i = 0; i < length; i++) {
    shortCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return shortCode;
}
