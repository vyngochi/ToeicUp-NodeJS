import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../middlewares/authenticate";
import { VocabularyServices } from "../../services/learning/vocabulary.service";
import { successResponse } from "../../libs/responseHelper";
import { HttpStatus } from "../../constants/enums/status-code";

export const getListWordSetsController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { searchKey, pageSize, pageIndex } = req.query;
    const userId = req.user?.userId as string;
    
    const result = await VocabularyServices.getWordSetsWithTopics(
      searchKey as string,
      Number(pageSize),
      Number(pageIndex),
      userId,
    );

    successResponse(res, HttpStatus.OK, result.message, result.data);
  } catch (error) {
    next(error);
  }
};
