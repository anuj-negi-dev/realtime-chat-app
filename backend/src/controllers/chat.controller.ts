import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { createChatSchema } from "../validators/chat.validator";
import {
  createChatService,
  getUsersChatsService,
} from "../services/chat.service";
import { HttpStatus } from "../config/http.config";

export const createChat = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  const body = createChatSchema.parse(req.body);

  const chat = await createChatService(userId, body);

  return res.status(HttpStatus.OK).json({
    message: "chat created successfully",
    chat,
  });
});

export const getUserChats = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const chats = await getUsersChatsService(userId);

    return res.status(HttpStatus.OK).json({
      message: "chats retrieved successfully",
      chats,
    });
  }
);

export const getSingleChat = asyncHandler(
  async (req: Request, res: Response) => {}
);
