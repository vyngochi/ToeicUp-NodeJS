import { NextFunction, Response } from "express";
import { AuthRequest } from "../../middlewares/authenticate";
import { profileService } from "../../services/user/profile.services";
import { successResponse } from "../../libs/responseHelper";
import { HttpStatus } from "../../constants/enums/status-code";

export const UploadAvatarController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId as string;
    const { avatarUrl } = req.body;

    const { message, avatarUrlUploaded } = await profileService.uploadAvatar(
      userId,
      avatarUrl,
    );

    successResponse(res, HttpStatus.OK, message, avatarUrlUploaded);
  } catch (error) {
    next(error);
  }
};
