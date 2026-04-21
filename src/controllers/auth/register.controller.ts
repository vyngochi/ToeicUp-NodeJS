import { NextFunction, Request, Response } from "express";
import { authService } from "../../services/auth/auth.service";
import { successResponse } from "../../libs/responseHelper";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password, firstName, lastName, targetScore, wordsPerDay } =
      req.body;

    const { message } = await authService.register({
      email: email,
      firstName: firstName,
      lastName: lastName,
      targetScore: targetScore,
      password: password,
      wordsPerDay: wordsPerDay,
    });

    console.log("words :" + wordsPerDay);

    successResponse(res, 201, message);
  } catch (error) {
    next(error);
  }
};
