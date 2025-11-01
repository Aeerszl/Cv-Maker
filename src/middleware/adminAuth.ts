/**
 * Admin Middleware
 * 
 * Protects admin routes and ensures only admin users can access
 * 
 * @module middleware/adminAuth
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * Verify if user is admin
 */
export async function verifyAdmin(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return {
        authorized: false,
        error: 'Unauthorized - No session',
        status: 401,
      };
    }

    // Check if user has admin role
    if (session.user.role !== 'admin') {
      return {
        authorized: false,
        error: 'Forbidden - Admin access required',
        status: 403,
      };
    }

    return {
      authorized: true,
      user: session.user,
    };
  } catch (error) {
    console.error('Admin auth error:', error);
    return {
      authorized: false,
      error: 'Internal server error',
      status: 500,
    };
  }
}

/**
 * Admin middleware wrapper for API routes
 */
export function withAdminAuth(handler: Function) {
  return async (req: NextRequest, ...args: any[]) => {
    const authResult = await verifyAdmin(req);

    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    // Pass user to handler
    return handler(req, authResult.user, ...args);
  };
}
