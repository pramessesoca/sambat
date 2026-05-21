export function getQueueConnection() {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    throw new Error("REDIS_URL is required for queue operations.");
  }

  return {
    url: redisUrl,
  };
}

