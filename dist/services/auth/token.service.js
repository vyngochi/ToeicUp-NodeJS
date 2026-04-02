"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenService = void 0;
const index_1 = require("../../config/index");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto = __importStar(require("crypto"));
const prisma_1 = require("../../config/prisma");
const redis_1 = require("../../config/redis");
exports.tokenService = {
    signAccessToken(userId, email, role) {
        const jti = crypto.randomUUID();
        const token = jsonwebtoken_1.default.sign({ userId: userId, email, role, jti }, index_1.config.jwt.secret, { expiresIn: "5m" });
        return { token, jti };
    },
    async createRefreshToken(userId, deviceInfo, ip) {
        const token = crypto.randomBytes(64).toString("hex");
        const now = new Date();
        const expiredAt = now;
        expiredAt.setDate(expiredAt.getDate() + index_1.config.jwt.refreshDays);
        const record = await prisma_1.prisma.refresh_tokens.create({
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
    async rotateRefreshToken(oldToken, deviceInfo, ip) {
        const record = await prisma_1.prisma.refresh_tokens.findUnique({
            where: { Token: oldToken },
            include: { users: true },
        });
        if (!record)
            throw new Error("Invalid Token");
        if (!record.RevokedAt) {
            await prisma_1.prisma.refresh_tokens.updateMany({
                where: { UserId: record.UserId },
                data: {
                    RevokedAt: new Date(),
                    RevokedReason: "Reused detected",
                },
            });
            throw new Error("Token reused");
        }
        if (record.ExpiresAt < new Date()) {
            throw new Error("Token expired");
        }
        await prisma_1.prisma.refresh_tokens.update({
            where: { Id: record.Id },
            data: {
                RevokedAt: new Date(),
                RevokedReason: "Rotated",
            },
        });
        const newRefresh = await this.createRefreshToken(record.UserId, deviceInfo, ip);
        const { token: accessToken } = this.signAccessToken(record.UserId, record.users.Email, record.users.Role);
        return {
            accessToken,
            refreshToken: newRefresh.Token,
            user: record.users,
        };
    },
    async blackListAccessToken(token) {
        const decoded = jsonwebtoken_1.default.verify(token, index_1.config.jwt.secret);
        const now = Math.floor(Date.now() / 1000);
        const ttl = decoded.exp - now;
        if (ttl > 0) {
            await redis_1.redis.setex(`blacklist:${decoded.jti}`, ttl, "1");
        }
    },
};
