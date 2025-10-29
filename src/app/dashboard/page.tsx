/**
 * Dashboard Page
 * 
 * Main dashboard view with CV grid and statistics
 * 
 * Features:
 * - CV grid display
 * - Statistics overview
 * - Create new CV button
 * - Sidebar navigation
 * - Responsive layout
 * 
 * @module app/dashboard/page
 */

import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import type { CVCard as CVCardType } from '@/types/dashboard';

/**
 * Get user's CVs from database
 * TODO: Implement actual database query
 */
async function getUserCVs(_userId: string): Promise<CVCardType[]> {
  // Mock data for now
  // In production, query database: await CV.find({ userId }).sort({ lastModified: -1 })
  return [
    {
      id: '1',
      title: 'Yazılım Geliştirici CV',
      template: 'modern',
      lastModified: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
      isComplete: true,
    },
    {
      id: '2',
      title: 'Frontend Developer Resume',
      template: 'professional',
      lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      isComplete: false,
    },
    {
      id: '3',
      title: 'Full Stack Developer CV',
      template: 'creative',
      lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
      isComplete: true,
    },
  ];
}

/**
 * Dashboard Page Component
 */
export default async function DashboardPage() {
  // Check authentication
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  // Get user's CVs
  const cvs = await getUserCVs(session.user.id);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        userName={session.user.name || 'User'}
        userEmail={session.user.email || undefined}
      />

      {/* Main Content */}
      <main className="ml-72 transition-all duration-300">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Ana Sayfa
            </h1>
            <p className="text-muted-foreground">
              CV&apos;lerinizi yönetin ve düzenleyin
            </p>
          </div>

          {/* Dashboard Content */}
          <DashboardContent initialCVs={cvs} />
        </div>
      </main>
    </div>
  );
}
