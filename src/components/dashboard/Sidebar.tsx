/**
 * Dashboard Sidebar Component
 * 
 * Enhanced navigation sidebar with animations
 * 
 * Features:
 * - Smooth animations
 * - Collapsible design
 * - Dark mode toggle
 * - Language switcher
 * - User profile section
 * - Active state highlighting
 * 
 * @module components/dashboard/Sidebar
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { 
  Home,
  FileText, 
  Plus, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Globe,
  Shield,
  BarChart3,
  Users
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SidebarProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
}

/**
 * Enhanced Sidebar Component
 */
export function Sidebar({ userName = 'User', userEmail, userAvatar }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { data: session } = useSession();
  
  const isAdmin = session?.user?.role === 'admin';

  /**
   * Navigation items configuration
   */
  const navItems = [
    {
      label: t('sidebar.home'),
      href: '/dashboard',
      icon: Home,
    },
    {
      label: t('sidebar.myCVs'),
      href: '/cvs',
      icon: FileText,
    },
    {
      label: t('sidebar.createCV'),
      href: '/cv/create',
      icon: Plus,
      highlight: true,
    },
    {
      label: t('sidebar.settings'),
      href: '/settings',
      icon: Settings,
    },
  ];

  /**
   * Admin-only navigation items
   */
  const adminNavItems = [
    {
      label: 'Admin Dashboard',
      href: '/admin/dashboard',
      icon: Shield,
      adminOnly: true,
    },
    {
      label: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      adminOnly: true,
    },
    {
      label: 'User Management',
      href: '/admin/users',
      icon: Users,
      adminOnly: true,
    },
  ];

  /**
   * Check if navigation item is active
   */
  const isActive = (href: string): boolean => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname?.startsWith(href) || false;
  };

  /**
   * Handle logout
   */
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  /**
   * Toggle dark mode
   */
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <aside
      className={`
        fixed left-0 top-0 z-40 h-screen
        bg-white dark:bg-gray-900 border-r border-border
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-72'}
        shadow-xl
      `}
    >
      <div className="h-full flex flex-col">
        {/* Header with Logo and Collapse Button */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          {!isCollapsed && (
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <Image
                src="/Logo.png"
                alt="CV Maker Logo"
                width={48}
                height={48}
                className="transition-transform group-hover:scale-110"
              />
              <div>
                <h2 className="text-lg font-bold text-foreground">{t('sidebar.brand')}</h2>
                <p className="text-xs text-muted-foreground">{t('sidebar.tagline')}</p>
              </div>
            </Link>
          )}
          
          {isCollapsed && (
            <Link href="/dashboard" className="flex justify-center w-full group">
              <Image
                src="/Logo.png"
                alt="CV Maker Logo"
                width={40}
                height={40}
                className="transition-transform group-hover:scale-110"
              />
            </Link>
          )}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-accent transition-colors ml-auto"
            aria-label="Toggle sidebar"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-foreground" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-foreground" />
            )}
          </button>
        </div>

        {/* User Profile Section */}
        <div className={`p-4 border-b border-border ${isCollapsed ? 'flex justify-center' : ''}`}>
          <div className={`flex items-center ${isCollapsed ? 'flex-col' : 'gap-3'}`}>
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center shrink-0 ring-2 ring-primary/20">
              {userAvatar ? (
                <Image
                  src={userAvatar}
                  alt={userName}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-white font-bold text-lg">
                  {userName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {userName}
                  </p>
                  {isAdmin && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-orange-500 text-white rounded-full">
                      ADMIN
                    </span>
                  )}
                </div>
                {userEmail && (
                  <p className="text-xs text-muted-foreground truncate">
                    {userEmail}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  group relative flex items-center gap-3 px-3 py-3 rounded-xl
                  text-sm font-medium transition-all duration-200
                  ${active 
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105' 
                    : item.highlight
                    ? 'bg-linear-to-r from-blue-500/10 to-purple-500/10 text-foreground hover:from-blue-500/20 hover:to-purple-500/20'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground hover:scale-105'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                <Icon className={`w-5 h-5 shrink-0 ${active ? 'animate-pulse' : ''}`} />
                {!isCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {item.label}
                  </div>
                )}

                {/* Highlight badge */}
                {item.highlight && !isCollapsed && (
                  <span className="ml-auto px-2 py-0.5 text-xs font-bold bg-primary text-primary-foreground rounded-full">
                    New
                  </span>
                )}
              </Link>
            );
          })}

          {/* Admin Section */}
          {isAdmin && (
            <>
              <div className="pt-4 pb-2">
                {!isCollapsed && (
                  <div className="px-3 mb-2">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-orange-500" />
                      <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">
                        Admin Panel
                      </span>
                    </div>
                  </div>
                )}
                {isCollapsed && (
                  <div className="h-px bg-orange-500/30 mx-3 mb-2" />
                )}
              </div>

              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      group relative flex items-center gap-3 px-3 py-3 rounded-xl
                      text-sm font-medium transition-all duration-200
                      ${active 
                        ? 'bg-orange-500 text-white shadow-lg scale-105' 
                        : 'text-muted-foreground hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-400 hover:scale-105'
                      }
                      ${isCollapsed ? 'justify-center' : ''}
                    `}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${active ? 'animate-pulse' : ''}`} />
                    {!isCollapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                    
                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-3 py-2 bg-orange-600 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {item.label}
                      </div>
                    )}
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        {/* Settings Section */}
        <div className="p-3 border-t border-border space-y-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className={`
              flex items-center gap-3 px-3 py-3 rounded-xl w-full
              text-sm font-medium transition-all duration-200
              text-muted-foreground hover:bg-accent hover:text-foreground hover:scale-105
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 shrink-0" />
            ) : (
              <Moon className="w-5 h-5 shrink-0" />
            )}
            {!isCollapsed && (
              <span>{theme === 'dark' ? t('sidebar.lightMode') : t('sidebar.darkMode')}</span>
            )}
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className={`
                flex items-center gap-3 px-3 py-3 rounded-xl w-full
                text-sm font-medium transition-all duration-200
                text-muted-foreground hover:bg-accent hover:text-foreground hover:scale-105
                ${isCollapsed ? 'justify-center' : ''}
              `}
            >
              <Globe className="w-5 h-5 shrink-0" />
              {!isCollapsed && (
                <span>{language === 'tr' ? 'Türkçe' : 'English'}</span>
              )}
            </button>

            {/* Language Dropdown */}
            {isLanguageOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsLanguageOpen(false)}
                />
                <div className={`absolute ${isCollapsed ? 'left-full ml-2' : 'bottom-full mb-2'} left-0 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-border z-20 overflow-hidden`}>
                  <button
                    onClick={() => setLanguage('tr')}
                    className={`flex items-center gap-3 w-full px-4 py-3 text-sm transition-colors ${
                      language === 'tr' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                    }`}
                  >
                    <span className="text-xl">🇹🇷</span>
                    <span>Türkçe</span>
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`flex items-center gap-3 w-full px-4 py-3 text-sm transition-colors ${
                      language === 'en' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                    }`}
                  >
                    <span className="text-xl">🇬🇧</span>
                    <span>English</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`
              flex items-center gap-3 px-3 py-3 rounded-xl w-full
              text-sm font-medium transition-all duration-200
              text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:scale-105
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span>{t('sidebar.logout')}</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}

