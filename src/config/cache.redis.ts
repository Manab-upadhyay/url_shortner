// cache.redis.ts
import { Redis } from "ioredis";

export const cacheRedis = new Redis({
  host: "127.0.0.1",
  port: 6379,
});
