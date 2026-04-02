"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = require("../../config/prisma");
const error_handler_1 = require("../../middlewares/error-handler");
const token_service_1 = require("./token.service");
const mail_service_1 = require("../mail/mail.service");
exports.authService = {
    //register service
    async register(data) {
        const isExisted = await prisma_1.prisma.users.findUnique({
            where: { Email: data.email },
        });
        if (isExisted) {
            throw new error_handler_1.AppError(403, "Tài khoản đã tồn tại trong hệ thống");
        }
        const hashPassword = await bcrypt_1.default.hash(data.password, 10);
        const verifyToken = crypto_1.default.randomBytes(32).toString("hex");
        const verifyTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
        await prisma_1.prisma.users.create({
            data: {
                Id: crypto_1.default.randomUUID(),
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
        await mail_service_1.mailService.sendRegisterEmail(data.email, verifyToken);
        return {
            message: "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản",
        };
    },
    //login service
    async login(email, password, deviceInfo, ip) {
        const user = await prisma_1.prisma.users.findUnique({
            where: { Email: email },
        });
        if (!user) {
            throw new error_handler_1.AppError(400, "Email hoặc mật khẩu không đúng");
        }
        if (!user.IsActive) {
            throw new error_handler_1.AppError(403, "Tài khoản đã bị khóa");
        }
        const isMatch = await bcrypt_1.default.compare(password, user.PasswordHash);
        if (!isMatch) {
            throw new error_handler_1.AppError(401, "Email hoặc mật khẩu không đúng");
        }
        const { token: accessToken } = token_service_1.tokenService.signAccessToken(user.Id, user.Email, user.Role);
        const refreshToken = await token_service_1.tokenService.createRefreshToken(user.Id, deviceInfo, ip);
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
    async logout(token, refreshToken) {
        await token_service_1.tokenService.blackListAccessToken(token);
        await prisma_1.prisma.refresh_tokens.update({
            where: { Token: refreshToken },
            data: { RevokedAt: new Date(), RevokedReason: "Logout" },
        });
    },
};
