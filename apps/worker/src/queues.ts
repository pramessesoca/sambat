import { AiClassificationJob, AutoReplyJob, ComplaintIncomingJob, NotificationJob, QueueName } from "@sambat/types";
import { Queue } from "bullmq";

import { createRedisConnection } from "./redis.js";

const connection = createRedisConnection();
const workerJobOptions = {
  attempts: 3,
  backoff: {
    delay: 2000,
    type: "exponential" as const,
  },
  removeOnComplete: 200,
  removeOnFail: 500,
};

export const aiClassificationQueue = new Queue<AiClassificationJob>(QueueName.AI_CLASSIFICATION, {
  connection,
  defaultJobOptions: workerJobOptions,
});

export const autoReplyQueue = new Queue<AutoReplyJob>(QueueName.AUTO_REPLY, {
  connection,
  defaultJobOptions: workerJobOptions,
});

export const notificationQueue = new Queue<NotificationJob>(QueueName.NOTIFICATION, {
  connection,
  defaultJobOptions: workerJobOptions,
});

export const analyticsQueue = new Queue<ComplaintIncomingJob>(QueueName.ANALYTICS, {
  connection,
  defaultJobOptions: workerJobOptions,
});

