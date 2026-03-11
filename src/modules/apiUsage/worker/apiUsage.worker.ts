import ApiRouteUsage from "../apiUsage.model";
import { redis } from "../../../config/cache.redis";
import cron from "node-cron";
import overAllUsageModel from "../../overallUsage/overAllUsage.model";
import getCurrentYearMonth from "../../../utils/getCurrentYearMonth";
import logger from "../../../utils/logger";
export const startApiUsageWorker = () => {
  cron.schedule("*/5 * * * *", async () => {
    logger.info("Running API usage flush job...");
    await flushApiUsage();
  });
};
export const flushApiUsage = async () => {
  const stream = redis.scanStream({
    match: "apiUsage:*:total",
    count: 100,
  });

  let keysFlushed = 0;

  for await (const keys of stream) {
    if (keys.length > 0) {
       logger.info(`Found ${keys.length} API usage keys to flush...`);
    }
    
    for (const key of keys) {
      const parts = key.split(":");

      const userId = parts[1];
      const apiKeyId = parts[2];
      const date = parts[3];
      const hour = parseInt(parts[4]);

      const totalRequests = await redis.get(key);
     
      if (!totalRequests) continue;

      const count = Number(totalRequests);

      await ApiRouteUsage.updateOne(
        { userId, apiKeyId, date, hour },
        { $inc: { totalRequests: count } },
        { upsert: true },
      );

      const { month, year } = getCurrentYearMonth();

      await overAllUsageModel.updateOne(
        { userId, month, year },
        { $inc: { apiRequests: count } },
        { upsert: true },
      );

      await redis.del(key);
      keysFlushed++;
    }
  }

  logger.info(`Flush completed. Total keys flushed this cycle: ${keysFlushed}`);
};
