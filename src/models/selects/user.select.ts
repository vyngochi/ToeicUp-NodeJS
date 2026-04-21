import { Prisma } from "../../generated/prisma/client";

export const USER_RESPONSE = {
  Id: true,
  Email: true,
  FirstName: true,
  LastName: true,
  DisplayName: true,
  TargetScore: true,
  Streak: true,
  Bio: true,
  AvatarUrl: true,
  WordsPerDay: true,
  Role: true,
  IsActive: true,
  IsLoginExternal: true,
} as const;

export const GOAL_SELECT = {
  TargetScore: true,
  WordsPerDay: true,
} as const;
