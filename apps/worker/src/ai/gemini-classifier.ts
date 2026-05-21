import { GoogleGenAI } from "@google/genai";
import { AiComplaintClassification } from "@sambat/types";

import { aiClassificationSchema } from "./classification.schema.js";

const classificationJsonSchema = {
  additionalProperties: false,
  properties: {
    agencyName: {
      description: "Recommended Kabupaten Madiun agency name.",
      type: "string",
    },
    autoReply: {
      description: "Short Indonesian acknowledgement for the reporter.",
      type: "string",
    },
    category: {
      description: "Complaint category.",
      type: "string",
    },
    priority: {
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      type: "string",
    },
    summary: {
      description: "Anonymous short Indonesian summary.",
      type: "string",
    },
  },
  required: ["agencyName", "autoReply", "category", "priority", "summary"],
  type: "object",
} as const;

export async function classifyComplaint(message: string): Promise<AiComplaintClassification> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is required for AI classification.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    config: {
      responseJsonSchema: classificationJsonSchema,
      responseMimeType: "application/json",
    },
    contents: [
      "Klasifikasikan aduan masyarakat Kabupaten Madiun berikut.",
      "Ringkasan harus anonim dan tidak memuat identitas pelapor.",
      `Aduan: ${message}`,
    ],
    model: process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
  });

  return aiClassificationSchema.parse(JSON.parse(response.text ?? "{}"));
}

