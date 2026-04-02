import bcrypt from "bcrypt";
import crypto from "crypto";
import { prisma } from "../../config/prisma";
import { AppError } from "../../middlewares/error-handler";
import { tokenService } from "./token.service";
import { mailService } from "../mail/mail.service";

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
    const isExisted = await prisma.users.findUnique({
      where: { Email: data.email },
    });

    if (isExisted) {
      throw new AppError(403, "Tài khoản đã tồn tại trong hệ thống");
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
        Streak: 0,
        TargetScore: data.targetScore,
        WordsPerDay: data.wordsPerDay,
      },
    });

    await mailService.sendRegisterEmail(data.email, verifyToken);

    return {
      message:
        "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản",
    };
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
      throw new AppError(400, "Email hoặc mật khẩu không đúng");
    }

    if (!user.IsActive) {
      throw new AppError(403, "Tài khoản đã bị khóa");
    }

    const isMatch = await bcrypt.compare(password, user.PasswordHash!);

    if (!isMatch) {
      throw new AppError(401, "Email hoặc mật khẩu không đúng");
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

    await prisma.refresh_tokens.update({
      where: { Token: refreshToken },
      data: { RevokedAt: new Date(), RevokedReason: "Logout" },
    });
  },
};
