/**
 * Admin Page Analytics API
 * 
 * GET /api/admin/analytics/pages?page=/&days=30
 * 
 * Returns page view analytics for a specific page
 * Requires admin authentication
 * 
 * @module app/api/admin/analytics/pages
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { AnalyticsService } from '@/services/AnalyticsService';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Login required' },
        { status: 401 }
      );
    }

    // Check admin role
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '/';
    const days = parseInt(searchParams.get('days') || '30', 10);

    // Validate days parameter
    if (days < 1 || days > 365) {
      return NextResponse.json(
        { error: 'Days parameter must be between 1 and 365' },
        { status: 400 }
      );
    }

    // Get page analytics
    const analytics = await AnalyticsService.getPageAnalytics(page, days);

    return NextResponse.json(
      {
        success: true,
        data: {
          page,
          days,
          analytics,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Page analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
