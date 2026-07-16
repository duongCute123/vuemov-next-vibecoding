import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/profile', '/favourite'];
const adminRoutes = ['/admin'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('nhungmov_token')?.value;
  const userCookie = request.cookies.get('nhungmov_user')?.value;
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isAdmin = adminRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtected && !token) {
    const loginUrl = new URL('/auth', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdmin) {
    if (!token) {
      const loginUrl = new URL('/auth', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (userCookie) {
      try {
        const user = JSON.parse(userCookie);
        if (user.role !== 'admin') {
          return NextResponse.redirect(new URL('/', request.url));
        }
      } catch {
        return NextResponse.redirect(new URL('/auth', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/favourite/:path*', '/admin/:path*'],
};
