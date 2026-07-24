'use server';

/**
 * Server Actions for Admin Authentication & Password Recovery
 * @references REQ-RECOVERY-001 through REQ-RECOVERY-015
 */
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { headers } from 'next/headers';
import prisma from '../../lib/prisma';
import { createAuditLog } from '../../lib/audit';
import { checkRateLimit, incrementRateLimit } from '../../lib/rate-limit';
import { validatePasswordComplexity } from '../../lib/password';
import { sendPasswordResetEmail } from '../../lib/mail';

export interface ActionResponse {
  status: 'success' | 'error';
  message: string;
  email?: string;
}

/**
 * Helper to extract real client IP address from headers
 */
async function getClientIp(): Promise<string | null> {
  try {
    const headersList = await headers();
    return (
      headersList.get('x-forwarded-for')?.split(',')[0] ||
      headersList.get('x-real-ip') ||
      null
    );
  } catch (e) {
    return null;
  }
}

/**
 * Server Action: Initiate forgot password request (REQ-RECOVERY-001 ~ REQ-RECOVERY-005, REQ-RECOVERY-010)
 */
export async function forgotPasswordAction(
  email: string,
): Promise<ActionResponse> {
  const ipAddress = await getClientIp();

  if (!email || !email.trim() || !/\S+@\S+\.\S+/.test(email.trim())) {
    return {
      status: 'error',
      message: 'Địa chỉ email không chính xác hoặc không hợp lệ.',
    };
  }

  const cleanEmail = email.trim().toLowerCase();

  // 1. Rate Limiting Check (REQ-RECOVERY-010)
  const rateLimitStatus = checkRateLimit(ipAddress);
  if (rateLimitStatus.isLimited) {
    return {
      status: 'error',
      message: `Bạn đã yêu cầu gửi email quá số lần cho phép. Vui lòng thử lại sau ${Math.ceil(
        rateLimitStatus.resetInSeconds / 60,
      )} phút.`,
    };
  }

  // 2. Query User from Database (REQ-RECOVERY-002)
  const user = await prisma.user.findUnique({
    where: { email: cleanEmail },
  });

  if (!user) {
    incrementRateLimit(ipAddress);
    await createAuditLog({
      action: 'PASSWORD_RESET_FAILED',
      targetType: 'User',
      description: `Yêu cầu reset mật khẩu thất bại: Email "${cleanEmail}" không tồn tại trong hệ thống.`,
      ipAddress,
    });

    return {
      status: 'error',
      message: 'Địa chỉ email không chính xác hoặc không tồn tại.',
    };
  }

  // 3. Increment Rate Limit & Generate Token (REQ-RECOVERY-003)
  incrementRateLimit(ipAddress);

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes validity

  // 4. Cleanup old reset tokens & save new token
  await prisma.passwordResetToken.deleteMany({
    where: { email: cleanEmail },
  });

  await prisma.passwordResetToken.create({
    data: {
      email: cleanEmail,
      token,
      expiresAt,
    },
  });

  // 5. Create Audit Log (REQ-RECOVERY-009)
  await createAuditLog({
    action: 'PASSWORD_RESET_REQUEST',
    targetType: 'User',
    userId: user.id,
    description: `Khởi tạo yêu cầu khôi phục mật khẩu cho email "${cleanEmail}"`,
    ipAddress,
  });

  // 6. Asynchronous Non-blocking Email Dispatch (SLA < 2s response time REQ-RECOVERY-012, REQ-RECOVERY-013)
  sendPasswordResetEmail(cleanEmail, token).catch((err) => {
    console.error('Failed to send reset email asynchronously:', err);
  });

  return {
    status: 'success',
    message: 'Liên kết khôi phục mật khẩu đã được gửi vào hòm thư của bạn.',
  };
}

/**
 * Server Action: Validate token validity on reset password page load (REQ-RECOVERY-006)
 */
export async function validateResetTokenAction(
  token: string,
): Promise<ActionResponse> {
  const ipAddress = await getClientIp();

  if (!token || !token.trim()) {
    return {
      status: 'error',
      message: 'Mã xác thực không hợp lệ hoặc không tồn tại.',
    };
  }

  const tokenRecord = await prisma.passwordResetToken.findUnique({
    where: { token: token.trim() },
  });

  if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
    await createAuditLog({
      action: 'PASSWORD_RESET_FAILED',
      targetType: 'PasswordResetToken',
      description: `Xác thực token thất bại: Token "${token.slice(0, 8)}..." không tồn tại hoặc đã hết hạn.`,
      ipAddress,
    });

    return {
      status: 'error',
      message: 'Mã xác thực không hợp lệ hoặc đã hết hạn (quá 15 phút).',
    };
  }

  return {
    status: 'success',
    message: 'Token hợp lệ.',
    email: tokenRecord.email,
  };
}

/**
 * Server Action: Execute password reset (REQ-RECOVERY-007, REQ-RECOVERY-008, REQ-RECOVERY-014, REQ-RECOVERY-015)
 */
export async function resetPasswordAction(
  token: string,
  newPassword: string,
): Promise<ActionResponse> {
  const ipAddress = await getClientIp();

  // 1. Password Complexity Validation (REQ-RECOVERY-014)
  const passwordCheck = validatePasswordComplexity(newPassword);
  if (!passwordCheck.isValid) {
    return {
      status: 'error',
      message: `Mật khẩu yếu: ${passwordCheck.errors.join(' ')}`,
    };
  }

  // 2. Validate Token in Database (REQ-RECOVERY-006)
  if (!token || !token.trim()) {
    return {
      status: 'error',
      message: 'Mã xác thực không hợp lệ.',
    };
  }

  const tokenRecord = await prisma.passwordResetToken.findUnique({
    where: { token: token.trim() },
  });

  if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
    await createAuditLog({
      action: 'PASSWORD_RESET_FAILED',
      targetType: 'PasswordResetToken',
      description: `Đổi mật khẩu thất bại: Token "${token.slice(0, 8)}..." không hợp lệ hoặc đã quá hạn.`,
      ipAddress,
    });

    return {
      status: 'error',
      message: 'Token không hợp lệ hoặc đã hết hạn (quá 15 phút).',
    };
  }

  // 3. Find User by Email
  const user = await prisma.user.findUnique({
    where: { email: tokenRecord.email },
  });

  if (!user) {
    return {
      status: 'error',
      message: 'Không tìm thấy tài khoản quản trị liên kết với token này.',
    };
  }

  // 4. Hash new password with bcrypt & increment passwordVersion (REQ-RECOVERY-008, REQ-RECOVERY-015)
  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      passwordVersion: { increment: 1 },
    },
  });

  // 5. Delete used token immediately (REQ-RECOVERY-008)
  await prisma.passwordResetToken.delete({
    where: { id: tokenRecord.id },
  });

  // 6. Log Audit Event (REQ-RECOVERY-009)
  await createAuditLog({
    action: 'PASSWORD_RESET_SUCCESS',
    targetType: 'User',
    userId: user.id,
    description: `Đặt lại mật khẩu thành công cho tài khoản "${user.username}" (${tokenRecord.email}).`,
    ipAddress,
  });

  return {
    status: 'success',
    message:
      'Đặt lại mật khẩu thành công. Đang chuyển hướng về trang đăng nhập...',
  };
}
