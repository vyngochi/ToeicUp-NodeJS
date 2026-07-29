import { NextFunction, Request, Response } from "express";
import { VocabularyServices } from "../../services/learning/vocabulary.service";
import { successResponse } from "../../libs/responseHelper";
import { HttpStatus } from "../../constants/enums/status-code";

export const getListWordSetsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { searchKey, pageSize, pageIndex } = req.query;
    const result = await VocabularyServices.getWordSetsWithTopics(
      searchKey as string,
      Number(pageSize),
      Number(pageIndex),
    );

    successResponse(res, HttpStatus.OK, result.message, result.data);
  } catch (error) {
    next(error);
  }
};
