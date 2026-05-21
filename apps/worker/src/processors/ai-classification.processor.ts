import { prisma } from "@sambat/database";
import { AiClassificationJob } from "@sambat/types";
import { Job } from "bullmq";

import { classifyComplaint } from "../ai/gemini-classifier.js";
import { autoReplyQueue, notificationQueue } from "../queues.js";

export async function processAiClassification(job: Job<AiClassificationJob>) {
  const complaint = await prisma.complaint.findUnique({
    select: {
      aiProcessedAt: true,
      id: true,
      message: true,
    },
    where: { id: job.data.complaintId },
  });

  if (!complaint) {
    throw new Error(`Complaint ${job.data.complaintId} was not found.`);
  }

  if (complaint.aiProcessedAt) {
    return {
      complaintId: complaint.id,
      skipped: "already-classified",
    };
  }

  const classification = await classifyComplaint(complaint.message);
  const agency = await prisma.agency.findFirst({
    select: { id: true },
    where: {
      name: {
        equals: classification.agencyName,
        mode: "insensitive",
      },
    },
  });

  await prisma.complaint.update({
    data: {
      agencyId: agency?.id,
      aiProcessedAt: new Date(),
      aiReply: classification.autoReply,
      aiSummary: classification.summary,
      category: classification.category,
      priority: classification.priority,
    },
    where: { id: complaint.id },
  });

  await Promise.all([
    autoReplyQueue.add(
      "complaint.auto-reply",
      {
        complaintId: complaint.id,
        message: classification.autoReply,
      },
      { jobId: `auto-reply-${complaint.id}` },
    ),
    notificationQueue.add(
      "complaint.classified",
      {
        complaintId: complaint.id,
        message: classification.summary,
      },
      { jobId: `notification-classified-${complaint.id}` },
    ),
  ]);

  return {
    agencyMatched: Boolean(agency),
    complaintId: complaint.id,
  };
}

