import cloudinary from "../../config/cloudinary";
import { prisma } from "../../config/prisma";
import { HttpStatus } from "../../constants/enums/status-code";
import { USER_MESSAGE } from "../../constants/messages/user.message";
import { AppError } from "../../middlewares/error-handler";
import { GOAL_SELECT, USER_RESPONSE } from "../../models";
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

  async editUserInfo(
    userId: string,
    email: string,
    firstName: string,
    lastName: string,
    bio: string,
  ) {
    let user = await userRepositories.findUserById(userId);

    if (!user)
      throw new AppError(
        HttpStatus.UNAUTHORIZED,
        USER_MESSAGE.USER_INFO.NOT_USER,
      );

    const response = await userRepositories.updateUserInformation(userId, {
      Email: email,
      FirstName: firstName,
      LastName: lastName,
      DisplayName: firstName + " " + lastName,
      Bio: bio,
    });

    if (!response)
      throw new AppError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        USER_MESSAGE.USER_INFO.FAIL,
      );

    return { message: USER_MESSAGE.USER_INFO.SUCCESS };
  },

  async uploadAvatar(userId: string, avatarUrl: string) {
    try {
      const uploadAvatar = await cloudinary.uploader.upload(avatarUrl, {
        folder: "user-avatars",
      });

      const result = await prisma.users.update({
        where: { Id: userId },
        data: { AvatarUrl: uploadAvatar.secure_url },
        select: { AvatarUrl: true },
      });

      return {
        message: USER_MESSAGE.UPLOAD_AVATAR.SUCCESS,
        avatarUrlUploaded: result,
      };
    } catch (error) {
      console.log(error);

      throw new AppError(500, USER_MESSAGE.UPLOAD_AVATAR.FAILED);
    }
  },
};
