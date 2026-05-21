export const complaintSelect = {
  agency: {
    select: {
      id: true,
      name: true,
    },
  },
  aiSummary: true,
  category: true,
  createdAt: true,
  id: true,
  images: {
    select: {
      id: true,
      objectPath: true,
    },
  },
  message: true,
  priority: true,
  sender: true,
  source: true,
  status: true,
  updatedAt: true,
} as const;

