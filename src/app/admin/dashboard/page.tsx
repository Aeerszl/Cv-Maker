/**
 * Admin Dashboard Page
 * 
 * Displays comprehensive analytics and system statistics
 * Requires admin authentication
 * 
 * @module app/admin/dashboard
 */

import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { AdminDashboardContent } from '@/components/admin/AdminDashboardContent';
import { Sidebar } from '@/components/dashboard/Sidebar';

export const metadata: Metadata = {
  title: 'Admin Dashboard - CvMaker.Aliee',
  description: 'Analytics and system statistics',
};

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  // Check authentication
  if (!session || !session.user) {
    redirect('/auth/signin?callbackUrl=/admin/dashboard');
  }

  // Check admin role
  if (session.user.role !== 'admin') {
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
        <AdminDashboardContent />
      </main>
    </div>
  );
}
