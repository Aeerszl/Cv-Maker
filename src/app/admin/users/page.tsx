/**
 * Admin User Management Page
 * 
 * User list and management
 * 
 * @module app/admin/users
 */

import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import AdminUsersContent from '@/components/admin/AdminUsersContent';
import { Sidebar } from '@/components/dashboard/Sidebar';

export default async function AdminUsersPage() {
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
        <AdminUsersContent />
      </main>
    </div>
  );
}
