import {
  AdminComplaintSummary,
  ComplaintPriority,
  ComplaintSource,
  ComplaintStatus,
  PublicComplaintSummary,
} from "@sambat/types";

import { complaintSelect } from "./complaint.select.js";
import { Prisma } from "@sambat/database";

type ComplaintRecord = Prisma.ComplaintGetPayload<{ select: typeof complaintSelect }>;

export function toAdminComplaint(complaint: ComplaintRecord): AdminComplaintSummary {
  return {
    agency: complaint.agency,
    aiSummary: complaint.aiSummary,
    category: complaint.category,
    createdAt: complaint.createdAt.toISOString(),
    id: complaint.id,
    images: complaint.images,
    message: complaint.message,
    priority: complaint.priority as ComplaintPriority,
    sender: complaint.sender,
    source: complaint.source as ComplaintSource,
    status: complaint.status as ComplaintStatus,
    updatedAt: complaint.updatedAt.toISOString(),
  };
}

export function toPublicComplaint(complaint: ComplaintRecord): PublicComplaintSummary {
  return {
    agency: complaint.agency,
    category: complaint.category,
    createdAt: complaint.createdAt.toISOString(),
    id: complaint.id,
    images: complaint.images,
    priority: complaint.priority as ComplaintPriority,
    status: complaint.status as ComplaintStatus,
    summary: complaint.aiSummary ?? "Aduan menunggu ringkasan.",
    updatedAt: complaint.updatedAt.toISOString(),
  };
}
