export type ServiceStatus = "ok" | "ready";

export enum UserRole {
  SUPERADMIN = "SUPERADMIN",
  AGENCY_ADMIN = "AGENCY_ADMIN",
}

export enum ComplaintSource {
  WEB = "WEB",
  TELEGRAM = "TELEGRAM",
  WHATSAPP = "WHATSAPP",
}

export enum ComplaintPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum ComplaintStatus {
  DITERIMA = "DITERIMA",
  DIPROSES = "DIPROSES",
  DITINDAKLANJUTI = "DITINDAKLANJUTI",
  SELESAI = "SELESAI",
}

export enum NotificationStatus {
  PENDING = "PENDING",
  SENT = "SENT",
  FAILED = "FAILED",
}

export type AgencySummary = {
  id: string;
  name: string;
};

export type ComplaintImageSummary = {
  id: string;
  objectPath: string;
};

export type AdminComplaintSummary = {
  agency: AgencySummary | null;
  aiSummary: string | null;
  category: string | null;
  createdAt: string;
  id: string;
  images: ComplaintImageSummary[];
  message: string;
  priority: ComplaintPriority;
  sender: string;
  source: ComplaintSource;
  status: ComplaintStatus;
  updatedAt: string;
};

export type PublicComplaintSummary = {
  agency: AgencySummary | null;
  category: string | null;
  createdAt: string;
  id: string;
  images: ComplaintImageSummary[];
  priority: ComplaintPriority;
  status: ComplaintStatus;
  summary: string;
  updatedAt: string;
};

export const QueueName = {
  AI_CLASSIFICATION: "ai-classification",
  ANALYTICS: "analytics",
  AUTO_REPLY: "auto-reply",
  COMPLAINT_INCOMING: "complaint-incoming",
  NOTIFICATION: "notification",
} as const;

export type QueueName = (typeof QueueName)[keyof typeof QueueName];

export type ComplaintIncomingJob = {
  complaintId: string;
};

export type AiClassificationJob = {
  complaintId: string;
};

export type AutoReplyJob = {
  complaintId: string;
  message: string;
};

export type NotificationJob = {
  complaintId: string;
  message: string;
};

export type AiComplaintClassification = {
  agencyName: string;
  autoReply: string;
  category: string;
  priority: ComplaintPriority;
  summary: string;
};
