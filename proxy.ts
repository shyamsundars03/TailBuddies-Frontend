// proxy.ts - with logging

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_ROUTES = ['/signin', '/signup', '/forgot-password', '/reset-password', '/verify-otp'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;

  // Redirect to signin if no token
  if (!token) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  try {
    // Verify token (you'll need your JWT secret)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // Role-based redirection
    if (pathname.startsWith('/admin') && payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (pathname.startsWith('/doctor') && payload.role !== 'doctor') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (pathname.startsWith('/owner') && payload.role !== 'owner') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();

  } catch (error) {
    // Log the error (you can remove this in production if needed)
    console.error('Token verification failed:', error);

    // Invalid token
    return NextResponse.redirect(new URL('/signin', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};