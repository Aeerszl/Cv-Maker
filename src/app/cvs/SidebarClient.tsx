"use client";
import { Sidebar } from '@/components/dashboard/Sidebar';

export default function SidebarClient({ userName, userEmail }) {
  return <Sidebar userName={userName} userEmail={userEmail} />;
}
