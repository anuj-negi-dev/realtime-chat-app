import { Request, Response } from "express";
import { Types } from "mongoose";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { getAllUserService } from "../services/user.service";
import { HttpStatus } from "../config/http.config";
import { deleteUserService } from "../services/auth.service";
import { clearJwtAuthCookie } from "../utils/cookie";

export const getAllUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const users = await getAllUserService(userId);
  return res.status(HttpStatus.OK).json({
    message: "user retrieved successfully",
    users,
  });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  let objectId: Types.ObjectId;
  try {
    objectId = new Types.ObjectId(userId);
  } catch (e) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      message: "invalid user id",
    });
  }
  const user = await deleteUserService(objectId);
  if (!user) {
    return res.status(HttpStatus.NOT_FOUND).json({
      message: "user not found",
    });
  }
  clearJwtAuthCookie(res);
  return res.status(HttpStatus.OK).json({
    message: "user deleted successfully",
  });
});
