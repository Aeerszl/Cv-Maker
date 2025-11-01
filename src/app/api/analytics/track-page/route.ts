/**
 * Analytics Tracking API
 * 
 * POST /api/analytics/track-page - Track page view
 * POST /api/analytics/track-link - Track link click
 * 
 * Public endpoints called from middleware and client-side
 * 
 * @module app/api/analytics
 */

import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/services/AnalyticsService';

/**
 * Track page view
 * 
 * POST /api/analytics/track-page
 */
export async function POST(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    
    // Route to appropriate handler
    if (pathname.endsWith('/track-page')) {
      return handleTrackPage(request);
    } else if (pathname.endsWith('/track-link')) {
      return handleTrackLink(request);
    }
    
    return NextResponse.json(
      { error: 'Invalid endpoint' },
      { status: 404 }
    );
  } catch (error) {
    console.error('❌ Analytics tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Handle page view tracking
 */
async function handleTrackPage(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { page, ip, userAgent, referrer } = body;
    
    if (!page || !ip) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    await AnalyticsService.trackPageView(page, ip, userAgent, referrer);
    
    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error tracking page view:', error);
    return NextResponse.json(
      { error: 'Failed to track page view' },
      { status: 500 }
    );
  }
}

/**
 * Handle link click tracking
 */
async function handleTrackLink(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { linkUrl, page, ip } = body;
    
    if (!linkUrl || !page || !ip) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    await AnalyticsService.trackLinkClick(linkUrl, page, ip);
    
    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error tracking link click:', error);
    return NextResponse.json(
      { error: 'Failed to track link click' },
      { status: 500 }
    );
  }
}
