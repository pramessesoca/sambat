export type ImageAttachment = {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
};

export type StoredImageAttachment = {
  mimeType: string;
  objectPath: string;
  sizeBytes: number;
};

