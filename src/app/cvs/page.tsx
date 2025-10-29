/**
 * My CVs Page
 * 
 * Display all user's CVs with edit, delete, duplicate, download actions
 * 
 * @module app/cvs/page
 */

import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { CVsContent } from '@/components/cvs/CVsContent';

/**
 * My CVs Page - Server Component
 */
export default async function CVsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin');
  }

  // TODO: Fetch user's CVs from database
  const mockCVs = [
    {
      id: '1',
      title: 'Senior Developer CV',
      template: 'modern' as const,
      lastModified: new Date('2024-10-25'),
      createdAt: new Date('2024-10-20'),
      isComplete: true,
      completionPercentage: 100,
    },
    {
      id: '2',
      title: 'Product Manager Resume',
      template: 'professional' as const,
      lastModified: new Date('2024-10-22'),
      createdAt: new Date('2024-10-15'),
      isComplete: true,
      completionPercentage: 100,
    },
    {
      id: '3',
      title: 'Designer Portfolio',
      template: 'creative' as const,
      lastModified: new Date('2024-10-20'),
      createdAt: new Date('2024-10-10'),
      isComplete: false,
      completionPercentage: 65,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        userName={session.user.name || 'User'} 
        userEmail={session.user.email || undefined}
      />

      <main className="ml-72 transition-all duration-300 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <CVsContent initialCVs={mockCVs} />
        </div>
      </main>
    </div>
  );
}
