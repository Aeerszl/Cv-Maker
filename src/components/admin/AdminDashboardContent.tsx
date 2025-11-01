/**
 * Admin Dashboard Content Component
 * 
 * Client-side component for displaying admin analytics
 * Fetches and visualizes system statistics
 * 
 * @module components/admin/AdminDashboardContent
 */

'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '@/components/ui/Card';

interface DashboardStats {
  users: {
    total: number;
    pending: number;
    verified: number;
  };
  pageViews: {
    total: number;
    today: number;
    thisMonth: number;
  };
  uniqueVisitors: {
    today: number;
    thisMonth: number;
  };
  linkClicks: {
    total: number;
    today: number;
  };
  emailUsage: {
    sent: number;
    limit: number;
    remaining: number;
    percentage: number;
    lastSent: Date | null;
  };
}

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe'];

export function AdminDashboardContent() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }
      const data = await response.json();
      setStats(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
        <div className="max-w-7xl mx-auto">
          <Card className="p-6 bg-red-50 border-red-200">
            <h2 className="text-xl font-bold text-red-800">❌ Error Loading Dashboard</h2>
            <p className="text-red-600 mt-2">{error || 'Failed to load stats'}</p>
          </Card>
        </div>
      </div>
    );
  }

  const emailUsageData = [
    { name: 'Used', value: stats.emailUsage.sent },
    { name: 'Remaining', value: stats.emailUsage.remaining },
  ];

  const userStatsData = [
    { name: 'Verified', value: stats.users.verified },
    { name: 'Pending', value: stats.users.pending },
  ];

  const getEmailUsageColor = () => {
    if (stats.emailUsage.percentage >= 90) return 'text-red-600';
    if (stats.emailUsage.percentage >= 75) return 'text-orange-600';
    return 'text-green-600';
  };

  const getEmailUsageBgColor = () => {
    if (stats.emailUsage.percentage >= 90) return 'bg-red-50 border-red-200';
    if (stats.emailUsage.percentage >= 75) return 'bg-orange-50 border-orange-200';
    return 'bg-green-50 border-green-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">📊 Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">System analytics and statistics</p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Users */}
          <Card className="p-6 bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Users</p>
                <p className="text-4xl font-bold mt-2">{stats.users.total}</p>
                <p className="text-purple-100 text-xs mt-1">
                  {stats.users.verified} verified, {stats.users.pending} pending
                </p>
              </div>
              <div className="text-5xl opacity-20">👥</div>
            </div>
          </Card>

          {/* Page Views */}
          <Card className="p-6 bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Page Views</p>
                <p className="text-4xl font-bold mt-2">{stats.pageViews.total}</p>
                <p className="text-blue-100 text-xs mt-1">
                  Today: {stats.pageViews.today} | Month: {stats.pageViews.thisMonth}
                </p>
              </div>
              <div className="text-5xl opacity-20">📈</div>
            </div>
          </Card>

          {/* Unique Visitors */}
          <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Unique Visitors</p>
                <p className="text-4xl font-bold mt-2">{stats.uniqueVisitors.thisMonth}</p>
                <p className="text-green-100 text-xs mt-1">
                  Today: {stats.uniqueVisitors.today} | This Month
                </p>
              </div>
              <div className="text-5xl opacity-20">🌐</div>
            </div>
          </Card>

          {/* Link Clicks */}
          <Card className="p-6 bg-gradient-to-br from-pink-500 to-rose-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100 text-sm font-medium">Link Clicks</p>
                <p className="text-4xl font-bold mt-2">{stats.linkClicks.total}</p>
                <p className="text-pink-100 text-xs mt-1">
                  Today: {stats.linkClicks.today} clicks
                </p>
              </div>
              <div className="text-5xl opacity-20">🔗</div>
            </div>
          </Card>
        </div>

        {/* Email Usage Warning */}
        <Card className={`p-6 ${getEmailUsageBgColor()}`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                📧 Resend API Usage
                {stats.emailUsage.percentage >= 90 && <span className="text-2xl">⚠️</span>}
              </h3>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Emails Sent</span>
                  <span className={`font-bold ${getEmailUsageColor()}`}>
                    {stats.emailUsage.sent} / {stats.emailUsage.limit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all ${
                      stats.emailUsage.percentage >= 90
                        ? 'bg-red-600'
                        : stats.emailUsage.percentage >= 75
                        ? 'bg-orange-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(stats.emailUsage.percentage, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>{stats.emailUsage.remaining} remaining</span>
                  <span className={`font-bold ${getEmailUsageColor()}`}>
                    {stats.emailUsage.percentage.toFixed(1)}% used
                  </span>
                </div>
              </div>
            </div>
          </div>
          {stats.emailUsage.percentage >= 90 && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-red-800 text-sm font-medium">
                ⚠️ Warning: Approaching email limit! Consider upgrading your Resend plan.
              </p>
            </div>
          )}
        </Card>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Email Usage Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Email API Usage</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={emailUsageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {emailUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* User Stats Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">User Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userStatsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#667eea" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Stats Summary */}
        <Card className="p-6 bg-gradient-to-r from-gray-50 to-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📋 Quick Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Total System Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.users.total}</p>
            </div>
            <div>
              <p className="text-gray-600">Total Page Views</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pageViews.total}</p>
            </div>
            <div>
              <p className="text-gray-600">Total Link Clicks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.linkClicks.total}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
