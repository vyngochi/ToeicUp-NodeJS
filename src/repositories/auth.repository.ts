import { prisma } from "../config/prisma";
import { Prisma } from "../generated/prisma/client";
import { USER_RESPONSE } from "../models";

export const authRepositories = {
  findUserByUserId(userId: string) {
    return prisma.users.findUnique({ where: { Id: userId } });
  },
  findUserByEmail(email: string) {
    return prisma.users.findUnique({
      where: { Email: email },
    });
  },
  findUserByEmailWithResponse(email: string) {
    return prisma.users.findUnique({
      where: { Email: email },
      select: USER_RESPONSE,
    });
  },

  findUserExternal(provider: string, providerKey: string) {
    return prisma.external_logins.findFirst({
      where: {
        Provider: provider,
        ProviderKey: providerKey,
      },
    });
  },

  createUser(data: Prisma.usersCreateInput) {
    return prisma.users.create({ data: data, select: USER_RESPONSE });
  },

  createExternalUser(data: Prisma.external_loginsCreateInput) {
    return prisma.external_logins.create({ data: data });
  },

  updateUser(userId: string, data: Prisma.usersUpdateInput) {
    return prisma.users.update({ where: { Id: userId }, data: data });
  },

  updatePassword(userId: string, passwordHash: string) {
    return prisma.users.update({
      where: { Id: userId },
      data: { PasswordHash: passwordHash, UpdatedAt: new Date() },
    });
  },
};
