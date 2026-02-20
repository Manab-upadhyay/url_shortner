import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.config";

export const analyticsQueue = new Queue("analyticsQueue", {
  connection: redisConnection,
});
