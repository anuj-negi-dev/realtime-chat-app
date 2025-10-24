import { Router } from "express";
import { deleteUser, getAllUser } from "../controllers/user.controller";
import { passportAuthenticateJwt } from "../config/passport.config";

const userRouter = Router();

userRouter.delete("/delete/:userId", passportAuthenticateJwt, deleteUser);

userRouter.get("get-all-users", passportAuthenticateJwt, getAllUser);

export default userRouter;
