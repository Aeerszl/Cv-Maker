/**
 * Dashboard Type Definitions
 * 
 * TypeScript interfaces and types for dashboard components
 * 
 * @module types/dashboard
 */

import { LucideIcon } from 'lucide-react';

/**
 * CV Card data structure
 */
export interface CVCard {
  id: string;
  title: string;
  template: CVTemplate;
  lastModified: Date;
  createdAt: Date;
  isComplete: boolean;
}

/**
 * CV Template types
 */
export type CVTemplate = 'modern' | 'classic' | 'creative' | 'professional' | 'minimal';

/**
 * Dashboard statistics
 */
export interface DashboardStats {
  totalCVs: number;
  completedCVs: number;
  lastModified: Date | null;
}

/**
 * Sidebar navigation item
 */
export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number | string;
  isActive?: boolean;
}

/**
 * User profile data for dashboard
 */
export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
}

/**
 * Dashboard layout props
 */
export interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * CV Card props
 */
export interface CVCardProps extends CVCard {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onDownload?: (id: string) => void;
}
