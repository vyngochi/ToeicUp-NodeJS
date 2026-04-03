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

      const verifyToken = crypto.randomBytes(32).toString("hex");

      const verifyTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

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
          IsActive: false,
          Streak: 0,
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
    const user = await prisma.users.findUnique({
      where: { Email: email },
    });

    if (!user) {
      throw new AppError(400, AUTH_MESSAGE.REGISTER.NOT_EXIST);
    }

    if (!user.IsActive) {
      throw new AppError(403, AUTH_MESSAGE.REGISTER.BLOCKED);
    }

    const isMatch = await bcrypt.compare(password, user.PasswordHash!);

    if (!isMatch) {
      throw new AppError(401, AUTH_MESSAGE.REGISTER.INVALID);
    }

    const { token: accessToken } = tokenService.signAccessToken(
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
  async logout(token: string, refreshToken: string) {
    await tokenService.blackListAccessToken(token);

    const refresh = await prisma.refresh_tokens.update({
      where: { Token: refreshToken },
      data: { RevokedAt: new Date(), RevokedReason: "Logout" },
    });

    if (!refresh) throw new AppError(400, AUTH_MESSAGE.LOG_OUT.ERROR);

    return { message: AUTH_MESSAGE.LOG_OUT.SUCCESS };
  },

  //refresh token
  async refresh(token: string, deviceInfo?: string, ip?: string) {
    if (!token) {
      throw new AppError(401, AUTH_MESSAGE.REFRESH.NOT_TOKEN_EXISTED);
    }

    try {
      const { accessToken, refreshToken, user } =
        await tokenService.rotateRefreshToken(token, deviceInfo, ip);

      return { accessToken, refreshToken, user };
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

      let user = await prisma.users.findUnique({ where: { Email: email } });
      let externalLogin = await prisma.external_logins.findFirst({
        where: {
          Provider: PROVIDER_ENUM.GOOGLE,
          ProviderKey: sub,
        },
      });

      const userId = crypto.randomUUID();
      const createdAt = new Date();

      if (!user) {
        await prisma.$transaction(async (tx) => {
          user = await tx.users.create({
            data: {
              Id: userId,
              Email: email!,
              DisplayName: name!,
              AvatarUrl: picture!,
              CreatedAt: createdAt,
              IsActive: true,
            },
          });

          await tx.external_logins.create({
            data: {
              Id: crypto.randomUUID(),
              UserId: userId,
              Email: email!,
              DisplayName: name!,
              AvatarUrl: picture!,
              Provider: PROVIDER_ENUM.GOOGLE,
              ProviderKey: sub,
              CreatedAt: createdAt,
            },
          });
        });
      } else if (!externalLogin) {
        await prisma.external_logins.create({
          data: {
            Id: crypto.randomUUID(),
            UserId: user.Id,
            Email: email!,
            DisplayName: name!,
            AvatarUrl: picture!,
            Provider: PROVIDER_ENUM.GOOGLE,
            ProviderKey: sub,
            CreatedAt: createdAt,
          },
        });
      }

      if (!user) {
        throw new AppError(400, AUTH_MESSAGE.LOGIN.ERROR);
      }

      const accessToken = tokenService.signAccessToken(
        user.Id,
        user.Email,
        user.Role,
      );

      const refreshToken = tokenService.createRefreshToken(
        user.Id,
        deviceInfo,
        ip,
      );

      return {
        accessToken,
        refreshToken,
        user,
      };
    } catch (error) {
      throw new AppError(400, (error as Error).message);
    }
  },

  //forgot password
  async forgotPassword(email: string) {
    const verifyToken = crypto.randomBytes(32).toString("hex");

    const verifyTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    try {
      const user = await prisma.users.findUnique({
        where: { Email: email },
      });

      if (!user) throw new AppError(400, AUTH_MESSAGE.FORGOT.NOT_EXISTED);

      const userUpdate = await prisma.users.update({
        where: { Email: user.Email },
        data: {
          EmailVerificationToken: verifyToken,
          EmailVerificationExpiresAt: verifyTokenExpiry,
        },
      });

      const { message } = await mailService.sendForgotPasswordEmail(
        email,
        userUpdate?.EmailVerificationToken!,
      );

      return { message: message };
    } catch (error) {
      throw new AppError(500, (error as Error).message);
    }
  },

  //reset password - forgot
  async resetForgotPassword(token: string, password: string) {
    try {
      const user = await prisma.users.findFirst({
        where: { EmailVerificationToken: token },
      });

      if (!user?.EmailVerificationToken || !user.EmailVerificationExpiresAt)
        throw new AppError(400, AUTH_MESSAGE.RESET.INVALID_TOKEN);

      if (user.EmailVerificationExpiresAt < new Date())
        throw new AppError(400, AUTH_MESSAGE.RESET.TOKEN_EXPIRED);

      const passwordHash = await bcrypt.hash(password, 10);

      await prisma.users.update({
        where: { Id: user.Id },
        data: {
          PasswordHash: passwordHash,
          EmailVerificationToken: null,
          EmailVerificationExpiresAt: null,
        },
      });
    } catch (error) {
      throw new AppError(500, (error as Error).message);
    }
  },
};
