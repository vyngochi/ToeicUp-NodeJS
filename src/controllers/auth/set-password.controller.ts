import { NextFunction, Request, Response } from "express";
import { authService } from "../../services/auth/auth.service";
import { successResponse } from "../../libs/responseHelper";
import { COOKIE_OPTIONS, REFRESH_COOKIE } from "../../constants/cookie";
import { HttpStatus } from "../../constants/enums/status-code";

export const setPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token, newPassword } = req.body;
    const deviceInfo = req.headers["user-agent"];
    const ip = req.ip;

    const result = await authService.setPassword(
      token,
      newPassword,
      deviceInfo,
      ip,
    );

    res.cookie(REFRESH_COOKIE, result.refreshToken.Token, COOKIE_OPTIONS);

    successResponse(res, HttpStatus.OK, result.message, {
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
};
