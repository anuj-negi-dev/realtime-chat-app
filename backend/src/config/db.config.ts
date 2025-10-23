import mongoose from "mongoose";
import { Env } from "./env.config";

export const connectToDB = async () => {
  try {
    await mongoose.connect(Env.MONGO_URL);
    console.log("database connected successfully");
  } catch (error) {
    console.error("database connection error", error);
    process.exit(1);
  }
};
