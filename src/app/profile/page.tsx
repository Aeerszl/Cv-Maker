'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import ProfileContent from '@/components/profile/ProfileContent';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Check authentication
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        userName={session.user.name || 'User'}
        userEmail={session.user.email || undefined}
      />

      {/* Main Content */}
      <main className="ml-72 transition-all duration-300">
        <ProfileContent />
      </main>
    </div>
  );
}
