import { NextFunction, Request, Response } from "express";
import { COOKIE_OPTIONS, REFRESH_COOKIE } from "../../constants/cookie";
import { authService } from "../../services/auth/auth.service";
import { successResponse } from "../../libs/responseHelper";

export const refreshController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies[REFRESH_COOKIE];
    const deviceInfo = req.headers["user-agent"];
    const ip = req.ip;

    const result = await authService.refresh(refreshToken, deviceInfo, ip);

    successResponse(
      res.cookie(REFRESH_COOKIE, result?.refreshToken, COOKIE_OPTIONS),
      200,
      "Làm mới token thành công",
      {
        accessToken: result?.accessToken,
        isSettingGoal: result?.isSettingGoal,
        user: result?.user,
      },
    );
  } catch (error) {
    res.clearCookie(REFRESH_COOKIE);
    next(error);
  }
};
