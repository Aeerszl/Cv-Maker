/**
 * Enhanced Header Component
 * 
 * Features:
 * - Larger logo with "CvMaker.Aliee" branding
 * - Dark/Light mode toggle
 * - Language switcher (TR/EN)
 * - Animated underline effect
 * - Glass morphism with shadow
 * 
 * @module components/Header
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Moon, Sun, Languages, Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    // Use a microtask to avoid sync state update
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <nav className="fixed top-0 w-full glass z-50 border-b border-gray-200/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 sm:h-22">
            <div className="w-48 h-14 bg-gray-200 animate-pulse rounded" />
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-gray-200 animate-pulse rounded" />
              <div className="w-10 h-10 bg-gray-200 animate-pulse rounded" />
              <div className="w-24 h-10 bg-gray-200 animate-pulse rounded" />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 w-full glass z-50 border-b border-border/50 backdrop-blur-md shadow-lg dark:shadow-primary/5">
      {/* Animated underline */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-shimmer" />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 sm:h-22">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 sm:gap-4 group cursor-pointer">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 transition-transform group-hover:scale-105">
              <Image 
                src="/Logo.png" 
                alt="CV Maker" 
                fill
                className="object-contain"
                priority
                quality={100}
                sizes="(max-width: 640px) 64px, 80px"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                CvMaker
              </span>
              <span className="text-sm sm:text-base font-medium text-muted-foreground -mt-1">
                .Aliee
              </span>
            </div>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm font-semibold text-foreground/80 hover:text-foreground transition-colors relative group"
            >
              {t('nav.features')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary/50 transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              href="#templates"
              className="text-sm font-semibold text-foreground/80 hover:text-foreground transition-colors relative group"
            >
              {t('nav.templates')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary/50 transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-semibold text-foreground/80 hover:text-foreground transition-colors relative group"
            >
              {t('nav.pricing')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary/50 transition-all duration-300 group-hover:w-full" />
            </Link>
          </div>
          
          {/* Right Section: Theme Toggle + Language + Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-foreground" />
              ) : (
                <Moon className="w-5 h-5 text-foreground" />
              )}
            </button>

            {/* Language Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-2 rounded-lg hover:bg-accent transition-colors flex items-center gap-1"
                  aria-label="Change language"
                >
                  <Languages className="w-5 h-5 text-foreground" />
                  <span className="text-xs font-medium text-foreground hidden sm:inline">
                    {language.toUpperCase()}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => setLanguage('tr')}
                  className={language === 'tr' ? 'bg-accent' : ''}
                >
                  🇹🇷 Türkçe
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setLanguage('en')}
                  className={language === 'en' ? 'bg-accent' : ''}
                >
                  🇬🇧 English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sign Up Button */}
            <Link
              href="/auth/signup"
              className="relative px-4 py-2 sm:px-5 sm:py-2.5 bg-primary text-primary-foreground rounded-lg text-sm sm:text-base font-medium overflow-hidden group transition-all hover:shadow-lg whitespace-nowrap"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {t('nav.signup')}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
