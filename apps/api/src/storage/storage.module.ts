import { Module } from "@nestjs/common";

import { SupabaseStorageService } from "./supabase-storage.service.js";

@Module({
  exports: [SupabaseStorageService],
  providers: [SupabaseStorageService],
})
export class StorageModule {}

