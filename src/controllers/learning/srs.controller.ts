import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../constants/enums/status-code";
import { AppError } from "../../middlewares/error-handler";
import { SRSServices } from "../../services/learning/srs.service";
import { AuthRequest } from "../../middlewares/authenticate";

export const getDailyReviewWordsController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "User not authenticated");
    }

    let wordSetId = req.query.wordSetId as string | undefined;
    if (wordSetId === "undefined" || wordSetId === "null" || wordSetId === "") {
      wordSetId = undefined;
    }
    const limit = parseInt(req.query.limit as string) || 20;

    const data = await SRSServices.getDailyReviewWords(
      userId,
      wordSetId,
      limit,
    );

    res.status(HttpStatus.OK).json({
      success: true,
      message: "Get daily review words successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const submitWordReviewController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "User not authenticated");
    }

    const { wordId, quality } = req.body;

    if (!wordId || quality === undefined) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        "wordId and quality are required",
      );
    }

    if (quality < 0 || quality > 5) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        "quality must be between 0 and 5",
      );
    }

    const updatedProgress = await SRSServices.submitReview(
      userId,
      wordId,
      Number(quality),
    );

    res.status(HttpStatus.OK).json({
      success: true,
      message: "Submit review successfully",
      data: updatedProgress,
    });
  } catch (error) {
    next(error);
  }
};

export const getSrsStatsController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "User not authenticated");
    }

    const data = await SRSServices.getStats(userId);

    res.status(HttpStatus.OK).json({
      success: true,
      message: "Get SRS stats successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
