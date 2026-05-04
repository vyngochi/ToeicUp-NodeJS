import { NextFunction, Response } from "express";
import { AuthRequest } from "../../middlewares/authenticate";
import { authService } from "../../services/auth/auth.service";
import { successResponse } from "../../libs/responseHelper";
import { HttpStatus } from "../../constants/enums/status-code";

export const setPasswordMeController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId!;
    const { newPassword } = req.body;

    const result = await authService.setPasswordMe(userId, newPassword);

    successResponse(res, HttpStatus.OK, result.message);
  } catch (error) {
    next(error);
  }
};
