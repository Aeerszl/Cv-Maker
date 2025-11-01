/**
 * Link Click Tracking API
 * 
 * POST /api/analytics/track-link
 * 
 * Tracks external link clicks
 * 
 * @module app/api/analytics/track-link
 */

import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/services/AnalyticsService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { linkUrl, page } = body;
    
    if (!linkUrl || !page) {
      return NextResponse.json(
        { error: 'Missing required fields: linkUrl, page' },
        { status: 400 }
      );
    }
    
    // Get client IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    await AnalyticsService.trackLinkClick(linkUrl, page, ip);
    
    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Link click tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track link click' },
      { status: 500 }
    );
  }
}
