import { prisma } from "../../config/prisma";
import { HttpStatus } from "../../constants/enums/status-code";
import { USER_MESSAGE } from "../../constants/messages/user.message";
import { AppError } from "../../middlewares/error-handler";

export const profileService = {
  async setGoal(email: string, targetScore: number, wordsPerDay: number) {
    let user = await prisma.users.findUnique({ where: { Email: email } });

    if (!user)
      throw new AppError(
        HttpStatus.UNAUTHORIZED,
        USER_MESSAGE.SET_GOAL.NOT_USER,
      );

    user = await prisma.users.update({
      where: { Email: email },
      data: {
        TargetScore: targetScore,
        WordsPerDay: wordsPerDay,
      },
    });

    const response = {
      targetScore: user.TargetScore,
      wordsPerDay: user.WordsPerDay,
    };

    return { message: USER_MESSAGE.SET_GOAL.SUCCESS, response };
  },
};
