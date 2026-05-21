import { BadRequestException } from "@nestjs/common";

import { ImageAttachment } from "./image-attachment.types.js";

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const IMAGE_MIME_PREFIX = "image/";

export function validateImageAttachments(files: ImageAttachment[]) {
  for (const file of files) {
    if (!file.mimetype.startsWith(IMAGE_MIME_PREFIX)) {
      throw new BadRequestException("All attachments must be images.");
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      throw new BadRequestException("Each image attachment must be 5 MB or smaller.");
    }
  }
}

