import { ErrorRequestHandler } from "express";
import { HttpStatus } from "../config/http.config";
import { AppError, ErrorCodes } from "../utils/app-error";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.error(`Error occurred: ${req.path}`, error);

  if (error instanceof ZodError) {
    const validationErrors = error.issues.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));

    return res.status(HttpStatus.BAD_REQUEST).json({
      message: "Validation failed",
      errors: validationErrors,
      errorCode: ErrorCodes.ERR_BAD_REQUEST,
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      errorCode: error.errorCode,
    });
  }

  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    message: "Internal server error",
    error: error.message ?? "Something went wrong",
    errorCode: ErrorCodes.ERR_INTERNAL,
  });
};
