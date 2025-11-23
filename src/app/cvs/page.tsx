import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import SidebarClient from './SidebarClient';
import { CVsContent } from '@/components/cvs/CVsContent';

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