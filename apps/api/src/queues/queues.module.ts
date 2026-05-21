import { Module } from "@nestjs/common";

import { ComplaintQueueService } from "./complaint-queue.service.js";

@Module({
  exports: [ComplaintQueueService],
  providers: [ComplaintQueueService],
})
export class QueuesModule {}

