import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

const publicRoutes = ['/sign-in', '/sign-up', '/h', '/order'];
const authRoutes = ['/sign-in', '/sign-up'];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const pathname = nextUrl.pathname;

  // Allow auth API routes
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Allow public routes (menu browsing, order tracking)
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    // If logged in user visits auth pages, redirect to their dashboard
    if (isLoggedIn && authRoutes.some((route) => pathname.startsWith(route))) {
      const redirectUrl =
        req.auth?.user?.role === 'SUPER_ADMIN' ? '/hotels' : '/dashboard';
      return NextResponse.redirect(new URL(redirectUrl, nextUrl));
    }
    return NextResponse.next();
  }

  // Redirect unauthenticated users to sign-in
  if (!isLoggedIn) {
    const signInUrl = new URL('/sign-in', nextUrl);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  const role = req.auth?.user?.role;

  // Super admin routes - only SUPER_ADMIN
  if (
    pathname.startsWith('/hotels') ||
    pathname.startsWith('/subscriptions') ||
    pathname.startsWith('/platform-analytics')
  ) {
    if (role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', nextUrl));
    }
  }

  // Dashboard routes - ADMIN or MANAGER (must have a hotel)
  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/orders') ||
    pathname.startsWith('/scan-order') ||
    pathname.startsWith('/tables') ||
    pathname.startsWith('/kitchen') ||
    pathname.startsWith('/menu-management') ||
    pathname.startsWith('/analytics') ||
    pathname.startsWith('/qr-codes') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/subscription') ||
    pathname.startsWith('/staff') ||
    pathname.startsWith('/inventory') ||
    pathname.startsWith('/reservations')
  ) {
    if (role === 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/hotels', nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|ico)$).*)',
  ],
};
