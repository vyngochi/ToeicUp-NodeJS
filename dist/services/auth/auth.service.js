"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("@app/config/prisma");
const error_handler_1 = require("@app/middlewares/error-handler");
const token_service_1 = require("./token.service");
exports.authService = {
  async login(email, password, deviceInfo, ip) {
    const user = await prisma_1.prisma.users.findUnique({
      where: { Email: email },
    });
    if (!user) {
      throw new error_handler_1.AppError(401, "Email hoặc mật khẩu không đúng");
    }
    if (!user.IsActive) {
      throw new error_handler_1.AppError(403, "Tài khoản đã bị khóa");
    }
    const isMatch = await bcrypt_1.default.compare(password, user.PasswordHash);
    if (!isMatch) {
      throw new error_handler_1.AppError(401, "Email hoặc mật khẩu không đúng");
    }
    const { token: accessToken, jti } =
      token_service_1.tokenService.signAccessToken(
        user.Id,
        user.Email,
        user.Role,
      );
    const refreshToken = await token_service_1.tokenService.createRefreshToken(
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
};
