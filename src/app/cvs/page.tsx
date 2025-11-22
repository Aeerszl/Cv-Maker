'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import SidebarClient from './SidebarClient';
import { CVsContent } from '@/components/cvs/CVsContent';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ToastProvider } from '@/contexts/ToastContext';

export default function CVsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session?.user) {
    return null;
  }

  return (
    <LanguageProvider>
      <ToastProvider>
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
      </ToastProvider>
    </LanguageProvider>
  );
}