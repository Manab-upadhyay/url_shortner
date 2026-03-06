import dotenv from "dotenv";
dotenv.config();

// BullMQ bundled its own ioredis, so we pass raw connection options
// instead of sharing an ioredis instance from cache.redis.ts.
const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const parsed = new URL(redisUrl);

export const redis = {
  host: parsed.hostname,
  port: Number(parsed.port) || 6379,
  ...(parsed.password ? { password: decodeURIComponent(parsed.password) } : {}),
  maxRetriesPerRequest: null as null, // required by BullMQ
};
