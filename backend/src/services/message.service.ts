import { ChatModel } from "../models/chat.model";
import { MessageModel } from "../models/message.model";
import { MessageSchemaType } from "../validators/message.validator";
import { NotFoundError } from "../utils/app-error";
import cloudinary from "../config/couldinary.config";

export const sendMessageService = async (
  userId: string,
  body: MessageSchemaType
) => {
  const { chatId, content, image, replyTo } = body;
  const chat = await ChatModel.findOne({
    _id: chatId,
    participants: { $in: [userId] },
  });
  if (!chat) {
    throw new NotFoundError("chat not found");
  }
  if (replyTo) {
    const repliedMessage = await MessageModel.findById(replyTo);
    if (!repliedMessage) {
      throw new NotFoundError("replied message not found");
    }
  }
  let imageUrl = null;
  if (image) {
    const uploadedImage = await cloudinary.uploader.upload(image);
    imageUrl = uploadedImage.secure_url;
  }

  const newMessage = await MessageModel.create({
    chatId,
    sender: userId,
    content,
    image: imageUrl,
    replyTo: replyTo || null,
  });
  await newMessage.populate([
    {
      path: "sender",
      select: "name avatar",
    },
    {
      path: "replyTo",
      select: "content image sender",
      populate: {
        path: "sender",
        select: "name avatar",
      },
    },
  ]);
  return {
    message: newMessage,
    chat,
  };
};
