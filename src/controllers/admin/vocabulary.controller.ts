import { NextFunction, Request, Response } from "express";
import { successResponse } from "../../libs/responseHelper";
import { VocabularyServices } from "../../services/learning/vocabulary.service";
import { HttpStatus } from "../../constants/enums/status-code";
import { AdminVocabManagement } from "../../services/admin/material-management/vocabulary.service";

export const vocabularyController = {
  addWord: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const result = await AdminVocabManagement.addWord(data);
      successResponse(res, HttpStatus.CREATED, result.message, result);
    } catch (error) {
      next(error);
    }
  },

  addBulkWords: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const result = await AdminVocabManagement.addBulkWords(data);
      return successResponse(
        res,
        HttpStatus.CREATED,
        result.message,
        result.data,
      );
    } catch (error) {
      next(error);
    }
  },

  deleteWordSet: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { wordSetId } = req.params;

      const result = await AdminVocabManagement.deleteWordSet(
        wordSetId as string,
      );

      successResponse(res, HttpStatus.OK, result.message);
    } catch (error) {
      next(error);
    }
  },
};
