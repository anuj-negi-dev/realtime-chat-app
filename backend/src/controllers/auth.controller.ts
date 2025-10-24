import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { loginSchema, registerSchema } from "../validators/auth.validator";
import {
  registerService,
  loginService,
  deleteUserService,
} from "../services/auth.service";
import { clearJwtAuthCookie, setJwtAuthCookie } from "../utils/cookie";
import { HttpStatus } from "../config/http.config";
import { Types } from "mongoose";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const body = registerSchema.parse(req.body);

  const user = await registerService(body);

  const userId = user._id;

  setJwtAuthCookie({
    res,
    userId,
  });

  return res.status(HttpStatus.CREATED).json({
    message: "user created successfully",
    user,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const body = loginSchema.parse(req.body);

  const user = await loginService(body);

  setJwtAuthCookie({
    res,
    userId: user._id,
  });

  return res.status(HttpStatus.OK).json({
    message: "user login successfully",
    user,
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  clearJwtAuthCookie(res);
  return res.status(HttpStatus.OK).json({
    message: "user logout successfully",
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

export const authStatus = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;
  return res.status(HttpStatus.OK).json({
    message: "authenticated user",
    user,
  });
});
