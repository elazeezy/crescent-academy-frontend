import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

const ROLE_PATHS: Record<string, string> = {
  admin:   '/portals/dashboard/admin',
  teacher: '/portals/dashboard/teacher',
  student: '/portals/dashboard/student',
};

const SECRET = process.env.NEXTAUTH_SECRET;

// Read both cookie names in parallel — one call each, resolved together
async function resolveToken(req: NextRequest) {
  const [secure, plain] = await Promise.all([
    getToken({ req, secret: SECRET, cookieName: '__Secure-authjs.session-token' }),
    getToken({ req, secret: SECRET, cookieName: 'authjs.session-token' }),
  ]);
  return secure ?? plain;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await resolveToken(req);

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const role = token.role as string;

  // /portals/dashboard → redirect to role-specific dashboard
  if (pathname === '/portals/dashboard') {
    const dest = ROLE_PATHS[role] ?? '/login';
    return NextResponse.redirect(new URL(dest, req.url));
  }

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
  matcher: ['/portals/dashboard', '/portals/dashboard/:path*'],
};
