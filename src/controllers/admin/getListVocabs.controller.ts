import { NextFunction, Request, Response } from "express";
import { successResponse } from "../../libs/responseHelper";
import { HttpStatus } from "../../constants/enums/status-code";
import { AdminVocabManagement } from "../../services/admin/material-management/vocabulary.service";

export const getListVocabsByWordSetId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { wordSetId } = req.params;

    const result = await AdminVocabManagement.getVocabulariesByWordSetId(
      wordSetId as string,
    );

    successResponse(res, HttpStatus.OK, result.message, result.data);
  } catch (error) {
    next(error);
  }
};
