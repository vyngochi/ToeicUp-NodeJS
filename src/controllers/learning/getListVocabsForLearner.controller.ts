import { NextFunction, Request, Response } from "express";
import { successResponse } from "../../libs/responseHelper";
import { HttpStatus } from "../../constants/enums/status-code";
import { AdminVocabManagement } from "../../services/admin/material-management/vocabulary.service";
import { VocabularyServices } from "../../services/learning/vocabulary.service";

export const getListVocabByWordSetIdForLeaner = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { wordSetId } = req.params;

    const { pageSize, pageIndex } = req.query;

    const result = await VocabularyServices.getListVocabByWordSetIdForLeaner(
      wordSetId as string,
      Number(pageSize),
      Number(pageIndex),
    );

    successResponse(res, HttpStatus.OK, result.message, result.data);
  } catch (error) {
    next(error);
  }
};
