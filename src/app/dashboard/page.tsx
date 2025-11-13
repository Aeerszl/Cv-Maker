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

'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import { useLanguage } from '@/contexts/LanguageContext';
import type { CVCard as CVCardType } from '@/types/dashboard';

/**
 * Dashboard Page Component
 */
export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useLanguage();
  const [cvs, setCvs] = useState<CVCardType[]>([]);
  const [loading, setLoading] = useState(true);

  // Check authentication
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Fetch CVs
  useEffect(() => {
    const fetchCVs = async () => {
      try {
        const response = await fetch('/api/cv');
        if (response.ok) {
          const data = await response.json();
          setCvs(data.cvs || []);
        }
      } catch {
        // Silently fail - user will see empty state
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchCVs();
    }
  }, [status]);

  if (status === 'loading' || loading) {
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

      {/* Main Content - Responsive margin */}
      <main className="lg:ml-72 transition-all duration-300">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 pt-20 lg:pt-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              {t('dashboard.title')}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {t('dashboard.subtitle')}
            </p>
          </div>

          {/* Dashboard Content */}
          <DashboardContent initialCVs={cvs} />
        </div>
      </main>
    </div>
  );
}
