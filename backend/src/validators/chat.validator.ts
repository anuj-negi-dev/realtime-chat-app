import { z } from "zod";

export const createChatSchema = z.object({
  participantId: z.string().trim().min(1).optional(),
  isGroup: z.boolean().optional(),
  participants: z.array(z.string().trim().min(1)).optional(),
  groupName: z.string().trim().min(1).optional(),
});

export const chatIdSchema = z.object({
  chatId: z.string().trim().min(1),
});

export type createChatType = z.infer<typeof createChatSchema>;
