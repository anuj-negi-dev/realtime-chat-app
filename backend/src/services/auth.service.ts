import { UserModel } from "../models/user.model";
import { BadRequestError } from "../utils/app-error";
import { compareValue } from "../utils/bcrypt";
import {
  LoginSchemaType,
  RegisterSchemaType,
} from "../validators/auth.validator";
import { Types } from "mongoose";

export const registerService = async (body: RegisterSchemaType) => {
  const { name, email, password, avatar } = body;
  const existingUser = await UserModel.findOne({
    email,
  });
  if (existingUser) {
    throw new BadRequestError("Email already exists");
  }
  const newUser = await UserModel.create({
    name,
    email,
    password,
    avatar,
  });
  const { password: userPassword, ...newUserWithOutPassword } =
    newUser.toObject();
  return newUserWithOutPassword;
};

export const loginService = async (body: LoginSchemaType) => {
  const { email, password } = body;
  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) {
    throw new BadRequestError("Invalid email or password");
  }
  const isPasswordValid = await compareValue(password, user.password);
  if (!isPasswordValid) {
    throw new BadRequestError("Invalid email or password");
  }
  const { password: userPassword, ...userWithOutPassword } = user.toObject();
  return userWithOutPassword;
};

export const deleteUserService = async (userId: Types.ObjectId) => {
  return await UserModel.findByIdAndDelete(userId);
};
