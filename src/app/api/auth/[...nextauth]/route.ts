/**
 * @id SRC-NEXTAUTH-HANDLER
 * @implements DOC-SRS
 * @references DOC-RULES
 * @uses SRC-AUDIT-UTIL
 * @description NextAuth route handler with Google OAuth email verification.
 */
import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { headers } from 'next/headers';
import { createAuditLog } from '../../../../lib/audit';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      let ipAddress: string | null = null;
      try {
        const headersList = await headers();
        ipAddress =
          headersList.get('x-forwarded-for')?.split(',')[0] ||
          headersList.get('x-real-ip') ||
          null;
      } catch (e) {
        // Fallback if headers are not available in the current context
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
              'Đăng nhập thất bại qua Google: Biến môi trường ADMIN_GOOGLE_EMAIL chưa được cấu hình.',
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
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
