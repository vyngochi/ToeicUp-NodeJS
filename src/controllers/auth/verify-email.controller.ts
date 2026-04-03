import { NextFunction, Request, Response } from "express";
import { mailService } from "../../services/mail/mail.service";
import { successResponse } from "../../libs/responseHelper";
import { COOKIE_OPTIONS, REFRESH_COOKIE } from "../../constants/cookie";

export const verifyRegisterEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.params.token as string;
    const deviceInfo = req.headers["user-agent"];
    const ip = req.ip;

    const result = await mailService.verifyEmail(token, deviceInfo, ip);

    res.cookie(REFRESH_COOKIE, result.refreshToken, COOKIE_OPTIONS);

    successResponse(res, 200, result.message, {
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
};
