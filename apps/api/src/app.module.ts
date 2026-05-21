import { Module } from "@nestjs/common";

import { AgenciesModule } from "./agencies/agencies.module.js";
import { AuthModule } from "./auth/auth.module.js";
import { ComplaintsModule } from "./complaints/complaints.module.js";
import { DatabaseModule } from "./database/database.module.js";
import { HealthController } from "./health.controller.js";
import { TelegramModule } from "./telegram/telegram.module.js";

@Module({
  imports: [AgenciesModule, AuthModule, ComplaintsModule, DatabaseModule, TelegramModule],
  controllers: [HealthController],
})
export class AppModule {}
