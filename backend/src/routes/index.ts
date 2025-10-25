import { Router } from "express";
import authRoutes from "./auth.route";
import userRouter from "./user.route";
import chatRouter from "./chat.route";

const router = Router();

router.use("/auth", authRoutes);

router.use("/user", userRouter);

router.use("/chat", chatRouter);

export default router;
