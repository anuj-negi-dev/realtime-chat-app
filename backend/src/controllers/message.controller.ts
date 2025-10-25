import { Request, Response } from "express";
import { messageSchema } from "../validators/message.validator";
import { sendMessageService } from "../services/message.service";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HttpStatus } from "../config/http.config";

export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const body = messageSchema.parse(req.body);
  const newMessage = await sendMessageService(userId, body);
  return res.status(HttpStatus.CREATED).json({
    message: "Message sent successfully",
    data: newMessage,
  });
});
