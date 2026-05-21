import { BadRequestException, Injectable } from "@nestjs/common";
import { Context } from "telegraf";

import { MAX_IMAGE_SIZE_BYTES } from "../storage/image-validation.js";
import { ImageAttachment } from "../storage/image-attachment.types.js";

type TelegramFileInput = {
  fileId: string;
  fileName: string;
  fileSize?: number;
  mimeType: string;
};

@Injectable()
export class TelegramFileService {
  async downloadImage(ctx: Context, input: TelegramFileInput): Promise<ImageAttachment> {
    if (input.fileSize && input.fileSize > MAX_IMAGE_SIZE_BYTES) {
      throw new BadRequestException("Each image attachment must be 5 MB or smaller.");
    }

    const fileUrl = await ctx.telegram.getFileLink(input.fileId);
    const response = await fetch(fileUrl);

    if (!response.ok) {
      throw new Error(`Telegram file download failed with status ${response.status}.`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    if (buffer.byteLength > this.maxDownloadBytes) {
      throw new BadRequestException("Each image attachment must be 5 MB or smaller.");
    }

    return {
      buffer,
      mimetype: input.mimeType,
      originalname: input.fileName,
      size: buffer.byteLength,
    };
  }

  private get maxDownloadBytes() {
    return Number(process.env.TELEGRAM_MAX_DOWNLOAD_BYTES ?? MAX_IMAGE_SIZE_BYTES);
  }
}

