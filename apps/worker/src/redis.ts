import { Redis } from "ioredis";

export function createRedisConnection() {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    throw new Error("REDIS_URL is required to start Sambat workers.");
  }

  return new Redis(redisUrl, {
    maxRetriesPerRequest: null,
  });
}
