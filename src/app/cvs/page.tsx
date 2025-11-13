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
import SidebarClient from './SidebarClient';
import { CVsContent } from '@/components/cvs/CVsContent';

/**
 * My CVs Page - Server Component
 */
export default async function CVsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-background">
      <SidebarClient 
        userName={session.user.name || 'User'} 
        userEmail={session.user.email || undefined}
      />
      <main className="lg:ml-72 transition-all duration-300 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <CVsContent initialCVs={[]} />
        </div>
      </main>
    </div>
  );
}
