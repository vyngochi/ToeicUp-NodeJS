import { NextFunction, Request, Response } from "express";
import { mailService } from "../../services/mail/mail.service";
import { successResponse } from "../../libs/responseHelper";

export const verifyRegisterEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token } = req.body;
    const deviceInfo = req.headers["user-agent"];
    const ip = req.ip;

    const { accessToken, refreshToken, user } = await mailService.verifyEmail(
      token,
      deviceInfo,
      ip,
    );

    successResponse(res, 200, "Tài khoản đã được xác thực", {
      accessToken,
      refreshToken,
      user,
    });
  } catch (error) {
    next(error);
  }
};
