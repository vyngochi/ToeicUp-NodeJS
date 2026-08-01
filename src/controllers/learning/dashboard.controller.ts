import { NextFunction, Response } from "express";
import { VocabularyServices } from "../../services/learning/vocabulary.service";
import { successResponse } from "../../libs/responseHelper";
import { HttpStatus } from "../../constants/enums/status-code";
import { AuthRequest } from "../../middlewares/authenticate";
import { AppError } from "../../middlewares/error-handler";

export const getDashboardWordSetsController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "User not authenticated");
    }

    const result = await VocabularyServices.getDashboardWordSets(userId);

    successResponse(res, HttpStatus.OK, result.message, result.data);
  } catch (error) {
    next(error);
  }
};
