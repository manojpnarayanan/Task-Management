import { Response } from "express";
import { HttpStatus } from "../constants/http-status";

export interface ApiResponseBody<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export class ApiResponse {
  static success<T>(res: Response, data: T, message: string = "Success", statusCode: HttpStatus = HttpStatus.OK): Response {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    } as ApiResponseBody<T>);
  }

  static created<T>(res: Response, data: T, message: string = "Created successfully"): Response {
    return res.status(HttpStatus.CREATED).json({
      success: true,
      message,
      data,
    } as ApiResponseBody<T>);
  }

  static error(res: Response, message: string, statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR): Response {
    return res.status(statusCode).json({
      success: false,
      message,
    } as ApiResponseBody);
  }
}
