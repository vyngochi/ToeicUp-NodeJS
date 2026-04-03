import { NextFunction, Request, Response } from "express";
import { REFRESH_COOKIE } from "../../constants/cookie";
import { authService } from "../../services/auth/auth.service";
import { successResponse } from "../../libs/responseHelper";

export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies[REFRESH_COOKIE];
    const authHeader = req.headers.authorization!;
    const token = authHeader.slice(7);

    const { message } = await authService.logout(token, refreshToken);

    successResponse(res.clearCookie(REFRESH_COOKIE), 200, message);
  } catch (error) {
    next(error);
  }
};
