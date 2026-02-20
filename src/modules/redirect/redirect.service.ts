import Link from "../link/link.model";
import { analyticsQueue } from "../../queue/analytics.queue";
import { cacheRedis } from "../../config/cache.redis";

async function redirect(shortCode: string, ip: string, userAgent?: string) {
  const chachedUrl = await cacheRedis.get(`short:${shortCode}`);
  if (chachedUrl) {
    await analyticsQueue.add("trackClick", {
      shortCode,
      ip,
      userAgent,
    });

    return chachedUrl;
  }
  const link = await Link.findOne({ shortCode });

  if (!link) {
    throw new Error("Link not found");
  }
  if (link.expiresAt && link.expiresAt < new Date()) {
    throw new Error("Link has expired");
  }
  await cacheRedis.set(`short:${shortCode}`, link.url, "EX", 60 * 60 * 24);
  await analyticsQueue.add("trackClick", {
    linkId: link._id,
    ip,
    userAgent,
  });

  return link.url;
}
export { redirect };
