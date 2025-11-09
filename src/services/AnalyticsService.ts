/**
 * Analytics Service
 * 
 * Handles all analytics operations with OOP principles
 * 
 * @module services/AnalyticsService
 */

import dbConnect from '@/lib/mongodb';
import { PageView, LinkClick, EmailUsage } from '@/models/Analytics';
import User from '@/models/User';
import PendingUser from '@/models/PendingUser';

export class AnalyticsService {
  /**
   * Track page view
   */
  static async trackPageView(
    page: string,
    ip: string,
    userAgent: string,
    referrer?: string
  ): Promise<void> {
    try {
      await dbConnect();
      await PageView.create({
        page,
        ip,
        userAgent,
        referrer,
      });
    } catch {
      // Don't throw - analytics shouldn't break the app
    }
  }

  /**
   * Track external link click
   */
  static async trackLinkClick(
    linkUrl: string,
    page: string,
    ip: string
  ): Promise<void> {
    try {
      await dbConnect();
      await LinkClick.create({
        linkUrl,
        page,
        ip,
      });
    } catch {
      // Silent fail - analytics shouldn't break the app
    }
  }

  /**
   * Track email sent (for Resend quota monitoring)
   */
  static async trackEmailSent(): Promise<void> {
    try {
      await dbConnect();
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

      await EmailUsage.findOneAndUpdate(
        { month: currentMonth },
        {
          $inc: { emailsSent: 1 },
          $set: { lastEmailSentAt: new Date() },
        },
        { upsert: true }
      );
    } catch {
      // Silent fail - email tracking shouldn't break the app
    }
  }

  /**
   * Get dashboard statistics
   */
  static async getDashboardStats() {
    try {
      await dbConnect();

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Total users (verified)
      const totalUsers = await User.countDocuments();

      // Pending users (awaiting verification)
      const pendingUsers = await PendingUser.countDocuments();

      // Page views stats
      const totalPageViews = await PageView.countDocuments();
      const todayPageViews = await PageView.countDocuments({
        timestamp: { $gte: today },
      });
      const monthPageViews = await PageView.countDocuments({
        timestamp: { $gte: thisMonth },
      });

      // Unique visitors (by IP)
      const uniqueVisitorsToday = await PageView.distinct('ip', {
        timestamp: { $gte: today },
      });
      const uniqueVisitorsMonth = await PageView.distinct('ip', {
        timestamp: { $gte: thisMonth },
      });

      // Link clicks
      const totalLinkClicks = await LinkClick.countDocuments();
      const todayLinkClicks = await LinkClick.countDocuments({
        timestamp: { $gte: today },
      });

      // Email usage (current month)
      const currentMonth = now.toISOString().slice(0, 7);
      const emailUsage = await EmailUsage.findOne({ month: currentMonth });

      return {
        users: {
          total: totalUsers,
          pending: pendingUsers,
          verified: totalUsers,
        },
        pageViews: {
          total: totalPageViews,
          today: todayPageViews,
          thisMonth: monthPageViews,
        },
        uniqueVisitors: {
          today: uniqueVisitorsToday.length,
          thisMonth: uniqueVisitorsMonth.length,
        },
        linkClicks: {
          total: totalLinkClicks,
          today: todayLinkClicks,
        },
        emailUsage: {
          sent: emailUsage?.emailsSent || 0,
          limit: 3000,
          remaining: 3000 - (emailUsage?.emailsSent || 0),
          percentage: ((emailUsage?.emailsSent || 0) / 3000) * 100,
          lastSent: emailUsage?.lastEmailSentAt,
        },
      };
    } catch {
      // Return empty stats on error
      return {
        totalUsers: 0,
        totalCVs: 0,
        totalPageViews: 0,
        emailUsage: { sent: 0, limit: 3000, percentage: 0 },
      };
    }
  }

  /**
   * Get page-specific analytics
   */
  static async getPageAnalytics(page: string, days: number = 30) {
    try {
      await dbConnect();

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const pageViews = await PageView.find({
        page,
        timestamp: { $gte: startDate },
      }).sort({ timestamp: -1 });

      // Group by date
      const viewsByDate: Record<string, number> = {};
      pageViews.forEach((view) => {
        const date = view.timestamp.toISOString().split('T')[0];
        viewsByDate[date] = (viewsByDate[date] || 0) + 1;
      });

      return {
        total: pageViews.length,
        viewsByDate,
      };
    } catch {
      return { total: 0, viewsByDate: {} };
    }
  }

  /**
   * Get external link click statistics
   */
  static async getLinkClickStats() {
    try {
      await dbConnect();

      const linkClicks = await LinkClick.aggregate([
        {
          $group: {
            _id: '$linkUrl',
            count: { $sum: 1 },
            lastClicked: { $max: '$timestamp' },
          },
        },
        { $sort: { count: -1 } },
      ]);

      return linkClicks.map((link) => ({
        url: link._id,
        clicks: link.count,
        lastClicked: link.lastClicked,
      }));
    } catch {
      return [];
    }
  }
}
