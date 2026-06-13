import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error";
import { HttpStatus } from "../constants/http-status";
import { Messages } from "../constants/messages";
import { ApiResponseBody } from "../utils/api-response";

export const errorMiddleware = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const isAppError = err instanceof AppError;

  const statusCode = isAppError ? err.statusCode : HttpStatus.INTERNAL_SERVER_ERROR;
  const message = err.message || Messages.SERVER_ERROR;

  if (!isAppError) {
    console.error(`[Unexpected Error]`, err);
  }

  const responseBody: ApiResponseBody & { stack?: string } = {
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  };

  res.status(statusCode).json(responseBody);
};
