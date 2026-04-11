import { prisma } from "../../config/prisma";
import { HttpStatus } from "../../constants/enums/status-code";
import { USER_MESSAGE } from "../../constants/messages/user.message";
import { AppError } from "../../middlewares/error-handler";
import { GOAL_SELECT } from "../../models";
import { userRepositories } from "../../repositories/user.repository";

export const profileService = {
  async setGoal(email: string, targetScore: number, wordsPerDay: number) {
    let user = await userRepositories.findUserByEmail(email);

    if (!user)
      throw new AppError(
        HttpStatus.UNAUTHORIZED,
        USER_MESSAGE.SET_GOAL.NOT_USER,
      );

    const response = await userRepositories.updateUserGoal(email, {
      TargetScore: targetScore,
      WordsPerDay: wordsPerDay,
    });

    return { message: USER_MESSAGE.SET_GOAL.SUCCESS, response };
  },
};
