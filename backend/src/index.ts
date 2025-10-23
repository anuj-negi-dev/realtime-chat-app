import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";
import { HttpStatus } from "./config/http.config";
import { Env } from "./config/env.config";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: Env.Frontend_URL,
    credentials: true,
  })
);

app.get(
  "/health",
  asyncHandler(async (req: Request, res: Response) => {
    res.status(HttpStatus.OK).json({
      message: "server is healthy",
      status: "OK",
    });
  })
);

app.listen(Env.PORT, () => {
  console.log(
    `server is listening on port ${Env.PORT} in ${Env.NODE_ENV} mode`
  );
});
