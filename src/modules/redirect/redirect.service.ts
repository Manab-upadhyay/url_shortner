import Link from "../link/link.model";
import { analyticsQueue } from "../../queue/analytics.queue";
import { cacheRedis } from "../../config/cache.redis";

async function redirect(shortCode: string, ip: string, userAgent?: string) {
  const cachedUrl = await cacheRedis.get(`short:${shortCode}`);
  if (cachedUrl) {
    const parsed = JSON.parse(cachedUrl);
    console.log("returning from redis");
    analyticsQueue
      .add("trackClick", {
        linkId: parsed.linkId,
        shortCode,
        ip,
        userAgent,
      })
      .catch(() => {});

    return parsed.url;
  }
  const link = await Link.findOne({ shortCode });

  if (!link) {
    throw new Error("Link not found");
  }
  if (link.expiresAt && link.expiresAt < new Date()) {
    throw new Error("Link has expired");
  }
  await cacheRedis.set(
    `short:${shortCode}`,
    JSON.stringify({
      url: link.url,
      linkId: link._id.toString(),
    }),
    "EX",
    60 * 60 * 24,
  );
  await analyticsQueue.add("trackClick", {
    linkId: link._id,
    ip,
    userAgent,
  });

  return link.url;
}
export { redirect };
