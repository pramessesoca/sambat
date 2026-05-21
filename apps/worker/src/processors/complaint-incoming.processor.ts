import { ComplaintIncomingJob, QueueName } from "@sambat/types";
import { Job } from "bullmq";

import { aiClassificationQueue, analyticsQueue } from "../queues.js";

export async function processIncomingComplaint(job: Job<ComplaintIncomingJob>) {
  await Promise.all([
    aiClassificationQueue.add("complaint.classify", job.data, {
      jobId: `ai-classification-${job.data.complaintId}`,
    }),
    analyticsQueue.add("complaint.received", job.data, {
      jobId: `analytics-complaint-${job.data.complaintId}`,
    }),
  ]);

  return {
    complaintId: job.data.complaintId,
    queued: [QueueName.AI_CLASSIFICATION, QueueName.ANALYTICS],
  };
}

