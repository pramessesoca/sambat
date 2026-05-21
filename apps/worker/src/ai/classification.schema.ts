import { ComplaintPriority } from "@sambat/types";
import { z } from "zod";

export const aiClassificationSchema = z.object({
  agencyName: z.string().min(2).max(160),
  autoReply: z.string().min(8).max(1000),
  category: z.string().min(2).max(160),
  priority: z.enum(ComplaintPriority),
  summary: z.string().min(8).max(500),
});

