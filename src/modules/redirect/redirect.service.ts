import Link from "../link/link.model";
import { analyticsQueue } from "../../queue/analytics.queue";

async function redirect(shortCode: string, ip: string, userAgent?: string) {
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
  await analyticsQueue.add("trackClick", {
    linkId: link._id,
    ip,
    userAgent,
  });

  return link.url;
}
export { redirect };
