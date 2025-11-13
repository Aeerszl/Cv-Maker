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

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Moon, Sun, Languages, Menu, X } from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();

  useEffect(() => {
    // Use a microtask to avoid sync state update
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-md border-b border-border/50 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-18">
            <div className="w-32 h-8 bg-muted animate-pulse rounded" />
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-muted animate-pulse rounded" />
              <div className="w-8 h-8 bg-muted animate-pulse rounded" />
              <div className="w-16 h-8 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-md border-b border-border/50 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group cursor-pointer">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 transition-transform group-hover:scale-105">
              <Image 
                src="/Logo.png" 
                alt="CV Maker" 
                fill
                className="object-contain"
                priority
                quality={100}
                sizes="(max-width: 640px) 40px, 48px"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold text-foreground">
                CvMaker
              </span>
              <span className="text-xs font-medium text-muted-foreground -mt-0.5">
                .Aliee
              </span>
            </div>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href={pathname === '/' ? '#features' : '/#features'}
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              {t('nav.features')}
            </Link>
            <Link
              href={pathname === '/' ? '#templates' : '/#templates'}
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              {t('nav.templates')}
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              {t('nav.about')}
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-foreground" />
            )}
          </button>
          
          {/* Right Section: Theme Toggle + Language + Auth */}
          <div className="hidden md:flex items-center gap-1 sm:gap-2">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-foreground" />
              ) : (
                <Moon className="w-4 h-4 text-foreground" />
              )}
            </button>

            {/* Language Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-2 rounded-lg hover:bg-accent transition-colors flex items-center gap-1"
                  aria-label="Change language"
                >
                  <Languages className="w-4 h-4 text-foreground" />
                  <span className="text-xs font-medium text-foreground hidden sm:inline">
                    {language.toUpperCase()}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background border border-border">
                <DropdownMenuItem 
                  onClick={() => setLanguage('tr')}
                  className="cursor-pointer"
                >
                  🇹🇷 Türkçe
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setLanguage('en')}
                  className="cursor-pointer"
                >
                  🇬🇧 English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sign Up Button */}
            <Link
              href="/auth/signup"
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              {t('nav.signup')}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="px-4 py-4 space-y-4">
            <Link
              href={pathname === '/' ? '#features' : '/#features'}
              className="block text-sm font-medium text-foreground/80 hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.features')}
            </Link>
            <Link
              href={pathname === '/' ? '#templates' : '/#templates'}
              className="block text-sm font-medium text-foreground/80 hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.templates')}
            </Link>
            <Link
              href="/about"
              className="block text-sm font-medium text-foreground/80 hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.about')}
            </Link>
            
            <div className="border-t border-border pt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Theme Toggle */}
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 rounded-lg hover:bg-accent transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-4 h-4 text-foreground" />
                  ) : (
                    <Moon className="w-4 h-4 text-foreground" />
                  )}
                </button>

                {/* Language Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="p-2 rounded-lg hover:bg-accent transition-colors flex items-center gap-1"
                      aria-label="Change language"
                    >
                      <Languages className="w-4 h-4 text-foreground" />
                      <span className="text-xs font-medium text-foreground">
                        {language.toUpperCase()}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="bg-background border border-border">
                    <DropdownMenuItem 
                      onClick={() => setLanguage('tr')}
                      className="cursor-pointer"
                    >
                      🇹🇷 Türkçe
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setLanguage('en')}
                      className="cursor-pointer"
                    >
                      🇬🇧 English
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Sign Up Button */}
              <Link
                href="/auth/signup"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.signup')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
