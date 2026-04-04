import { NextFunction, Request, Response } from "express";
import { authService } from "../../services/auth/auth.service";
import { errorResponse, successResponse } from "../../libs/responseHelper";
import { COOKIE_OPTIONS, REFRESH_COOKIE } from "../../constants/cookie";

export const loginWithGGController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { idToken } = req.body;
    const deviceInfo = req.headers["user-agent"];
    const ip = req.ip;

    const response = await authService.loginWithGG(idToken, deviceInfo, ip);

    const user = {
      id: response.user.Id,
      email: response.user.Email,
      displayName: response.user.DisplayName,
      targetScore: response.user.TargetScore,
      streak: response.user.Streak,
      avatarUrl: response.user.AvatarUrl,
      wordsPerDay: response.user.WordsPerDay,
    };

    res.cookie(REFRESH_COOKIE, response.refreshToken.Token, COOKIE_OPTIONS);

    successResponse(res, 200, "Login thành công", {
      accessToken: response.accessToken,
      user: user,
    });
  } catch (error) {
    next(error);
  }
};
