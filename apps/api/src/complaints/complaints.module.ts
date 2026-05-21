import { Module } from "@nestjs/common";

import { StorageModule } from "../storage/storage.module.js";
import { QueuesModule } from "../queues/queues.module.js";
import { ComplaintsController } from "./complaints.controller.js";
import { ComplaintsService } from "./complaints.service.js";
import { PublicComplaintsController } from "./public-complaints.controller.js";

@Module({
  controllers: [ComplaintsController, PublicComplaintsController],
  exports: [ComplaintsService],
  imports: [QueuesModule, StorageModule],
  providers: [ComplaintsService],
})
export class ComplaintsModule {}
