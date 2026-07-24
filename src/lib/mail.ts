/**
 * Mail service utility using Nodemailer (REQ-RECOVERY-004, REQ-RECOVERY-011, REQ-RECOVERY-013).
 */

import nodemailer from 'nodemailer';

/**
 * Sends a password reset email to the specified admin address.
 * @param email Destination email address
 * @param token Password reset token string
 */
export async function sendPasswordResetEmail(
  email: string,
  token: string,
): Promise<boolean> {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const resetLink = `${baseUrl}/admin/reset-password?token=${encodeURIComponent(token)}`;

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const rawFrom = process.env.SMTP_FROM;
  const sanitizedFrom = rawFrom ? rawFrom.replace(/\\"/g, '"').trim() : '';
  const smtpFrom = sanitizedFrom || `"MyPortfolio Admin" <${smtpUser}>`;

  // Development Fallback: If SMTP is not fully configured, log link to console
  if (!smtpHost || !smtpUser || !smtpPass) {
    console.log('\n======================================================');
    console.log('📬 [DEV MAIL FALLBACK] Password Reset Link Generated:');
    console.log(`To: ${email}`);
    console.log(`Link: ${resetLink}`);
    console.log('======================================================\n');
    return true;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Đặt lại mật khẩu MyPortfolio</title>
        <style>
          body { font-family: 'Segoe UI', Helvetica, Arial, sans-serif; background-color: #f4f7fb; margin: 0; padding: 20px; color: #1e293b; }
          .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
          .header { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); color: #ffffff; padding: 32px 24px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
          .content { padding: 32px 28px; line-height: 1.6; }
          .alert-box { background: #fff8f1; border-left: 4px solid #f97316; padding: 14px 18px; margin: 20px 0; border-radius: 6px; font-size: 14px; color: #9a3412; }
          .btn-container { text-align: center; margin: 32px 0; }
          .btn { display: inline-block; background: #007bff; color: #ffffff !important; font-weight: 600; text-decoration: none; padding: 14px 36px; border-radius: 30px; box-shadow: 0 4px 14px rgba(0, 123, 255, 0.35); font-size: 16px; }
          .link-box { background: #f1f5f9; padding: 12px 16px; border-radius: 8px; font-family: monospace; font-size: 13px; word-break: break-all; color: #334155; margin-top: 16px; }
          .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 13px; color: #64748b; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>[MyPortfolio] Khôi Phục Mật Khẩu</h1>
          </div>
          <div class="content">
            <p>Xin chào <strong>Quản trị viên</strong>,</p>
            <p>Hệ thống nhận được yêu cầu đặt lại mật khẩu cho tài khoản Admin thuộc hòm thư: <strong>${email}</strong>.</p>
            
            <div class="alert-box">
              ⏰ <strong>Lưu ý bảo mật:</strong> Liên kết này chỉ có hiệu lực trong vòng đúng <strong>15 phút</strong> kể từ thời điểm gửi.
            </div>

            <p>Bấm vào nút bên dưới để tiến hành đặt lại mật khẩu mới:</p>
            
            <div class="btn-container">
              <a href="${resetLink}" class="btn" target="_blank">Đặt lại mật khẩu ngay</a>
            </div>

            <p>Nếu nút bấm trên không hoạt động, bạn có thể sao chép liên kết dưới đây và dán vào thanh địa chỉ trình duyệt:</p>
            <div class="link-box">${resetLink}</div>

            <p style="margin-top: 30px; font-size: 13px; color: #64748b;">
              ⚠️ Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email. Mật khẩu hiện tại của bạn vẫn được giữ an toàn.
            </p>
          </div>
          <div class="footer">
            &copy; MyPortfolio Admin Security System. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: smtpFrom,
      to: email,
      subject: '[MyPortfolio] Yêu cầu đặt lại mật khẩu tài khoản quản trị',
      html: htmlContent,
    });

    return true;
  } catch (error) {
    console.error('Lỗi khi gửi email SMTP:', error);
    return false;
  }
}
