import { Request } from "express";
import passport from "passport";
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from "passport-jwt";
import { Types } from "mongoose";
import { UnauthorizedError } from "../utils/app-error";
import { Env } from "./env.config";
import { findByIdUserService } from "../services/user.service";

const cookieExtractor = (req: Request) => {
  const token = req.cookies.accessToken;
  if (!token) throw new UnauthorizedError("Unauthorized user");
  return token;
};

const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
  secretOrKey: Env.JWT_SECRET!,
  audience: "user",
  algorithms: ["HS256"],
};

passport.use(
  new JwtStrategy(
    jwtOptions,
    async (
      payload: { userId: Types.ObjectId },
      done: (error: any, user?: any, info?: any) => void
    ) => {
      try {
        const user =
          payload.userId && (await findByIdUserService(payload.userId));
        return done(null, user ?? false);
      } catch (error) {
        return done(null, false);
      }
    }
  )
);

export const passportAuthenticateJwt = passport.authenticate("jwt", {
  session: false,
});
