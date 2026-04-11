import bcrypt from "bcrypt";
import crypto from "crypto";
import { prisma } from "../../config/prisma";
import { AppError } from "../../middlewares/error-handler";
import { tokenService } from "./token.service";
import { mailService } from "../mail/mail.service";
import { verifyGoogleToken } from "./google.service";
import { AUTH_MESSAGE } from "../../constants/messages/auth.message";
import { TOKEN_ROTATE_ENUM } from "../../constants/enums";
import { PROVIDER_ENUM } from "../../constants/enums/provider.enums";
import { HttpStatus } from "../../constants/enums/status-code";
import { USER_RESPONSE } from "../../models";

export const authService = {
  //register service
  async register(data: {
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    targetScore: number;
    wordsPerDay: number;
  }) {
    try {
      const isExisted = await prisma.users.findUnique({
        where: { Email: data.email },
      });

      if (isExisted) {
        throw new AppError(403, AUTH_MESSAGE.REGISTER.USER_EXISTED);
      }

      const hashPassword = await bcrypt.hash(data.password, 10);

      const { verifyToken, verifyTokenExpiry } =
        await tokenService.createVerifyToken(24);

      await prisma.users.create({
        data: {
          Id: crypto.randomUUID(),
          Email: data.email,
          DisplayName: data.fullName,
          PasswordHash: hashPassword,
          CreatedAt: new Date(),
          EmailVerificationToken: verifyToken,
          EmailVerificationExpiresAt: verifyTokenExpiry,
          EmailVerified: false,
          TargetScore: data.targetScore,
          WordsPerDay: data.wordsPerDay,
        },
      });

      await mailService.sendRegisterEmail(data.email, verifyToken);

      return {
        message: AUTH_MESSAGE.REGISTER.SUCCESS,
      };
    } catch (error) {
      throw new AppError(400, (error as Error).message);
    }
  },
  //login service
  async login(
    email: string,
    password: string,
    deviceInfo?: string,
    ip?: string,
  ) {
    let user = await prisma.users.findUnique({
      where: { Email: email },
    });

    if (!user) {
      throw new AppError(HttpStatus.NOT_FOUND, AUTH_MESSAGE.REGISTER.NOT_EXIST);
    }

    if (!user.IsActive) {
      throw new AppError(HttpStatus.FORBIDDEN, AUTH_MESSAGE.REGISTER.BLOCKED);
    }

    if (!user.PasswordHash) {
      const {
        verifyToken: verifyPasswordToken,
        verifyTokenExpiry: verifyExpired,
      } = await tokenService.createVerifyToken(1);

      user = await prisma.users.update({
        where: { Id: user.Id },
        data: {
          PasswordResetToken: verifyPasswordToken,
          PasswordResetExpiresAt: verifyExpired,
        },
      });

      await mailService.sendSettingPasswordGGLogin(
        user.Email,
        user.PasswordResetToken!,
      );

      throw new AppError(HttpStatus.OK, AUTH_MESSAGE.SET_PASSWORD.MAIL);
    }

    if (
      !user.EmailVerificationToken ||
      user.EmailVerificationExpiresAt! < new Date()
    ) {
      const { verifyToken, verifyTokenExpiry } =
        await tokenService.createVerifyToken(24);

      user = await prisma.users.update({
        where: { Email: user.Email },
        data: {
          EmailVerificationToken: verifyToken,
          EmailVerificationExpiresAt: verifyTokenExpiry,
        },
      });
    }

    if (!user.EmailVerified) {
      await mailService.sendRegisterEmail(
        user.Email,
        user.EmailVerificationToken!,
      );
      throw new AppError(HttpStatus.BAD_REQUEST, AUTH_MESSAGE.LOGIN.REMIND);
    }

    const isMatch = await bcrypt.compare(password, user.PasswordHash!);

    if (!isMatch) {
      throw new AppError(401, AUTH_MESSAGE.REGISTER.INVALID);
    }

    const { token: accessToken } = await tokenService.signAccessToken(
      user.Id,
      user.Email,
      user.Role,
    );

    const refreshToken = await tokenService.createRefreshToken(
      user.Id,
      deviceInfo,
      ip,
    );

    return {
      message: AUTH_MESSAGE.LOGIN.SUCCESS,
      accessToken,
      refreshToken: refreshToken.Token,
      isSettingGoal: user.TargetScore !== null && user.WordsPerDay !== null,
      user: {
        id: user.Id,
        email: user.Email,
        displayName: user.DisplayName,
        targetScore: user.TargetScore,
        streak: user.Streak,
        avatarUrl: user.AvatarUrl,
        wordsPerDay: user.WordsPerDay,
      },
    };
  },

  //log out service
  async logout(token: string | null, refreshToken: string) {
    if (token) {
      await tokenService.blackListAccessToken(token);
    }

    if (refreshToken) {
      try {
        await prisma.refresh_tokens.update({
          where: { Token: refreshToken },
          data: {
            RevokedAt: new Date(),
            RevokedReason: "Logout",
          },
        });
      } catch (error) {
        console.error("Lỗi khi thu hồi token:", error);
      }
    }

    return { message: AUTH_MESSAGE.LOG_OUT.SUCCESS };
  },

  //refresh token
  async refresh(token: string, deviceInfo?: string, ip?: string) {
    if (!token) {
      throw new AppError(401, AUTH_MESSAGE.REFRESH.NOT_TOKEN_EXISTED);
    }

    try {
      const { accessToken, refreshToken, user, isSettingGoal } =
        await tokenService.rotateRefreshToken(token, deviceInfo, ip);

      return { accessToken, refreshToken, user, isSettingGoal };
    } catch (error) {
      if ((error as Error).message === TOKEN_ROTATE_ENUM.REUSED) {
        throw new AppError(401, AUTH_MESSAGE.REFRESH.INVALID_SESSION);
      }

      if (
        [TOKEN_ROTATE_ENUM.INVALID, TOKEN_ROTATE_ENUM.REUSED].includes(
          (error as Error).message,
        )
      ) {
        throw new AppError(401, AUTH_MESSAGE.REFRESH.EXPIRED_SESSION);
      }
    }
  },

  //login with google
  async loginWithGG(idToken: string, deviceInfo?: string, ip?: string) {
    try {
      if (!idToken) {
        throw new AppError(400, AUTH_MESSAGE.LOGIN.INVALID_TOKEN);
      }
      const payload = await verifyGoogleToken(idToken);

      const { email, name, picture, sub } = payload;

      let user = await prisma.users.findUnique({
        where: { Email: email },
        select: USER_RESPONSE,
      });
      let externalLogin = await prisma.external_logins.findFirst({
        where: {
          Provider: PROVIDER_ENUM.GOOGLE,
          ProviderKey: sub,
        },
      });

      const userId = crypto.randomUUID();
      const createdAt = new Date();

      if (!user) {
        user = await prisma.users.create({
          data: {
            Id: userId,
            Email: email!,
            DisplayName: name!,
            AvatarUrl: picture!,
            CreatedAt: createdAt,
            EmailVerified: true,
            IsLoginExternal: true,
          },
        });
      }

      if (!externalLogin) {
        await prisma.external_logins.create({
          data: {
            Id: crypto.randomUUID(),
            UserId: user.Id,
            Email: user.Email || email!,
            DisplayName: user.DisplayName || name,
            AvatarUrl: user.AvatarUrl || picture,
            Provider: PROVIDER_ENUM.GOOGLE,
            ProviderKey: sub,
            CreatedAt: createdAt,
          },
        });
      }

      if (!user) {
        throw new AppError(400, AUTH_MESSAGE.LOGIN.ERROR);
      }

      const accessToken = await tokenService.signAccessToken(
        user.Id,
        user.Email,
        user.Role,
      );

      const refreshToken = await tokenService.createRefreshToken(
        user.Id,
        deviceInfo,
        ip,
      );

      return {
        accessToken,
        isSettingGoal: user.TargetScore !== null && user.WordsPerDay !== null,
        refreshToken,
        user,
      };
    } catch (error) {
      throw new AppError(400, (error as Error).message);
    }
  },

  //forgot password
  async forgotPassword(email: string) {
    let user = await prisma.users.findUnique({
      where: { Email: email },
    });

    if (!user) throw new AppError(400, AUTH_MESSAGE.FORGOT.NOT_EXISTED);

    if (!user.IsActive) {
      throw new AppError(400, AUTH_MESSAGE.FORGOT.BLOCKED);
    }

    if (
      !user.EmailVerificationToken ||
      user.EmailVerificationExpiresAt! < new Date()
    ) {
      const { verifyToken, verifyTokenExpiry } =
        await tokenService.createVerifyToken(1);

      user = await prisma.users.update({
        where: { Email: user.Email },
        data: {
          EmailVerificationToken: verifyToken,
          EmailVerificationExpiresAt: verifyTokenExpiry,
        },
      });
    }

    if (!user.EmailVerified) {
      await mailService.sendRemindVerifyEmail(
        user.Email,
        user.EmailVerificationToken!,
      );

      throw new AppError(403, AUTH_MESSAGE.FORGOT.NOT_VERIFIED);
    }

    const {
      verifyToken: passwordResetToken,
      verifyTokenExpiry: passwordResetTokenExpired,
    } = await tokenService.createVerifyToken();

    const userUpdate = await prisma.users.update({
      where: { Email: user.Email },
      data: {
        PasswordResetToken: passwordResetToken,
        PasswordResetExpiresAt: passwordResetTokenExpired,
      },
    });

    const { message } = await mailService.sendForgotPasswordEmail(
      email,
      userUpdate?.PasswordResetToken!,
    );

    return { message: message };
  },

  //reset password - forgot
  async resetForgotPassword(token: string, password: string) {
    try {
      const user = await prisma.users.findFirst({
        where: { PasswordResetToken: token },
      });

      if (!user?.PasswordResetToken || !user.PasswordResetExpiresAt)
        throw new AppError(400, AUTH_MESSAGE.RESET.INVALID_TOKEN);

      if (user.PasswordResetExpiresAt < new Date())
        throw new AppError(400, AUTH_MESSAGE.RESET.TOKEN_EXPIRED);

      const passwordHash = await bcrypt.hash(password, 10);

      await prisma.users.update({
        where: { Id: user.Id },
        data: {
          PasswordHash: passwordHash,
          PasswordResetToken: null,
          PasswordResetExpiresAt: null,
        },
      });
    } catch (error) {
      throw new AppError(500, (error as Error).message);
    }
  },

  //set password - GG Login
  async setPassword(
    token: string,
    newPassword: string,
    deviceInfo?: string,
    ip?: string,
  ) {
    if (!token)
      throw new AppError(
        HttpStatus.UNAUTHORIZED,
        AUTH_MESSAGE.SET_PASSWORD.INVALID_TOKEN,
      );

    let user = await prisma.users.findFirst({
      where: { PasswordResetToken: token },
    });

    if (!user)
      throw new AppError(
        HttpStatus.UNAUTHORIZED,
        AUTH_MESSAGE.SET_PASSWORD.NOT_TOKEN,
      );

    if (user?.PasswordResetExpiresAt! < new Date())
      throw new AppError(
        HttpStatus.UNAUTHORIZED,
        AUTH_MESSAGE.SET_PASSWORD.TOKEN_EXPIRED,
      );

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    let userRes = await prisma.users.update({
      where: { Email: user.Email },
      data: {
        PasswordHash: newPasswordHash,
        PasswordResetToken: null,
        PasswordResetExpiresAt: null,
      },
      select: USER_RESPONSE,
    });

    let refreshToken = await prisma.refresh_tokens.findFirst({
      where: { UserId: userRes.Id },
    });

    if (!refreshToken?.Token || refreshToken?.ExpiresAt! < new Date()) {
      refreshToken = await tokenService.createRefreshToken(
        user.Id,
        deviceInfo,
        ip,
      );
    }

    const accessToken = await tokenService.signAccessToken(
      user.Id,
      user.Email,
      user.Role,
    );

    return {
      message: AUTH_MESSAGE.SET_PASSWORD.SUCCESS,
      accessToken,
      refreshToken,
      user: userRes,
    };
  },
};
