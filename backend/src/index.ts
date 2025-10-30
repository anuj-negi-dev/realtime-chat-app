import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import http from "node:http";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";
import { HttpStatus } from "./config/http.config";
import { Env } from "./config/env.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { connectToDB } from "./config/db.config";

import "./config/passport.config";
import router from "./routes";
import { initializeSocket } from "./lib/socket";

const app = express();

const server = http.createServer(app);

app.use(
  express.json({
    limit: "10mb",
  })
);
app.use(cookieParser());
app.use(
  cors({
    origin: Env.Frontend_URL,
    credentials: true,
  })
);

app.use(passport.initialize());

initializeSocket(server);

app.get(
  "/health",
  asyncHandler(async (req: Request, res: Response) => {
    res.status(HttpStatus.OK).json({
      message: "server is healthy",
      status: "OK",
    });
  })
);

app.use("/api", router);

app.use(errorHandler);

server.listen(Env.PORT, async () => {
  await connectToDB();
  console.log(
    `server is listening on port ${Env.PORT} in ${Env.NODE_ENV} mode`
  );
});
