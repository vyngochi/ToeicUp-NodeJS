import { NextFunction, Request, Response } from "express";
import { COOKIE_OPTIONS, REFRESH_COOKIE } from "../../constants/cookie";
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
    const token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : null;

    const { message } = await authService.logout(token, refreshToken);

    successResponse(
      res.clearCookie(REFRESH_COOKIE, COOKIE_OPTIONS),
      200,
      message,
    );
    next();
  } catch (error) {
    next(error);
  }
};
