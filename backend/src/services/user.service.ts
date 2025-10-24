import { Types } from "mongoose";
import { UserModel } from "../models/user.model";

export const findByIdUserService = async (userId: Types.ObjectId) => {
  return await UserModel.findById(userId);
};

export const getAllUserService = async (userId: Types.ObjectId) => {
  const users = await UserModel.find({
    $id: {
      $ne: userId,
    },
  });
  return users;
};
