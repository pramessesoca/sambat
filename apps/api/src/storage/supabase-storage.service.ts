import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";

import { ImageAttachment, StoredImageAttachment } from "./image-attachment.types.js";

@Injectable()
export class SupabaseStorageService {
  private readonly bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "sambat-images";
  private readonly client: SupabaseClient | null;

  constructor() {
    const url = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    this.client = url && serviceRoleKey ? createClient(url, serviceRoleKey) : null;
  }

  async uploadComplaintImages(complaintId: string, files: ImageAttachment[]): Promise<StoredImageAttachment[]> {
    if (!files.length) {
      return [];
    }

    if (!this.client) {
      throw new InternalServerErrorException("Supabase Storage is not configured.");
    }

    return Promise.all(
      files.map(async (file) => {
        const objectPath = `complaints/${complaintId}/${randomUUID()}-${this.sanitizeName(file.originalname)}`;
        const { error } = await this.client!.storage.from(this.bucket).upload(objectPath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

        if (error) {
          throw new InternalServerErrorException(`Image upload failed: ${error.message}`);
        }

        return {
          mimeType: file.mimetype,
          objectPath,
          sizeBytes: file.size,
        };
      }),
    );
  }

  private sanitizeName(name: string) {
    return name.replace(/[^a-zA-Z0-9._-]/g, "-");
  }
}

