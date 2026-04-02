import { errorResponse } from "./../libs/responseHelper";
import { NextFunction, Request, Response } from "express";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
  }
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    return errorResponse(res, err.statusCode, err.message);
  }
  console.error(err);
  return errorResponse(res, 500, "Internal server error");
};
