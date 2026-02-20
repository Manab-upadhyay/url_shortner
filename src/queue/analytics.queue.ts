import { Queue } from "bullmq";
import { redis } from "../config/redis.config";

export const analyticsQueue = new Queue("analyticsQueue", {
  connection: redis,
});
