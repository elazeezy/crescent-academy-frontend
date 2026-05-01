import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;
  // NextAuth v5 uses "authjs.session-token" (HTTP) or "__Secure-authjs.session-token" (HTTPS/prod)
  const isSecure = req.url.startsWith('https://');
  const cookieName = isSecure ? '__Secure-authjs.session-token' : 'authjs.session-token';
  const token = await getToken({ req, secret, cookieName });
  const { pathname } = req.nextUrl;

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const role = token.role as string;

  if (pathname.startsWith('/portals/dashboard/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (pathname.startsWith('/portals/dashboard/teacher') && role !== 'teacher') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (pathname.startsWith('/portals/dashboard/student') && role !== 'student') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/portals/dashboard/:path*'],
};
