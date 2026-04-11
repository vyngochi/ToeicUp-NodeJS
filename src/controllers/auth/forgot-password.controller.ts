import { NextFunction, Request, Response } from "express";
import { authService } from "../../services/auth/auth.service";
import { successResponse } from "../../libs/responseHelper";

export const forgotPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;

    const { message } = await authService.forgotPassword(email);

    successResponse(res, 200, message);
  } catch (error) {
    next(error);
  }
};

export const resetPasswordForgotController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token, newPassword } = req.body;

    await authService.resetForgotPassword(token, newPassword);

    successResponse(res, 200, "Đổi mật khẩu thành công");
  } catch (error) {
    next(error);
  }
};
