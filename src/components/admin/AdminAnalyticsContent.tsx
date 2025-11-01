/**
 * Admin Analytics Content Component
 * 
 * Detailed analytics with charts
 * 
 * @module components/admin/AdminAnalyticsContent
 */

'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { ExternalLink, Eye, TrendingUp } from 'lucide-react';

interface PageView {
  page: string;
  count: number;
  uniqueVisitors: number;
}

interface LinkClick {
  linkName: string;
  url: string;
  clicks: number;
}

export default function AdminAnalyticsContent() {
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [linkClicks, setLinkClicks] = useState<LinkClick[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch page analytics
      const pageRes = await fetch('/api/admin/analytics/pages');
      const pageData = await pageRes.json();
      
      // Fetch link analytics
      const linkRes = await fetch('/api/admin/analytics/links');
      const linkData = await linkRes.json();
      
      if (pageData.success) {
        setPageViews(pageData.topPages || []);
      }
      
      if (linkData.success) {
        setLinkClicks(linkData.topLinks || []);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          📊 Advanced Analytics
        </h1>
        <p className="text-muted-foreground">
          Detaylı sayfa ve link analiz raporları
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Page Visitors Chart */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Sayfa Ziyaretçi İstatistikleri</h2>
              <p className="text-sm text-muted-foreground">Hangi sayfalara kaç kişi geliyor</p>
            </div>
          </div>

          {pageViews.length > 0 ? (
            <div className="space-y-6">
              {/* Bar Chart */}
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={pageViews}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="page" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#3b82f6" name="Toplam Görüntüleme" />
                  <Bar dataKey="uniqueVisitors" fill="#8b5cf6" name="Tekil Ziyaretçi" />
                </BarChart>
              </ResponsiveContainer>

              {/* Stats Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Sayfa</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold">Görüntüleme</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold">Tekil Ziyaretçi</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold">Tekrar Ziyaret</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {pageViews.map((page, index) => (
                      <tr key={index} className="hover:bg-accent/50">
                        <td className="px-4 py-3 font-medium">{page.page}</td>
                        <td className="px-4 py-3 text-right">{page.count}</td>
                        <td className="px-4 py-3 text-right">{page.uniqueVisitors}</td>
                        <td className="px-4 py-3 text-right">
                          {page.count - page.uniqueVisitors}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Henüz sayfa görüntüleme verisi yok
            </div>
          )}
        </Card>

        {/* Link Click Analytics */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <ExternalLink className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Link Tıklama İstatistikleri</h2>
              <p className="text-sm text-muted-foreground">
                Hakkımda sayfasındaki &quot;Web Sitemi Ziyaret Et&quot; ve diğer linkler
              </p>
            </div>
          </div>

          {linkClicks.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={linkClicks}
                      dataKey="clicks"
                      nameKey="linkName"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={(entry) => `${entry.linkName}: ${entry.clicks}`}
                    >
                      {linkClicks.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Link Cards */}
              <div className="space-y-4">
                {linkClicks.map((link, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border border-border hover:border-primary transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{link.linkName}</h3>
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {link.url}
                        </p>
                      </div>
                      <div className="ml-4 text-right">
                        <div className="text-2xl font-bold" style={{ color: COLORS[index % COLORS.length] }}>
                          {link.clicks}
                        </div>
                        <div className="text-xs text-muted-foreground">tıklama</div>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mt-3">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${(link.clicks / Math.max(...linkClicks.map(l => l.clicks))) * 100}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Henüz link tıklama verisi yok
            </div>
          )}
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Toplam Sayfa Görüntüleme</p>
                <p className="text-2xl font-bold">
                  {pageViews.reduce((sum, p) => sum + p.count, 0)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Toplam Tekil Ziyaretçi</p>
                <p className="text-2xl font-bold">
                  {pageViews.reduce((sum, p) => sum + p.uniqueVisitors, 0)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <ExternalLink className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Toplam Link Tıklaması</p>
                <p className="text-2xl font-bold">
                  {linkClicks.reduce((sum, l) => sum + l.clicks, 0)}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
