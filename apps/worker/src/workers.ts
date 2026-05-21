import { AiClassificationJob, ComplaintIncomingJob, QueueName } from "@sambat/types";
import { Worker } from "bullmq";

import { processAiClassification } from "./processors/ai-classification.processor.js";
import { processIncomingComplaint } from "./processors/complaint-incoming.processor.js";
import { createRedisConnection } from "./redis.js";

export function startWorkers() {
  const incomingWorker = new Worker<ComplaintIncomingJob>(QueueName.COMPLAINT_INCOMING, processIncomingComplaint, {
    connection: createRedisConnection(),
  });
  const aiWorker = new Worker<AiClassificationJob>(QueueName.AI_CLASSIFICATION, processAiClassification, {
    connection: createRedisConnection(),
    concurrency: Number(process.env.AI_WORKER_CONCURRENCY ?? 2),
  });

  for (const worker of [incomingWorker, aiWorker]) {
    worker.on("failed", (job, error) => {
      console.error(`${worker.name} job ${job?.id ?? "unknown"} failed`, error);
    });
  }

  return [incomingWorker, aiWorker];
}

