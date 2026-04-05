import { COOKIE_OPTIONS, REFRESH_COOKIE } from "../../constants/cookie";
import { successResponse } from "../../libs/responseHelper";
import { authService } from "../../services/auth/auth.service";
import { NextFunction, Request, Response } from "express";

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const deviceInfo = req.headers["user-agent"];
    const ip = req.ip;

    const { message, accessToken, refreshToken, user, isSettingGoal } =
      await authService.login(email, password, deviceInfo, ip);

    res.cookie(REFRESH_COOKIE, refreshToken, COOKIE_OPTIONS);

    successResponse(res, 200, message, { accessToken, isSettingGoal, user });
  } catch (error) {
    next(error);
  }
};
