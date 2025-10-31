'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { FileText, ExternalLink, MessageCircleQuestion } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AboutPage() {
  const { t } = useLanguage();

  // Refs for direct DOM manipulation (much faster than React state)
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const blob3Ref = useRef<HTMLDivElement>(null);

  // Small effect to move cursor/trail/glow with the mouse
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
          // setMousePosition({ x, y });
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
        className="fixed w-4 h-4 bg-linear-to-r from-purple-400 to-pink-400 rounded-full pointer-events-none z-40 opacity-60 blur-sm will-change-transform"
        style={{ transition: 'transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
      />

      {/* Glow Effect */}
      <div 
        ref={glowRef}
        className="fixed w-32 h-32 bg-linear-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 rounded-full pointer-events-none z-30 blur-3xl will-change-transform"
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
      <div className="absolute -top-32 -left-32 w-[300px] h-[300px] bg-blue-400/10 rounded-full blur-3xl animate-blob z-0" style={{ animationDelay: '0s' }} />
      <div className="absolute top-1/2 right-0 w-[250px] h-[250px] bg-purple-400/10 rounded-full blur-3xl animate-blob z-0" style={{ animationDelay: '3s' }} />
      <Header />

      <main className="flex-1 flex flex-col items-center px-4 py-24 animate-fade-in-up relative z-10">
        {/* Floating Decorative Elements */}
        <div className="absolute top-32 left-16 animate-float hidden lg:block opacity-30" style={{ animationDelay: '0s' }}>
          <div className="w-3 h-3 bg-primary/40 rounded-full" />
        </div>
        <div className="absolute top-48 right-24 animate-float hidden lg:block opacity-20" style={{ animationDelay: '2s' }}>
          <div className="w-2 h-2 bg-blue-400/30 rounded-full" />
        </div>
        <div className="absolute bottom-32 left-12 animate-float hidden lg:block opacity-25" style={{ animationDelay: '4s' }}>
          <div className="w-4 h-4 bg-purple-400/20 rounded-full" />
        </div>
        <div className="absolute top-1/4 right-12 animate-float hidden lg:block opacity-35" style={{ animationDelay: '1s' }}>
          <div className="w-2.5 h-2.5 bg-pink-400/25 rounded-full" />
        </div>
        <div className="absolute bottom-1/4 right-32 animate-float hidden lg:block opacity-28" style={{ animationDelay: '3s' }}>
          <div className="w-3.5 h-3.5 bg-green-400/22 rounded-full" />
        </div>
        <div className="absolute top-3/4 left-24 animate-float hidden lg:block opacity-32" style={{ animationDelay: '5s' }}>
          <div className="w-2 h-2 bg-orange-400/28 rounded-full" />
        </div>

        <div className="max-w-4xl w-full space-y-8">

          {/* Hero Section */}
          <div className="text-center animate-fade-in-up group">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-linear-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent animate-gradient group-hover:from-blue-500 group-hover:via-purple-500 group-hover:to-pink-500 transition-all duration-500">
              {t('about.page.hero.title')}
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto group-hover:text-foreground transition-colors duration-300">
              {t('about.page.hero.description')}
            </p>
          </div>

          {/* Proje Neden Yaptığım */}
          <div className="bg-white/60 dark:bg-gray-900/60 rounded-2xl p-6 sm:p-8 backdrop-blur-sm border border-border/40 hover:border-red-400/40 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20">
                <MessageCircleQuestion className="w-6 h-6 text-red-500" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-primary">{t('about.page.why.title')}</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {t('about.page.why.description')}
            </p>
          </div>

          {/* ATS Format Nedir */}
          <div className="bg-white/60 dark:bg-gray-900/60 rounded-2xl p-6 sm:p-8 backdrop-blur-sm border border-border/40 hover:border-blue-400/40 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-primary">{t('about.page.ats.title')}</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('about.page.ats.description')}
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">✅ {t('about.page.ats.correct')}</h3>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                  <li>• {t('about.page.ats.correctItems.0')}</li>
                  <li>• {t('about.page.ats.correctItems.1')}</li>
                  <li>• {t('about.page.ats.correctItems.2')}</li>
                </ul>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">❌ {t('about.page.ats.wrong')}</h3>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                  <li>• {t('about.page.ats.wrongItems.0')}</li>
                  <li>• {t('about.page.ats.wrongItems.1')}</li>
                  <li>• {t('about.page.ats.wrongItems.2')}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Hakkımda */}
          <div className="bg-white/60 dark:bg-gray-900/60 rounded-2xl p-6 sm:p-8 backdrop-blur-sm border border-border/40 hover:border-purple-400/40 transition-all duration-300 hover:shadow-lg">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="shrink-0">
                <div className="w-24 h-24 rounded-full bg-black p-2 shadow-lg">
                  <Image
                    src="/alieelogo.png"
                    alt="Aliee Logo"
                    width={80}
                    height={80}
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold mb-3 text-primary">{t('about.page.aboutMe.title')}</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {t('about.page.aboutMe.description')}
                </p>
                <Link href="https://alieedev.vercel.app/" target="_blank" rel="noopener noreferrer">
                  <button className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl">
                    {t('about.page.aboutMe.visitWebsite')}
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Footer Message */}
          <div className="text-center mt-12">
            <div className="max-w-md mx-auto">
              <p className="text-muted-foreground text-lg leading-relaxed mb-2">
                {t('about.page.footer.message')}
              </p>
              <p className="text-sm text-muted-foreground/70 font-medium">
                {t('about.page.footer.signature')}
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}