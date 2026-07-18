/**
 * @id SRC-MIDDLEWARE
 * @implements DOC-PRD, DOC-SRS
 * @references DOC-RULES
 * @description Next.js Middleware Route Guard that intercepts and protects admin and dashboard routes, as well as administrative Server Actions.
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check if target path belongs to admin or dashboard areas
  const isAdminPath = pathname === '/admin' || pathname.startsWith('/admin/');
  const isDashboardPath =
    pathname === '/dashboard' || pathname.startsWith('/dashboard/');

  if (isAdminPath || isDashboardPath) {
    // Public routes that unauthenticated users can access
    const isPublicRoute =
      pathname === '/admin/login' ||
      pathname === '/admin/forgot-password' ||
      pathname === '/admin/reset-password';

    if (!isPublicRoute) {
      // Get the NextAuth token
      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
      });

      if (!token) {
        const isServerAction =
          req.headers.has('next-action') || req.headers.has('Next-Action');
        const isApiRoute = pathname.startsWith('/api/');

        // For Server Actions or API routes, return 401 Unauthorized
        if (isServerAction || isApiRoute) {
          return NextResponse.json(
            { error: 'Unauthorized access to administrative resources.' },
            { status: 401 },
          );
        }

        // For standard pages, redirect to /admin/login with callbackUrl
        const loginUrl = new URL('/admin/login', req.url);
        loginUrl.searchParams.set('callbackUrl', req.url);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/dashboard', '/dashboard/:path*'],
};
