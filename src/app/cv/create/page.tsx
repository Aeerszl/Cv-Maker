/**
 * CV Builder Page
 * 
 * Multi-step form for creating professional CVs
 * 
 * Features:
 * - 7-step wizard
 * - Form validation
 * - Auto-save
 * - Template selection
 * - Live preview
 * 
 * @module app/cv/create/page
 */

import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import CVBuilderClient from './CVBuilderClient';

/**
 * CV Builder Page Component (Server)
 */
export default async function CVBuilderPage() {
  // Check authentication
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  return (
    <CVBuilderClient
      userName={session.user.name || 'User'}
      userEmail={session.user.email || undefined}
    />
  );
}
