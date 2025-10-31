import http from "node:http";
import { Server, Socket } from "socket.io";
import { Env } from "../config/env.config";
import jwt from "jsonwebtoken";
import { InternalServerError, UnauthorizedError } from "../utils/app-error";
import { validateChatParticipants } from "../services/chat.service";
import { MessageDocument } from "../models/message.model";
import { Types } from "mongoose";

interface AuthenticatedWS extends Socket {
  userId?: string;
}

const onlineUsers = new Map<string, string>();

let io: Server | null = null;

export const initializeSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: Env.Frontend_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(async (socket: AuthenticatedWS, next) => {
    try {
      const rawCookie = socket.handshake.headers.cookie;
      if (!rawCookie) {
        return next(new UnauthorizedError("Unauthorized"));
      }
      const token = rawCookie.split("=")?.[1].trim();
      if (!token) return next(new UnauthorizedError("Unauthorized"));

      const decodedToken = jwt.verify(token, Env.JWT_SECRET) as {
        userId: string;
      };

      if (!decodedToken) return next(new UnauthorizedError("Unauthorized"));

      socket.userId = decodedToken.userId;
      next();
    } catch (error) {
      next(new InternalServerError("Something went wrong"));
    }
  });

  io.on("connection", (socket: AuthenticatedWS) => {
    if (!socket.userId) {
      socket.disconnect(true);
      return;
    }
    const userId = socket.userId;
    const socketId = socket.id;

    onlineUsers.set(userId, socketId);

    io?.emit("online:users", Array.from(onlineUsers.keys()));

    socket.join(`user:${userId}`);

    socket.on(
      "chat:join",
      async (chatId: string, callback?: (err?: string) => void) => {
        try {
          await validateChatParticipants(chatId, userId);
          socket.join(`chat:${chatId}`);
          callback?.();
        } catch (error) {
          callback?.("Error joining chat");
        }
      }
    );

    socket.on("chat:leave", (chatId: string) => {
      if (chatId) {
        socket.leave(`chat:${chatId}`);
      }
    });

    socket.on("disconnect", () => {
      if (onlineUsers.get(userId) === socketId) {
        if (userId) onlineUsers.delete(userId);
        io?.emit("online:users", Array.from(onlineUsers.keys()));
      }
    });
  });
};

function getI0() {
  if (!io) throw new Error("socket io is not initialized");
  return io;
}

export const emitNewChatParticipant = (participants: string[], chat: any) => {
  const io = getI0();
  for (const participantId of participants) {
    io.to(`user:${participantId}`).emit("chat:new", chat);
  }
};

export const emitNewMessageToChatRoom = (
  senderId: string,
  chatId: string,
  message: MessageDocument
) => {
  const io = getI0();
  const senderSocketId = onlineUsers.get(senderId);

  if (senderSocketId) {
    io.to(`chat:${chatId}`).except(senderSocketId).emit("message:new", message);
  }
};

export const emitLastMessageToParticipants = (
  participantIds: string[],
  chatId: string,
  lastMessage: any
) => {
  const io = getI0();
  const payload = {
    chatId,
    lastMessage,
  };
  for (const participantId of participantIds) {
    io.to(`user:${participantId}`).emit("chat:update", payload);
  }
};
