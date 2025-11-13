"use client";
import { Sidebar } from '@/components/dashboard/Sidebar';

interface SidebarClientProps {
  userName?: string;
  userEmail?: string;
}

export default function SidebarClient({ userName, userEmail }: SidebarClientProps) {
  return <Sidebar userName={userName} userEmail={userEmail} />;
}
