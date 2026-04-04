import { MailOptions } from "nodemailer/lib/sendmail-transport";
import { config } from "../../config";
import { transporter } from "../../config/mailer";
import { prisma } from "../../config/prisma";
import { AppError } from "../../middlewares/error-handler";
import { tokenService } from "../auth/token.service";

export const mailService = {
  async sendRegisterEmail(to: string, token: string) {
    const link = `${config.frontendUrl}/verify-email?token=${token}`;

    const registerEmail: MailOptions = {
      from: `"Toeic Up" <${config.mail.user}>`,
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

    await transporter.sendMail(registerEmail);
  },

  async verifyEmail(token: string, deviceInfo?: string, ip?: string) {
    const user = await prisma.users.findFirst({
      where: { EmailVerificationToken: token },
    });

    if (!user) {
      throw new AppError(400, "Token không hợp lệ");
    }

    if (user.EmailVerificationExpiresAt! < new Date()) {
      throw new AppError(400, "Token đã hết hạn. Vui lòng đăng ký lại");
    }

    await prisma.users.update({
      where: { Id: user.Id },
      data: {
        EmailVerified: true,
        EmailVerificationToken: null,
        EmailVerificationExpiresAt: null,
      },
    });

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
      message: "Tài khoản đã được xác thực",
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

  async sendForgotPasswordEmail(to: string, token: string) {
    const link = `${config.frontendUrl}/reset-password?token=${token}`;

    const resetPasswordEmail: MailOptions = {
      from: `"Toeic Up" <${config.mail.user}>`,
      to,
      subject: "Đặt lại mật khẩu mới",
      html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        
        <div style="background-color: #4f46e5; padding: 20px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 24px;">Toeic Up</h1>
        </div>

        <div style="padding: 30px; color: #333;">
          <h2 style="margin-top: 0;">Xin chào 👋</h2>
          <p style="font-size: 15px; line-height: 1.6;">
            Vui lòng truy cập vào link bên dưới để đổi mật khẩu:
          </p>

          <!-- Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${link}" 
               style="background-color: #4f46e5; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Đổi mật khẩu
            </a>
          </div>

          <p style="font-size: 14px; color: #999; margin-top: 20px;">
            ⚠️ Link này sẽ hết hạn sau <b>15 phút</b>.
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

    await transporter.sendMail(resetPasswordEmail);
    return { message: "Vui lòng kiểm tra hộp thư của bạn để đổi mật khẩu" };
  },

  async sendRemindVerifyEmail(to: string, token: string) {
    const link = `${config.frontendUrl}/reset-password?token=${token}`;

    const registerEmail: MailOptions = {
      from: `"Toeic Up" <${config.mail.user}>`,
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
            Xác thực tài khoản <b>Toeic Up</b>.
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
            ⚠️ Link này sẽ hết hạn sau <b>24 giờ</b>.
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

    await transporter.sendMail(registerEmail);
  },
};
