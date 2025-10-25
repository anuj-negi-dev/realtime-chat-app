import { Router } from "express";
import {
  createChat,
  getSingleChat,
  getUserChats,
} from "../controllers/chat.controller";
import { passportAuthenticateJwt } from "../config/passport.config";

const chatRouter = Router();

chatRouter.post("/create", passportAuthenticateJwt, createChat);

chatRouter.get("/all-chats", passportAuthenticateJwt, getUserChats);

chatRouter.get(
  "/get-single-chat/:chatId",
  passportAuthenticateJwt,
  getSingleChat
);

export default chatRouter;
