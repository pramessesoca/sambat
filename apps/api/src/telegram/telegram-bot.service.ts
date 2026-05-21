import { Injectable, OnApplicationBootstrap, OnModuleDestroy } from "@nestjs/common";
import { Context, Telegraf } from "telegraf";
import { message } from "telegraf/filters";

import { ComplaintsService } from "../complaints/complaints.service.js";
import { ImageAttachment } from "../storage/image-attachment.types.js";
import { validateImageAttachments } from "../storage/image-validation.js";
import { TelegramFileService } from "./telegram-file.service.js";

const ACCEPTED_REPLY = "Aduan Anda sudah diterima dan akan diproses.";
const MISSING_TEXT_REPLY = "Kirim aduan sebagai teks atau sertakan deskripsi pada caption gambar.";
const UNSUPPORTED_ATTACHMENT_REPLY = "Attachment hanya boleh berupa gambar maksimal 5 MB.";

@Injectable()
export class TelegramBotService implements OnApplicationBootstrap, OnModuleDestroy {
  private bot?: Telegraf;

  constructor(
    private readonly complaintsService: ComplaintsService,
    private readonly fileService: TelegramFileService,
  ) {}

  onApplicationBootstrap() {
    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
      return;
    }

    this.bot = new Telegraf(token);
    this.bot.start((ctx) => ctx.reply("Kirim aduan sebagai teks atau gambar dengan caption."));
    this.bot.on(message("text"), (ctx) => this.handleText(ctx));
    this.bot.on(message("photo"), (ctx) => this.handlePhoto(ctx));
    this.bot.on(message("document"), (ctx) => this.handleDocument(ctx));
    this.bot.on(message("video"), (ctx) => ctx.reply(UNSUPPORTED_ATTACHMENT_REPLY));
    this.bot.on(message("audio"), (ctx) => ctx.reply(UNSUPPORTED_ATTACHMENT_REPLY));
    this.bot.on(message("voice"), (ctx) => ctx.reply(UNSUPPORTED_ATTACHMENT_REPLY));
    this.bot.on(message("animation"), (ctx) => ctx.reply(UNSUPPORTED_ATTACHMENT_REPLY));
    this.bot.catch((error) => {
      console.error("Telegram bot update failed", error);
    });

    void this.bot.launch();
  }

  async onModuleDestroy() {
    this.bot?.stop("api-shutdown");
  }

  private async handleText(ctx: Context & { message: { text: string } }) {
    await this.acceptComplaint(ctx, ctx.message.text, []);
  }

  private async handlePhoto(ctx: Context & { message: { caption?: string; photo: Array<{ file_id: string; file_size?: number; file_unique_id: string }> } }) {
    const photo = ctx.message.photo.at(-1);

    if (!ctx.message.caption || !photo) {
      await ctx.reply(MISSING_TEXT_REPLY);
      return;
    }

    const image = await this.fileService.downloadImage(ctx, {
      fileId: photo.file_id,
      fileName: `${photo.file_unique_id}.jpg`,
      fileSize: photo.file_size,
      mimeType: "image/jpeg",
    });

    await this.acceptComplaint(ctx, ctx.message.caption, [image]);
  }

  private async handleDocument(
    ctx: Context & {
      message: {
        caption?: string;
        document: {
          file_id: string;
          file_name?: string;
          file_size?: number;
          file_unique_id: string;
          mime_type?: string;
        };
      };
    },
  ) {
    const document = ctx.message.document;

    if (!document.mime_type?.startsWith("image/")) {
      await ctx.reply(UNSUPPORTED_ATTACHMENT_REPLY);
      return;
    }

    if (!ctx.message.caption) {
      await ctx.reply(MISSING_TEXT_REPLY);
      return;
    }

    const image = await this.fileService.downloadImage(ctx, {
      fileId: document.file_id,
      fileName: document.file_name ?? `${document.file_unique_id}.image`,
      fileSize: document.file_size,
      mimeType: document.mime_type,
    });

    await this.acceptComplaint(ctx, ctx.message.caption, [image]);
  }

  private async acceptComplaint(ctx: Context, messageText: string, images: ImageAttachment[]) {
    validateImageAttachments(images);
    await this.complaintsService.createTelegramComplaint(messageText, this.getSender(ctx), images);
    await ctx.reply(ACCEPTED_REPLY);
  }

  private getSender(ctx: Context) {
    return `telegram:${ctx.from?.id ?? ctx.chat?.id ?? "unknown"}`;
  }
}
