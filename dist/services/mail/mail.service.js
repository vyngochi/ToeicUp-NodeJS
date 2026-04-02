"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailService = void 0;
const config_1 = require("../../config");
const mailer_1 = require("../../config/mailer");
const prisma_1 = require("../../config/prisma");
const error_handler_1 = require("../../middlewares/error-handler");
const token_service_1 = require("../auth/token.service");
exports.mailService = {
    async sendRegisterEmail(to, token) {
        const link = `${config_1.config.frontendUrl}/verify-email?token=${token}`;
        const registerEmail = {
            from: `"Toeic Up" <${config_1.config.mail.user}>`,
            to,
            subject: "Xác nhận email đăng ký Toeic Up",
            html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        
        <div style="background-color: #4f46e5; padding: 20px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 24px;">Toeic Up</h1>
        </div>

        <div style="padding: 30px; color: #333;">
          <h2 style="margin-top: 0;">Xin chào 👋</h2>
          <p style="font-size: 15px; line-height: 1.6;">
            Cảm ơn bạn đã đăng ký tài khoản tại <b>Toeic Up</b>.
            Vui lòng xác nhận địa chỉ email của bạn bằng cách nhấn vào nút bên dưới:
          </p>

          <!-- Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${link}" 
               style="background-color: #4f46e5; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Xác nhận email
            </a>
          </div>

          <p style="font-size: 14px; color: #555;">
            Hoặc bạn có thể copy link sau vào trình duyệt:
          </p>
          <p style="word-break: break-all; font-size: 13px; color: #4f46e5;">
            ${link}
          </p>

          <p style="font-size: 14px; color: #999; margin-top: 20px;">
            ⚠️ Link này sẽ hết hạn sau <b>1 giờ</b>.
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #888;">
          <p style="margin: 0;">© ${new Date().getFullYear()} Toeic Up. All rights reserved.</p>
        </div>
      </div>
    </div>
  `,
        };
        await mailer_1.transporter.sendMail(registerEmail);
    },
    async verifyEmail(token, deviceInfo, ip) {
        const user = await prisma_1.prisma.users.findFirst({
            where: { EmailVerificationToken: token },
        });
        if (!user) {
            throw new error_handler_1.AppError(400, "Token không hợp lệ");
        }
        if (user.EmailVerificationExpiresAt < new Date()) {
            throw new error_handler_1.AppError(400, "Token đã hết hạn. Vui lòng đăng ký lại");
        }
        await prisma_1.prisma.users.update({
            where: { Id: user.Id },
            data: {
                EmailVerified: true,
                EmailVerificationToken: null,
                EmailVerificationExpiresAt: null,
            },
        });
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
};
