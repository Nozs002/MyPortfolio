/**
 * @id SRC-NEXTAUTH-HANDLER
 * @implements DOC-SRS
 * @references DOC-RULES
 * @uses SRC-AUDIT-UTIL
 * @description NextAuth route handler with Google OAuth and Credentials verification.
 */
import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { headers } from 'next/headers';
import bcrypt from 'bcryptjs';
import prisma from '../../../../lib/prisma';
import { createAuditLog } from '../../../../lib/audit';

export const authOptions: NextAuthOptions = {
  // Cung cấp dịch vụ xác thực
  providers: [
    // Đăng nhập bằng google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),

    // Đăng nhập bằng tài khoản trong database
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },

      // Hàm sử lý Đăng nhập bằng tài khoản và mật khẩu
      async authorize(credentials) {
        let ipAddress: string | null = null;
        try {
          // Lấy địa chỉ ip thật của người dùng bên trong header của HTTP
          const headersList = await headers();
          ipAddress =
            headersList.get('x-forwarded-for')?.split(',')[0] ||
            headersList.get('x-real-ip') ||
            null;
        } catch (e) {
          // Fallback if headers are not available
        }

        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // Query the admin user from database
        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });

        if (!user) {
          await createAuditLog({
            action: 'LOGIN_FAILED',
            targetType: 'User',
            description: `Đăng nhập Credentials thất bại: Không tìm thấy tài khoản "${credentials.username}"`,
            ipAddress,
          });
          return null;
        }

        // So sánh mật khẩu
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash,
        );

        if (!isPasswordValid) {
          await createAuditLog({
            action: 'LOGIN_FAILED',
            targetType: 'User',
            userId: user.id,
            description: `Sai mật khẩu cho tài khoản "${credentials.username}"`,
            ipAddress,
          });
          return null;
        }

        // Authentication succeeds
        await createAuditLog({
          action: 'LOGIN',
          targetType: 'User',
          userId: user.id,
          description: `Đăng nhập Credentials thành công cho tài khoản "${credentials.username}"`,
          ipAddress,
        });

        return {
          id: user.id,
          name: user.name || user.username,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      let ipAddress: string | null = null;
      try {
        const headersList = await headers();
        ipAddress =
          headersList.get('x-forwarded-for')?.split(',')[0] ||
          headersList.get('x-real-ip') ||
          null;
      } catch (e) {
        // Fallback if headers are not available
      }

      if (account?.provider === 'google') {
        const adminEmail = process.env.ADMIN_GOOGLE_EMAIL;
        const profileEmail = profile?.email;

        if (!adminEmail) {
          console.error(
            'ADMIN_GOOGLE_EMAIL environment variable is not configured.',
          );
          await createAuditLog({
            action: 'LOGIN_FAILED',
            targetType: 'User',
            description:
              'Đăng nhập thất bại qua Google: Tài khoản email của ADMIN chưa được cấu hình.',
            ipAddress,
          });
          return false;
        }

        if (!profileEmail || profileEmail !== adminEmail) {
          await createAuditLog({
            action: 'LOGIN_FAILED',
            targetType: 'User',
            description: `Đăng nhập thất bại qua Google: Email ${profileEmail || 'không xác định'} không hợp lệ`,
            ipAddress,
          });
          return false;
        }

        // Authentication succeeds
        await createAuditLog({
          action: 'LOGIN',
          targetType: 'User',
          description: `Đăng nhập thành công qua Google (${profileEmail})`,
          ipAddress,
        });
        return true;
      }

      return true;
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
