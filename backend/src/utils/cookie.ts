import jwt from "jsonwebtoken";
import { Response } from "express";
import { Env } from "../config/env.config";
import { Types } from "mongoose";

type Time = `${number}${"s" | "m" | "d" | "w" | "y"}`;

type Cookie = {
  res: Response;
  userId: Types.ObjectId;
};

export const setJwtAuthCookie = ({ res, userId }: Cookie) => {
  const payload = {
    userId,
  };
  const token = jwt.sign(payload, Env.JWT_SECRET as jwt.Secret, {
    expiresIn: Env.JWT_EXPIRES_IN as Time | "7d",
    issuer: "realtime-chat-app",
    audience: "user",
  });

  return res.cookie("accessToken", token, {
    httpOnly: true,
    secure: Env.NODE_ENV === "production" ? true : false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const clearJwtAuthCookie = (res: Response) => {
  return res.clearCookie("accessToken");
};
