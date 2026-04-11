import { prisma } from "../config/prisma";
import { Prisma } from "../generated/prisma/client";
import { GOAL_SELECT } from "../models";

export const userRepositories = {
  findUserByEmail(email: string) {
    return prisma.users.findUnique({
      where: { Email: email },
      select: { Email: true },
    });
  },

  updateUserGoal(email: string, data: Prisma.usersUpdateInput) {
    return prisma.users.update({
      where: { Email: email },
      data: data,
      select: GOAL_SELECT,
    });
  },
};
