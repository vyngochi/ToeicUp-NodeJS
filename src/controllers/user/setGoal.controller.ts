import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../middlewares/authenticate";
import { profileService } from "../../services/user/profile.services";
import { successResponse } from "../../libs/responseHelper";
import { HttpStatus } from "../../constants/enums/status-code";

export const setGoalController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const email = req.user?.email!;
    const { targetScore, wordsPerDay } = req.body;

    const result = await profileService.setGoal(
      email,
      targetScore,
      wordsPerDay,
    );

    successResponse(res, HttpStatus.OK, result.message, result.response);
  } catch (error) {}
};
