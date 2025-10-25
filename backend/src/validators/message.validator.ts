import { z } from "zod";

export const messageSchema = z
  .object({
    chatId: z.string().trim().min(1),
    senderId: z.string().trim().min(1),
    content: z.string().min(1).max(1000).optional(),
    image: z.string().trim().min(1).optional(),
    replyTo: z.string().trim().min(1).optional(),
  })
  .refine((data) => data.content || data.image, {
    message: "Either content or image must be provided.",
    path: ["content", "image"],
  });

export type MessageSchemaType = z.infer<typeof messageSchema>;
