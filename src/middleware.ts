/**
 * Next.js Middleware
 * 
 * Handles route protection, authentication checks, and page view analytics
 * 
 * @module middleware
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Protected routes that require authentication
 */
const PROTECTED_ROUTES = [
  '/dashboard',
  '/cv/create',
  '/cv/edit',
  '/profile',
];

/**
 * Public routes that redirect to dashboard if authenticated
 */
const PUBLIC_ROUTES = [
  '/auth/signin',
  '/auth/signup',
];

/**
 * Routes to exclude from analytics tracking
 */
const ANALYTICS_EXCLUDE = [
  '/api/',
  '/_next/',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
];

/**
 * Track page view asynchronously (fire and forget)
 * 
 * @param request - Next.js request object
 */
async function trackPageView(request: NextRequest): Promise<void> {
  try {
    const { pathname } = request.nextUrl;
    
    // Skip analytics for excluded routes
    if (ANALYTICS_EXCLUDE.some(route => pathname.startsWith(route))) {
      return;
    }
    
    // Get client info
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
               request.headers.get('x-real-ip') || 
               'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const referrer = request.headers.get('referer') || '';
    
    // Make async call to analytics API (fire and forget)
    const baseUrl = request.nextUrl.origin;
    fetch(`${baseUrl}/api/analytics/track-page`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page: pathname,
        ip,
        userAgent,
        referrer,
      }),
    }).catch(() => {
      // Silent fail - tracking shouldn't break page load
    });
  } catch {
    // Silent fail - tracking shouldn't break page load
  }
}

/**
 * Middleware function to protect routes and track analytics
 * 
 * @param request - Next.js request object
 * @returns NextResponse
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Track page view (async, non-blocking)
  trackPageView(request);
  
  // Get token from cookies (NextAuth sets this)
  const token = request.cookies.get('next-auth.session-token')?.value ||
                request.cookies.get('__Secure-next-auth.session-token')?.value;
  
  const isAuthenticated = !!token;
  
  // Check if route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if route is public (auth pages)
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    pathname.startsWith(route)
  );
  
  // Redirect to signin if trying to access protected route without auth
  if (isProtectedRoute && !isAuthenticated) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }
  
  // Redirect to dashboard if authenticated user tries to access auth pages
  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

/**
 * Matcher config - which routes should run middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
};
