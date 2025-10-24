import { Router } from "express";
import {
  login,
  logout,
  register,
  authStatus,
} from "../controllers/auth.controller";
import { passportAuthenticateJwt } from "../config/passport.config";

const authRoutes = Router();

authRoutes.post("/register", register);

authRoutes.post("/login", login);

authRoutes.post("/logout", passportAuthenticateJwt, logout);

authRoutes.get("/status", passportAuthenticateJwt, authStatus);

export default authRoutes;
