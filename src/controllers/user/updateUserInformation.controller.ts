import { NextFunction, Response } from "express";
import { AuthRequest } from "../../middlewares/authenticate";
import { errorResponse, successResponse } from "../../libs/responseHelper";
import jwt from "jsonwebtoken";
import { config } from "../../config";
import { profileService } from "../../services/user/profile.services";
import { HttpStatus } from "../../constants/enums/status-code";

export const UpdateUserInfoController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId as string;
    const { email, lastName, firstName, bio } = req.body;

    const result = await profileService.editUserInfo(
      userId,
      email,
      firstName,
      lastName,
      bio,
    );

    successResponse(res, HttpStatus.OK, result.message);
  } catch (error) {
    next(error);
  }
};
