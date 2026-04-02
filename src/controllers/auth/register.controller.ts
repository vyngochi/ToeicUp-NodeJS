import { NextFunction, Request, Response } from "express";
import { authService } from "../../services/auth/auth.service";
import { successResponse } from "../../libs/responseHelper";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const registerData = req.body;

    const { message } = await authService.register(registerData);

    successResponse(res, 201, message);
  } catch (error) {
    next(error);
  }
};
