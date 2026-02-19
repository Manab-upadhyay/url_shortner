import Link from "../link/link.model";

async function redirect(shortCode: string) {
  const link = await Link.findOneAndUpdate(
    { shortCode },
    { $inc: { clicks: 1 } },
    { new: true },
  );
  if (!link) {
    throw new Error("Link not found");
  }
  if (link.expiresAt && link.expiresAt < new Date()) {
    throw new Error("Link has expired");
  }

  return link.url;
}
export { redirect };
