import ApiRouteUsage from "../apiUsage.model";
import { redis } from "../../../config/cache.redis";
import cron from "node-cron";
import overAllUsageModel from "../../overallUsage/overAllUsage.model";
import getCurrentYearMonth from "../../../utils/getCurrentYearMonth";
export const startApiUsageWorker = () => {
  cron.schedule("*/5 * * * *", async () => {
    console.log("Running API usage flush job...");
    await flushApiUsage();
  });
};
export const flushApiUsage = async () => {
  const stream = redis.scanStream({
    match: "apiUsage:*",
    count: 100,
  });
  for await (const keys of stream) {
    for (const key of keys) {
      const parts = key.split(":");

      const userId = parts[1];
      const apiKeyId = parts[2];
      const date = parts[3];
      const hour = parseInt(parts[4]);

      const totalRequests = await redis.get(`${key}:total`);

      if (!totalRequests) continue;

      await ApiRouteUsage.updateOne(
        { userId, apiKeyId, date, hour },
        {
          $inc: { totalRequests: Number(totalRequests) },
        },
        { upsert: true },
      );

      await overAllUsageModel.updateOne(
        {
          userId,
          month: getCurrentYearMonth.month,
          year: getCurrentYearMonth.year,
        },
        { $inc: { apiRequests: totalRequests } },
      );

      await redis.del(`${key}:total`);
    }
  }
};
