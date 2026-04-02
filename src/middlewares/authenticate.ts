import { config } from "../config/index";
import { redis } from "../config/redis";
import { errorResponse } from "../libs/responseHelper";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return errorResponse(res, 401, "Unauthorized");
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, config.jwt.secret) as {
      id: string;
      email: string;
      role: string;
      jti: string;
    };

    const blacklisted = await redis.get(`blacklist:${payload.jti}`);

    if (blacklisted) {
      return errorResponse(res, 401, "Token revoked");
    }

    req.user = { userId: payload.id, email: payload.email, role: payload.role };

    next();
  } catch (error) {
    return errorResponse(res, 401, "Invalid token");
  }
};
