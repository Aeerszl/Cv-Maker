/**
 * Admin Analytics Page
 * 
 * Detailed analytics and statistics
 * 
 * @module app/admin/analytics
 */

import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Sidebar } from '@/components/dashboard/Sidebar';
import AdminAnalyticsContent from '@/components/admin/AdminAnalyticsContent';

export default async function AdminAnalyticsPage() {
  const session = await getServerSession(authOptions);

  // Admin check
  if (!session?.user || session.user.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        userName={session.user.name || 'Admin'}
        userEmail={session.user.email || undefined}
      />

      {/* Main Content */}
      <main className="ml-72 transition-all duration-300">
        <AdminAnalyticsContent />
      </main>
    </div>
  );
}
