import { config } from "../../config/index";
import jwt from "jsonwebtoken";
import * as crypto from "crypto";
import { prisma } from "../../config/prisma";
import { redis } from "../../config/redis";
import { TOKEN_ROTATE_ENUM } from "../../constants/enums";
import { blacklistToken } from "../../libs/redisHelper";

export const tokenService = {
  signAccessToken(userId: string, email: string, role: string) {
    const jti = crypto.randomUUID();
    const token = jwt.sign(
      { userId: userId, email, role, jti },
      config.jwt.secret,
      { expiresIn: "5m" },
    );

    return { token, jti };
  },

  async createRefreshToken(userId: string, deviceInfo?: string, ip?: string) {
    const token = crypto.randomBytes(64).toString("hex");
    const now = new Date();
    const expiredAt = now;
    expiredAt.setDate(expiredAt.getDate() + config.jwt.refreshDays);

    const record = await prisma.refresh_tokens.create({
      data: {
        Id: crypto.randomUUID(),
        UserId: userId,
        Token: token,
        DeviceInfo: deviceInfo,
        IpAddress: ip,
        ExpiresAt: expiredAt,
        CreatedAt: now,
      },
    });
    return record;
  },

  async rotateRefreshToken(oldToken: string, deviceInfo?: string, ip?: string) {
    const record = await prisma.refresh_tokens.findUnique({
      where: { Token: oldToken },
      include: { users: true },
    });

    if (!record) throw new Error(TOKEN_ROTATE_ENUM.INVALID);

    if (record.RevokedAt) {
      await prisma.refresh_tokens.updateMany({
        where: { UserId: record.UserId },
        data: {
          RevokedAt: new Date(),
          RevokedReason: TOKEN_ROTATE_ENUM.REVOKED,
        },
      });
      throw new Error(TOKEN_ROTATE_ENUM.REUSED);
    }

    if (record.ExpiresAt < new Date()) {
      throw new Error(TOKEN_ROTATE_ENUM.EXPIRED);
    }

    await prisma.refresh_tokens.update({
      where: { Id: record.Id },
      data: {
        RevokedAt: new Date(),
        RevokedReason: TOKEN_ROTATE_ENUM.ROTATED,
      },
    });

    const newRefresh = await this.createRefreshToken(
      record.UserId,
      deviceInfo,
      ip,
    );

    const { token: accessToken } = this.signAccessToken(
      record.UserId,
      record.users.Email,
      record.users.Role,
    );

    return {
      accessToken,
      refreshToken: newRefresh.Token,
      user: {
        id: record.users.Id,
        email: record.users.Email,
        displayName: record.users.DisplayName,
        targetScore: record.users.TargetScore,
        streak: record.users.Streak,
        avatarUrl: record.users.AvatarUrl,
        wordsPerDay: record.users.WordsPerDay,
      },
    };
  },

  async blackListAccessToken(token: string) {
    const decoded = jwt.verify(token, config.jwt.secret) as any;

    const now = Math.floor(Date.now() / 1000);
    const ttl = decoded.exp - now;

    if (ttl > 0) {
      await blacklistToken.setBlacklist(decoded.jti, ttl);
    }
  },
};
