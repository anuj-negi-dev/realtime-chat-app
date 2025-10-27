import { emitNewChatParticipant } from "../lib/socket";
import { ChatModel } from "../models/chat.model";
import { MessageModel } from "../models/message.model";
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
  const populatedChat = await chat?.populate("participants", "name avatar");
  const participantIdStrings = populatedChat?.participants.map((p) => {
    return p._id.toString();
  });
  emitNewChatParticipant(participantIdStrings, populatedChat);
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

export const getSingleChatService = async (userId: string, chatId: string) => {
  const chat = await ChatModel.findOne({
    _id: chatId,
    participants: {
      $in: [userId],
    },
  });
  if (!chat) {
    throw new NotFoundError("chat not found");
  }
  const messages = await MessageModel.find({ chatId })
    .populate("sender", "name avatar")
    .populate({
      path: "replyTo",
      select: "content image sender",
      populate: {
        path: "sender",
        select: "name avatar",
      },
    })
    .sort({ createdAt: 1 });
  return {
    chat,
    messages,
  };
};

export const validateChatParticipants = async (
  chatId: string,
  userId: string
) => {
  const chat = await ChatModel.findOne({
    _id: chatId,
    participants: {
      $in: [userId],
    },
  });
  if (!chat) throw new NotFoundError("User is not a participant");
  return chat;
};
