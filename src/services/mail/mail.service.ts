import { config } from "../../config";
import { prisma } from "../../config/prisma";
import { AppError } from "../../middlewares/error-handler";
import { tokenService } from "../auth/token.service";
import {
  EmailParams,
  mailerSend,
  Recipient,
  Sender,
} from "../../config/mailer";

export const mailService = {
  async sendRegisterEmail(to: string, token: string) {
    const link = `${config.frontendUrl}/verify-email?token=${token}`;

    const sendFrom = new Sender(config.mail.USER!, "Toeic Up");

    const recipient = new Recipient(to);
    const emailParams = new EmailParams()
      .setFrom(sendFrom)
      .setTo([recipient])
      .setSubject("Xác nhận email đăng ký Toeic Up")
      .setHtml(
        `
      <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
          
          <div style="background-color: #4f46e5; padding: 20px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px;">Toeic Up</h1>
          </div>

          <div style="padding: 30px; color: #333;">
            <h2>Xin chào 👋</h2>
            <p>
              Cảm ơn bạn đã đăng ký tài khoản tại <b>Toeic Up</b>.
              Vui lòng xác nhận email bằng cách nhấn nút bên dưới:
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${link}" 
                 style="background-color: #4f46e5; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Xác nhận email
              </a>
            </div>

            <p>Hoặc copy link:</p>
            <p style="word-break: break-all; color: #4f46e5;">
              ${link}
            </p>

            <p style="color: #999;">
              ⚠️ Link hết hạn sau <b>1 giờ</b>.
            </p>
          </div>

          <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #888;">
            © ${new Date().getFullYear()} Toeic Up
          </div>
        </div>
      </div>
    `,
      )
      .setText(`Xác nhận email: ${link}`);

    try {
      await mailerSend.email.send(emailParams);
    } catch {
      throw new AppError(
        400,
        "Lỗi server, không thể gửi mail. Vui lòng thử lại sau",
      );
    }
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

    const sentFrom = new Sender(config.mail.USER!, "Toeic Up");

    const recipients = [new Recipient(to)];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject("Đặt lại mật khẩu mới")
      .setHtml(
        `
      <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
          
          <div style="background-color: #4f46e5; padding: 20px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px;">Toeic Up</h1>
          </div>

          <div style="padding: 30px; color: #333;">
            <h2>Xin chào 👋</h2>
            <p>
              Vui lòng truy cập vào link bên dưới để đổi mật khẩu:
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${link}" 
                 style="background-color: #4f46e5; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Đổi mật khẩu
              </a>
            </div>

            <p style="color: #999;">
              ⚠️ Link này sẽ hết hạn sau <b>15 phút</b>.
            </p>
          </div>

          <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #888;">
            © ${new Date().getFullYear()} Toeic Up
          </div>
        </div>
      </div>
    `,
      )
      .setText(`Đổi mật khẩu tại: ${link}`);

    try {
      await mailerSend.email.send(emailParams);
      return {
        message: "Vui lòng kiểm tra hộp thư của bạn để đổi mật khẩu",
      };
    } catch (error) {
      throw new AppError(
        400,
        "Lỗi server, không thể gửi mail. Vui lòng thử lại sau",
      );
    }
  },

  async sendRemindVerifyEmail(to: string, token: string) {
    const link = `${config.frontendUrl}/verify-email?token=${token}`;

    const sentFrom = new Sender(config.mail.USER!, "Toeic Up");

    const recipients = [new Recipient(to)];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject("Xác nhận email đăng ký Toeic Up")

      .setHtml(
        `
      <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
          
          <div style="background-color: #4f46e5; padding: 20px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px;">Toeic Up</h1>
          </div>

          <div style="padding: 30px; color: #333;">
            <h2>Xin chào 👋</h2>
            <p>
              Xác thực tài khoản <b>Toeic Up</b>.
              Vui lòng nhấn vào nút bên dưới:
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${link}" 
                 style="background-color: #4f46e5; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Xác nhận email
              </a>
            </div>

            <p>Hoặc copy link:</p>
            <p style="word-break: break-all; color: #4f46e5;">
              ${link}
            </p>

            <p style="color: #999;">
              ⚠️ Link hết hạn sau <b>24 giờ</b>.
            </p>
          </div>

          <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #888;">
            © ${new Date().getFullYear()} Toeic Up
          </div>
        </div>
      </div>
    `,
      )
      .setText(`Xác nhận email tại: ${link}`);

    try {
      await mailerSend.email.send(emailParams);
    } catch (error) {
      throw new AppError(
        400,
        "Lỗi server, không thể gửi mail. Vui lòng thử lại sau",
      );
    }
  },

  async sendSettingPasswordGGLogin(to: string, token: string) {
    const link = `${config.frontendUrl}/set-password?token=${token}`;

    const sentFrom = new Sender(config.mail.USER!, "Toeic Up");

    const recipients = [new Recipient(to)];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject("Đặt mật khẩu cho phương thức đăng nhập thủ công")

      .setHtml(
        `
      <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
          
          <div style="background-color: #4f46e5; padding: 20px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px;">Toeic Up</h1>
          </div>

          <div style="padding: 30px; color: #333;">
            <h2>Xin chào 👋</h2>
            <p>
              Bạn đã đăng ký bằng tài khoản Google. Vui lòng nhấn vào link dưới để đặt mật khẩu cho tài khoản
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${link}" 
                 style="background-color: #4f46e5; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Đặt mật khẩu
              </a>
            </div>

            <p style="text-align: center" style="color: #999;">
              ⚠️ Link hết hạn sau <b>15 phút</b>.
            </p>
          </div>

          <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #888;">
            © ${new Date().getFullYear()} Toeic Up
          </div>
        </div>
      </div>
    `,
      )
      .setText(`Xác nhận email tại: ${link}`);

    try {
      await mailerSend.email.send(emailParams);
    } catch (err) {
      throw new AppError(
        400,
        `Lỗi server, không thể gửi mail đặt password. Vui lòng thử lại sau hoặc đăng nhập bằng Google`,
      );
    }
  },
};
