import { Response } from "express";

export const successResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data?: any,
) => {
  return res.status(statusCode).json({
    statusCode,
    message,
    data,
  });
};

export const errorResponse = (
  res: Response,
  statusCode: number,
  message?: string | null,
  errors?: Object,
) => {
  return res.status(statusCode).json({
    statusCode,
    ...(message && { message }),
    ...(errors && { errors }),
  });
};
