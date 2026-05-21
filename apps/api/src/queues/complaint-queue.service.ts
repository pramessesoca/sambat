import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { ComplaintIncomingJob, QueueName } from "@sambat/types";
import { Queue } from "bullmq";

import { getQueueConnection } from "./queue.connection.js";

@Injectable()
export class ComplaintQueueService implements OnModuleDestroy {
  private incomingQueue?: Queue<ComplaintIncomingJob>;

  enqueueIncomingComplaint(complaintId: string) {
    return this.getIncomingQueue().add(
      "complaint.created",
      { complaintId },
      {
        jobId: `complaint-incoming-${complaintId}`,
      },
    );
  }

  async onModuleDestroy() {
    await this.incomingQueue?.close();
  }

  private getIncomingQueue() {
    this.incomingQueue ??= new Queue<ComplaintIncomingJob>(QueueName.COMPLAINT_INCOMING, {
      connection: getQueueConnection(),
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          delay: 2000,
          type: "exponential",
        },
        removeOnComplete: 200,
        removeOnFail: 500,
      },
    });

    return this.incomingQueue;
  }
}
