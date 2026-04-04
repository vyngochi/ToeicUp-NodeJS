import { errorResponse } from "../libs/responseHelper";
import { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import z, { ZodType } from "zod";

export const validate =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return errorResponse(
        res,
        400,
        null,
        z.flattenError(result.error).fieldErrors,
      );
    }

    req.body = result.data;
    next();
  };

export const limiter = (time: number, max: number) =>
  rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 10,
    message: { message: "Login quá nhiều lần, hãy thử lại sau 15 phút " },
  });
