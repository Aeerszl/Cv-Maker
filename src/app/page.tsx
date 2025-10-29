/**
 * Landing Page - Ultra Smooth Mouse Tracking
 * 
 * Optimizations:
 * - RequestAnimationFrame for smooth 60fps animations
 * - Direct DOM manipulation for cursor elements
 * - CSS transforms with will-change
 * - Throttled state updates
 * - Hardware acceleration
 * 
 * @module app/page
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Download, CheckCircle2, Sparkles, Star, TrendingUp } from 'lucide-react';
import { Header } from '@/components/Header';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Refs for direct DOM manipulation (much faster than React state)
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const blob3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let rafId: number;
    let lastUpdate = 0;
    const throttle = 16; // ~60fps

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      
      // Update cursor position immediately with direct DOM manipulation
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX - 16}px, ${e.clientY - 16}px)`;
      }
      
      // Throttle updates for other elements
      if (now - lastUpdate >= throttle) {
        lastUpdate = now;
        
        rafId = requestAnimationFrame(() => {
          const x = e.clientX;
          const y = e.clientY;
          
          // Update trail with slight delay
          if (trailRef.current) {
            trailRef.current.style.transform = `translate(${x - 8}px, ${y - 8}px)`;
          }
          
          // Update glow with more delay
          if (glowRef.current) {
            glowRef.current.style.transform = `translate(${x - 64}px, ${y - 64}px)`;
          }
          
          // Update blobs with parallax effect
          if (blob1Ref.current) {
            blob1Ref.current.style.transform = `translate(${x * 0.02}px, ${y * 0.02}px)`;
          }
          if (blob2Ref.current) {
            blob2Ref.current.style.transform = `translate(${-x * 0.015}px, ${y * 0.025}px)`;
          }
          if (blob3Ref.current) {
            blob3Ref.current.style.transform = `translate(${x * 0.018}px, ${-y * 0.018}px)`;
          }
          
          // Update state only for elements that need it (minimal)
          setMousePosition({ x, y });
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden transition-colors duration-300">
      {/* Ultra Smooth Custom Cursor - Direct DOM manipulation */}
      <div 
        ref={cursorRef}
        className="fixed w-8 h-8 pointer-events-none z-50 will-change-transform"
        style={{ transition: 'none' }}
      >
        <div className="absolute inset-0 border-2 border-blue-500/80 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full" />
      </div>

      {/* Smooth Trail Effect */}
      <div 
        ref={trailRef}
        className="fixed w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full pointer-events-none z-40 opacity-60 blur-sm will-change-transform"
        style={{ transition: 'transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
      />

      {/* Glow Effect */}
      <div 
        ref={glowRef}
        className="fixed w-32 h-32 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 rounded-full pointer-events-none z-30 blur-3xl will-change-transform"
        style={{ transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
      />

      {/* Optimized Background Blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Purple Blob */}
        <div 
          ref={blob1Ref}
          className="absolute w-[500px] h-[500px] bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob will-change-transform"
          style={{ 
            left: '10%',
            top: '10%',
            transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
        />
        
        {/* Blue Blob */}
        <div 
          ref={blob2Ref}
          className="absolute w-[450px] h-[450px] bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob will-change-transform"
          style={{ 
            right: '10%',
            top: '10%',
            transition: 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            animationDelay: '2s'
          }}
        />
        
        {/* Pink Blob */}
        <div 
          ref={blob3Ref}
          className="absolute w-[420px] h-[420px] bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob will-change-transform"
          style={{ 
            left: '30%',
            bottom: '10%',
            transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            animationDelay: '4s'
          }}
        />
      </div>

      {/* Enhanced Header with Dark Mode & Language Toggle */}
      <Header />

      {/* Hero Section - Mobile Optimized */}
      <section className="relative pt-24 sm:pt-32 md:pt-36 pb-8 sm:pb-12 px-3 sm:px-4 min-h-screen flex items-center">
        {/* Floating Decorative Elements */}
        <div className="absolute top-40 left-10 animate-float hidden lg:block" style={{ animationDelay: '0s' }}>
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-2xl transform rotate-12 opacity-80" />
        </div>
        <div className="absolute top-60 right-20 animate-float hidden lg:block" style={{ animationDelay: '1s' }}>
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full shadow-2xl opacity-80" />
        </div>
        <div className="absolute bottom-40 right-40 animate-float hidden lg:block" style={{ animationDelay: '2s' }}>
          <Star className="w-10 h-10 text-yellow-500 opacity-60 drop-shadow-lg" />
        </div>

        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center max-w-4xl mx-auto">
            {/* Floating Badge - Mobile Optimized */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 glass rounded-full border border-blue-200/50 dark:border-blue-800/50 mb-6 sm:mb-8 animate-fade-in-up shadow-lg text-xs sm:text-sm">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 animate-pulse" />
              <span className="font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('hero.badge')} ✨
              </span>
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 dark:text-green-400" />
            </div>

            {/* Main Heading - Mobile Optimized */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight px-2">
              <span className="text-foreground animate-fade-in-up block" style={{ animationDelay: '0.1s' }}>
                {t('hero.title1')}
              </span>
              <span 
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient animate-fade-in-up block"
                style={{ animationDelay: '0.2s' }}
              >
                {t('hero.title2')}
              </span>
            </h1>
            
            {/* Description - Mobile Optimized */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 sm:mb-10 md:mb-12 leading-relaxed max-w-3xl mx-auto animate-fade-in-up px-2" style={{ animationDelay: '0.3s' }}>
              {t('hero.description')}
              <span className="font-semibold text-foreground"> {t('hero.description2')}</span>
            </p>
            
            {/* CTA Buttons - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 animate-fade-in-up px-2" style={{ animationDelay: '0.4s' }}>
              <Link
                href="/auth/signup"
                className="group relative inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground rounded-xl text-sm sm:text-base font-medium overflow-hidden transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {t('hero.cta.start')}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>
              
              <Link
                href="#features"
                className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 glass border-2 border-border text-foreground rounded-xl text-sm sm:text-base font-medium hover:border-primary transition-all transform hover:-translate-y-1"
              >
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 group-hover:text-yellow-500 transition-colors" />
                {t('hero.cta.features')}
              </Link>
            </div>
          </div>
        </div>

        {/* Wave Divider - Animated Ocean Effect */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none">
          <svg 
            className="relative block w-full h-20 sm:h-24 md:h-32" 
            viewBox="0 0 1440 120" 
            preserveAspectRatio="none"
            style={{ width: '100%', minWidth: '100%' }}
          >
            {/* Animated Wave 1 - Slow */}
            <path 
              d="M0,20 C240,60 480,10 720,30 C960,50 1200,5 1440,25 L1440,120 L0,120 Z" 
              className="fill-blue-200/30 dark:fill-blue-900/20 animate-wave-slow"
            />
            {/* Animated Wave 2 - Medium */}
            <path 
              d="M0,40 C240,15 480,55 720,35 C960,15 1200,60 1440,40 L1440,120 L0,120 Z" 
              className="fill-purple-200/30 dark:fill-purple-900/20 animate-wave-medium"
              opacity="0.7"
            />
            {/* Animated Wave 3 - Fast */}
            <path 
              d="M0,60 C240,35 480,70 720,50 C960,30 1200,75 1440,55 L1440,120 L0,120 Z" 
              className="fill-background animate-wave-fast"
            />
          </svg>
        </div>
      </section>

      {/* Features Section - Mobile Optimized */}
      <section 
        id="features" 
        className="py-12 sm:py-16 md:py-20 relative bg-background"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4 animate-fade-in shadow-sm">
              ✨ {t('features.badge')}
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 animate-fade-in px-2">
              {t('features.title')} <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{t('features.title.brand')}</span>?
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in px-2">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                icon: Zap,
                title: t('features.fast.title'),
                description: t('features.fast.desc'),
                badge: t('features.fast.badge'),
                badgeColor: 'bg-green-500',
                iconBg: 'from-blue-500/10 to-cyan-500/10',
                iconColor: 'text-blue-600 dark:text-blue-400',
                delay: '0s',
              },
              {
                icon: CheckCircle2,
                title: t('features.ats.title'),
                description: t('features.ats.desc'),
                badge: t('features.ats.badge'),
                badgeColor: 'bg-blue-500',
                iconBg: 'from-purple-500/10 to-pink-500/10',
                iconColor: 'text-purple-600 dark:text-purple-400',
                delay: '0.1s',
              },
              {
                icon: Download,
                title: t('features.pdf.title'),
                description: t('features.pdf.desc'),
                badge: t('features.pdf.badge'),
                badgeColor: 'bg-purple-500',
                iconBg: 'from-green-500/10 to-emerald-500/10',
                iconColor: 'text-green-600 dark:text-green-400',
                delay: '0.2s',
              },
              {
                icon: Sparkles,
                title: t('features.ai.title'),
                description: t('features.ai.desc'),
                badge: t('features.ai.badge'),
                badgeColor: 'bg-orange-500',
                iconBg: 'from-orange-500/10 to-yellow-500/10',
                iconColor: 'text-orange-600 dark:text-orange-400',
                delay: '0.3s',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white dark:bg-gray-900/50 p-6 rounded-2xl border border-border/50 hover:border-border transition-all duration-300 hover:-translate-y-1 animate-fade-in-up backdrop-blur-sm"
                style={{ animationDelay: feature.delay }}
              >
                {/* Badge */}
                <div className={`absolute top-4 right-4 ${feature.badgeColor} text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg`}>
                  {feature.badge}
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-7 h-7 ${feature.iconColor}`} strokeWidth={2} />
                </div>
                
                {/* Title */}
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                
                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Mobile Optimized */}
      <section className="relative py-12 sm:py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black dark:from-gray-950 dark:via-gray-900 dark:to-black" />
        
        <div className="relative max-w-4xl mx-auto text-center px-3 sm:px-4 z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 animate-fade-in-up px-2">
            {t('cta.title1')}
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mt-1 sm:mt-2">
              {t('cta.title2')}
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 animate-fade-in-up px-2" style={{ animationDelay: '0.1s' }}>
            {t('cta.description')}
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-900 rounded-xl text-sm sm:text-base font-semibold hover:bg-gray-100 transition-all shadow-2xl transform hover:-translate-y-1 animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            {t('cta.button')}
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>

        <div className="absolute top-20 left-10 sm:left-20 w-24 h-24 sm:w-32 sm:h-32 bg-blue-500 rounded-full filter blur-3xl opacity-30 animate-float" />
        <div className="absolute bottom-20 right-10 sm:right-20 w-32 h-32 sm:w-40 sm:h-40 bg-purple-500 rounded-full filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '1s' }} />
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-8 dark:bg-background">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                CvMaker
              </span>
              <span className="text-xs font-medium text-muted-foreground -mt-1">
                .Aliee
              </span>
            </div>
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm">
            &copy; 2025 CvMaker.Aliee. {t('footer.rights')}
          </p>
        </div>
      </footer>
    </div>
  );
}
