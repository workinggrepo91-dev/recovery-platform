// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Check if the user is trying to access an Admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    
    // 2. Exception: Allow them to visit the Login page
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    // 3. Check for the session cookie
    const adminSession = request.cookies.get('admin_session');

    // 4. If no cookie, redirect to Login
    if (!adminSession) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

// Configure which routes to monitor
export const config = {
  matcher: '/admin/:path*',
};