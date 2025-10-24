import { ChatModel } from "../models/chat.model";
import { UserModel } from "../models/user.model";
import { NotFoundError } from "../utils/app-error";
import { createChatType } from "../validators/chat.validator";

export const createChatService = async (
  userId: string,
  body: createChatType
) => {
  const { participantId, participants, groupName, isGroup } = body;
  let chat;
  let allParticipants = [];
  if (isGroup && groupName && participants?.length) {
    allParticipants = [userId, ...participants];
    chat = await ChatModel.create({
      isGroup,
      groupName,
      participants: allParticipants,
      createdBy: userId,
    });
  } else {
    const otherUser = await UserModel.findById(participantId);
    if (!otherUser) {
      throw new NotFoundError("user not found");
    }
    allParticipants = [userId, participantId];
    const existingChat = await ChatModel.findOne({
      participants: {
        $all: allParticipants,
        $size: 2,
      },
    }).populate("participants", "name avatar");
    if (existingChat) return existingChat;
    chat = await ChatModel.create({
      createdBy: userId,
      participants: allParticipants,
    });
  }
  return chat;
};

export const getUsersChatsService = async (userId: string) => {
  return await ChatModel.find({
    participants: {
      $in: [userId],
    },
  })
    .populate("participants", "name avatar")
    .populate({
      path: "lastMessage",
      populate: {
        path: "sender",
        select: "name avatar",
      },
    })
    .sort({ updatedAt: -1 });
};
