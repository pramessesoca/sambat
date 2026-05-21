import { Module } from "@nestjs/common";

import { ComplaintsModule } from "../complaints/complaints.module.js";
import { TelegramBotService } from "./telegram-bot.service.js";
import { TelegramFileService } from "./telegram-file.service.js";

@Module({
  imports: [ComplaintsModule],
  providers: [TelegramBotService, TelegramFileService],
})
export class TelegramModule {}

