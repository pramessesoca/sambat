import { Injectable, NotFoundException } from "@nestjs/common";
import { ComplaintSource, UserRole } from "@sambat/types";

import { AuthUser } from "../auth/auth.types.js";
import { PrismaService } from "../database/prisma.service.js";
import { ComplaintQueueService } from "../queues/complaint-queue.service.js";
import { ImageAttachment } from "../storage/image-attachment.types.js";
import { SupabaseStorageService } from "../storage/supabase-storage.service.js";
import { complaintSelect } from "./complaint.select.js";
import { toAdminComplaint, toPublicComplaint } from "./complaint.presenter.js";
import { CreateWebComplaintDto } from "./dto/create-web-complaint.dto.js";
import { UpdateComplaintDto } from "./dto/update-complaint.dto.js";

@Injectable()
export class ComplaintsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly queueService: ComplaintQueueService,
    private readonly storageService: SupabaseStorageService,
  ) {}

  createWebComplaint(dto: CreateWebComplaintDto, files: ImageAttachment[]) {
    return this.createComplaint({
      files,
      message: dto.message,
      sender: dto.sender,
      source: ComplaintSource.WEB,
    });
  }

  createTelegramComplaint(message: string, sender: string, files: ImageAttachment[]) {
    return this.createComplaint({
      files,
      message,
      sender,
      source: ComplaintSource.TELEGRAM,
    });
  }

  private async createComplaint(input: {
    files: ImageAttachment[];
    message: string;
    sender: string;
    source: ComplaintSource;
  }) {
    const complaint = await this.prismaService.client.complaint.create({
      data: {
        message: input.message,
        sender: input.sender,
        source: input.source,
      },
      select: complaintSelect,
    });

    const images = await this.storageService.uploadComplaintImages(complaint.id, input.files);

    const savedComplaint = images.length
      ? await this.prismaService.client.complaint.update({
          data: {
            images: {
              createMany: {
                data: images,
              },
            },
          },
          select: complaintSelect,
          where: { id: complaint.id },
        })
      : complaint;

    await this.queueService.enqueueIncomingComplaint(savedComplaint.id);

    return toAdminComplaint(savedComplaint);
  }

  async listAdminComplaints(user: AuthUser) {
    const complaints = await this.prismaService.client.complaint.findMany({
      orderBy: { createdAt: "desc" },
      select: complaintSelect,
      where:
        user.role === UserRole.AGENCY_ADMIN
          ? {
              agency: {
                users: {
                  some: { id: user.sub },
                },
              },
            }
          : undefined,
    });

    return complaints.map(toAdminComplaint);
  }

  async listPublicComplaints() {
    const complaints = await this.prismaService.client.complaint.findMany({
      orderBy: { createdAt: "desc" },
      select: complaintSelect,
    });

    return complaints.map(toPublicComplaint);
  }

  async getPublicComplaint(id: string) {
    const complaint = await this.prismaService.client.complaint.findUnique({
      select: complaintSelect,
      where: { id },
    });

    if (!complaint) {
      throw new NotFoundException("Complaint not found.");
    }

    return toPublicComplaint(complaint);
  }

  async updateComplaint(id: string, dto: UpdateComplaintDto, user: AuthUser) {
    if (user.role === UserRole.AGENCY_ADMIN) {
      const assignedComplaint = await this.prismaService.client.complaint.findFirst({
        select: { id: true },
        where: {
          agency: {
            users: {
              some: { id: user.sub },
            },
          },
          id,
        },
      });

      if (!assignedComplaint) {
        throw new NotFoundException("Complaint not found.");
      }
    }

    const complaint = await this.prismaService.client.complaint.update({
      data: dto,
      select: complaintSelect,
      where: { id },
    });

    return toAdminComplaint(complaint);
  }
}
