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

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Download, CheckCircle2, Sparkles, Star, TrendingUp, BookOpen, Palette, Briefcase, Circle } from 'lucide-react';
import { Header } from '@/components/Header';
import { ModernTemplate, ClassicTemplate, CreativeTemplate, ProfessionalTemplate, MinimalTemplate } from '@/components/cv-templates';
import type { CVData } from '@/types/cv-builder';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  const [selectedTemplatePreview, setSelectedTemplatePreview] = useState<string | null>(null);
  
  // Refs for direct DOM manipulation (much faster than React state)
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const blob3Ref = useRef<HTMLDivElement>(null);
  const templatesScrollRef = useRef<HTMLDivElement>(null);

  // Define templates with translations - memoized to update when language changes
  const templates = useMemo(() => [
    {
      id: 'modern' as const,
      name: 'Modern',
      description: t('template.modern.description'),
      color: 'from-blue-500 to-blue-600',
      borderColor: 'border-blue-500',
      icon: Zap,
      features: [
        t('template.modern.features.1'),
        t('template.modern.features.2'),
        t('template.modern.features.3'),
        t('template.modern.features.4'),
      ],
      preview: t('template.modern.preview'),
    },
    {
      id: 'classic' as const,
      name: 'Classic',
      description: t('template.classic.description'),
      color: 'from-gray-600 to-gray-700',
      borderColor: 'border-gray-600',
      icon: BookOpen,
      features: [
        t('template.classic.features.1'),
        t('template.classic.features.2'),
        t('template.classic.features.3'),
        t('template.classic.features.4'),
      ],
      preview: t('template.classic.preview'),
    },
    {
      id: 'creative' as const,
      name: 'Creative',
      description: t('template.creative.description'),
      color: 'from-purple-500 to-purple-600',
      borderColor: 'border-purple-500',
      icon: Palette,
      features: [
        t('template.creative.features.1'),
        t('template.creative.features.2'),
        t('template.creative.features.3'),
        t('template.creative.features.4'),
      ],
      preview: t('template.creative.preview'),
    },
    {
      id: 'professional' as const,
      name: 'Professional',
      description: t('template.professional.description'),
      color: 'from-green-500 to-green-600',
      borderColor: 'border-green-500',
      icon: Briefcase,
      features: [
        t('template.professional.features.1'),
        t('template.professional.features.2'),
        t('template.professional.features.3'),
        t('template.professional.features.4'),
      ],
      preview: t('template.professional.preview'),
    },
    {
      id: 'minimal' as const,
      name: 'Minimal',
      description: t('template.minimal.description'),
      color: 'from-orange-500 to-orange-600',
      borderColor: 'border-orange-500',
      icon: Circle,
      features: [
        t('template.minimal.features.1'),
        t('template.minimal.features.2'),
        t('template.minimal.features.3'),
        t('template.minimal.features.4'),
      ],
      preview: t('template.minimal.preview'),
    },
  ], [t]);

/**
 * Sample CV Data for Preview
 */
const sampleCVData: CVData = {
  personalInfo: {
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    email: 'ahmet.yilmaz@email.com',
    phone: '+90 555 123 45 67',
    address: 'Kadıköy Mahallesi, No: 123',
    city: 'İstanbul',
    country: 'Türkiye',
    postalCode: '34000',
    title: 'Senior Yazılım Geliştirici',
    linkedIn: 'linkedin.com/in/ahmetyilmaz',
    website: 'www.ahmetyilmaz.com',
  },
  summary: '8+ yıllık deneyime sahip, full-stack yazılım geliştirici. React, Node.js ve cloud teknolojilerinde uzman. Agile metodolojileri kullanarak yüksek performanslı web uygulamaları geliştirme konusunda kanıtlanmış başarı kaydı. Takım liderliği ve mentorluk deneyimi.',
  experience: [
    {
      id: '1',
      company: 'Tech Solutions A.Ş.',
      position: 'Senior Full Stack Developer',
      location: 'İstanbul, Türkiye',
      startDate: '01/2020',
      endDate: '',
      current: true,
      description: 'React ve Node.js kullanarak enterprise düzey web uygulamaları geliştirme\nAWS üzerinde mikroservis mimarisi tasarlama ve implementasyonu\n5 kişilik geliştirici ekibine teknik liderlik yapma\nCI/CD pipeline kurulumu ve DevOps süreçlerini optimize etme',
    },
    {
      id: '2',
      company: 'Digital Agency Ltd.',
      position: 'Full Stack Developer',
      location: 'İstanbul, Türkiye',
      startDate: '06/2017',
      endDate: '12/2019',
      current: false,
      description: 'E-ticaret platformları için frontend ve backend geliştirme\nRESTful API tasarımı ve implementasyonu\nPostgreSQL ve MongoDB veritabanı yönetimi\nCode review ve pair programming süreçlerine aktif katılım',
    },
  ],
  education: [
    {
      id: '1',
      school: 'İstanbul Teknik Üniversitesi',
      degree: 'master',
      field: 'Bilgisayar Mühendisliği',
      location: 'İstanbul, Türkiye',
      startDate: '09/2015',
      endDate: '06/2017',
      current: false,
      gpa: '3.8/4.0',
    },
    {
      id: '2',
      school: 'Boğaziçi Üniversitesi',
      degree: 'bachelor',
      field: 'Bilgisayar Mühendisliği',
      location: 'İstanbul, Türkiye',
      startDate: '09/2011',
      endDate: '06/2015',
      current: false,
      gpa: '3.6/4.0',
    },
  ],
  skills: [
    { id: '1', name: 'JavaScript / TypeScript', level: 'expert' },
    { id: '2', name: 'React.js / Next.js', level: 'expert' },
    { id: '3', name: 'Node.js / Express', level: 'advanced' },
    { id: '4', name: 'Python / Django', level: 'advanced' },
    { id: '5', name: 'AWS / Cloud Services', level: 'advanced' },
    { id: '6', name: 'MongoDB / PostgreSQL', level: 'advanced' },
    { id: '7', name: 'Docker / Kubernetes', level: 'intermediate' },
    { id: '8', name: 'Git / CI/CD', level: 'expert' },
  ],
  languages: [
    { id: '1', name: 'Türkçe', level: 'native' },
    { id: '2', name: 'İngilizce', level: 'fluent' },
    { id: '3', name: 'Almanca', level: 'intermediate' },
  ],
  certificates: [
    {
      id: '1',
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: '2023',
    },
    {
      id: '2',
      name: 'Professional Scrum Master I',
      issuer: 'Scrum.org',
      date: '2022',
    },
    {
      id: '3',
      name: 'React Developer Certification',
      issuer: 'Meta',
      date: '2021',
    },
  ],
  projects: [
    {
      id: '1',
      title: 'E-Ticaret Platformu',
      description: 'Next.js ve Node.js kullanarak geliştirilen full-stack e-ticaret platformu. Stripe entegrasyonu, gerçek zamanlı envanter yönetimi ve kullanıcı analytics özellikleri içeriyor.',
      link: 'https://github.com/ahmetyilmaz/ecommerce-platform',
      technologies: ['Next.js', 'Node.js', 'MongoDB', 'Stripe', 'Redis'],
    },
    {
      id: '2',
      title: 'Real-Time Chat Uygulaması',
      description: 'WebSocket kullanarak geliştirilen gerçek zamanlı mesajlaşma uygulaması. Grup sohbetleri, dosya paylaşımı ve end-to-end şifreleme desteği.',
      link: 'https://github.com/ahmetyilmaz/chat-app',
      technologies: ['React', 'Socket.io', 'Express', 'PostgreSQL'],
    },
    {
      id: '3',
      title: 'Task Management Dashboard',
      description: 'Takım işbirliği için geliştirilmiş proje yönetim aracı. Drag-and-drop kanban board, zaman takibi ve raporlama özellikleri.',
      link: 'https://github.com/ahmetyilmaz/task-manager',
      technologies: ['React', 'TypeScript', 'Firebase', 'Tailwind CSS'],
    },
  ],
  template: 'modern',
};

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
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Mouse wheel horizontal scroll for templates
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (templatesScrollRef.current && templatesScrollRef.current.contains(e.target as Node)) {
        e.preventDefault();
        templatesScrollRef.current.scrollLeft += e.deltaY;
      }
    };

    const scrollElement = templatesScrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('wheel', handleWheel);
      }
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

      {/* Enhanced Animated Gradient Blobs - Ultra Smooth */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Indigo Blob - Top Left - Slowest pulse */}
        <div 
          ref={blob1Ref}
          className="absolute w-[700px] h-[700px] bg-indigo-400/30 dark:bg-indigo-500/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-pulse will-change-transform"
          style={{ 
            left: '5%',
            top: '5%',
            transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            animationDuration: '10s'
          }}
        />
        
        {/* Purple Blob - Top Right - Medium pulse */}
        <div 
          ref={blob2Ref}
          className="absolute w-[650px] h-[650px] bg-purple-400/30 dark:bg-purple-500/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-pulse will-change-transform"
          style={{ 
            right: '5%',
            top: '10%',
            transition: 'transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            animationDelay: '3s',
            animationDuration: '12s'
          }}
        />
        
        {/* Pink Blob - Bottom Center - Fastest pulse */}
        <div 
          ref={blob3Ref}
          className="absolute w-[600px] h-[600px] bg-pink-400/30 dark:bg-pink-500/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-pulse will-change-transform"
          style={{ 
            left: '35%',
            bottom: '5%',
            transition: 'transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            animationDelay: '6s',
            animationDuration: '14s'
          }}
        />
        
        {/* Additional Ambient Blobs - No mouse tracking, pure animation */}
        {/* Small Blue Accent - Top Center */}
        <div 
          className="absolute w-[400px] h-[400px] bg-blue-300/20 dark:bg-blue-400/15 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-pulse"
          style={{ 
            left: '50%',
            top: '15%',
            transform: 'translateX(-50%)',
            animationDelay: '1s',
            animationDuration: '8s'
          }}
        />
        
        {/* Small Rose Accent - Bottom Right */}
        <div 
          className="absolute w-[350px] h-[350px] bg-rose-300/20 dark:bg-rose-400/15 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-pulse"
          style={{ 
            right: '15%',
            bottom: '20%',
            animationDelay: '4s',
            animationDuration: '11s'
          }}
        />
        
        {/* Small Violet Accent - Left Center */}
        <div 
          className="absolute w-[380px] h-[380px] bg-violet-300/20 dark:bg-violet-400/15 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-pulse"
          style={{ 
            left: '20%',
            top: '50%',
            transform: 'translateY(-50%)',
            animationDelay: '2s',
            animationDuration: '9s'
          }}
        />
      </div>

      {/* Enhanced Header with Dark Mode & Language Toggle */}
      <Header />

      {/* Hero Section - Mobile Optimized */}
      <section className="relative pt-24 sm:pt-32 md:pt-36 pb-8 sm:pb-12 px-3 sm:px-4 min-h-screen flex items-center">
        {/* Floating Decorative Elements */}
        <div className="absolute top-40 left-10 animate-float hidden lg:block" style={{ animationDelay: '0s' }}>
          <div className="w-16 h-16 bg-linear-to-br from-blue-400 to-blue-600 rounded-2xl shadow-2xl transform rotate-12 opacity-80" />
        </div>
        <div className="absolute top-60 right-20 animate-float hidden lg:block" style={{ animationDelay: '1s' }}>
          <div className="w-12 h-12 bg-linear-to-br from-purple-400 to-pink-600 rounded-full shadow-2xl opacity-80" />
        </div>
        <div className="absolute bottom-40 right-40 animate-float hidden lg:block" style={{ animationDelay: '2s' }}>
          <Star className="w-10 h-10 text-yellow-500 opacity-60 drop-shadow-lg" />
        </div>

        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center max-w-4xl mx-auto">
            {/* Floating Badge - Mobile Optimized */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 glass rounded-full border border-blue-200/50 dark:border-blue-800/50 mb-6 sm:mb-8 animate-fade-in-up shadow-lg text-xs sm:text-sm">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 animate-pulse" />
              <span className="font-medium bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
                className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient animate-fade-in-up block"
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
                <div className="absolute inset-0 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
            <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-linear-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4 animate-fade-in shadow-sm">
              ✨ {t('features.badge')}
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 animate-fade-in px-2">
              {t('features.title')} <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{t('features.title.brand')}</span>?
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
                <div className={`w-14 h-14 bg-linear-to-br ${feature.iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
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
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section 
        id="templates" 
        className="py-12 sm:py-16 md:py-20 relative bg-muted/30"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-linear-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4 animate-fade-in shadow-sm">
              🎨 {t('templateSelector.title')}
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 animate-fade-in px-2">
              {t('templateSelector.subtitle')}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto animate-fade-in px-2 mb-8">
              {t('atsInfo.description')}
            </p>
          </div>

          <div 
            ref={templatesScrollRef}
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 cursor-grab active:cursor-grabbing"
          >
            {templates.map((template, index) => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplatePreview(template.id)}
                className="group relative p-6 rounded-xl border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-left shrink-0 w-80 animate-fade-in-up cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Template Preview - CV Thumbnail */}
                <div className="relative mb-4 group overflow-hidden rounded-lg">
                  {/* CV Thumbnail Container */}
                  <div className="h-40 bg-white dark:bg-gray-900 rounded-lg border border-border overflow-hidden shadow-sm group-hover:shadow-lg transition-all duration-500">
                    {/* Actual CV Template Preview */}
                    <div className="transform scale-[0.25] origin-top-left w-[400%] h-[400%] group-hover:scale-[0.28] transition-transform duration-500 ease-out">
                      {template.id === 'modern' && <ModernTemplate data={sampleCVData} />}
                      {template.id === 'classic' && <ClassicTemplate data={sampleCVData} />}
                      {template.id === 'creative' && <CreativeTemplate data={sampleCVData} />}
                      {template.id === 'professional' && <ProfessionalTemplate data={sampleCVData} />}
                      {template.id === 'minimal' && <MinimalTemplate data={sampleCVData} />}
                    </div>
                    
                    {/* Click to enlarge overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                      <span className="text-xs font-medium text-primary flex items-center gap-1.5 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                        {t('templates.clickToEnlarge') || 'Click to enlarge'}
                      </span>
                    </div>
                    
                    {/* Template Name Badge - Top Right */}
                    <div className="absolute top-2 right-2">
                      <div className="bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
                        <span className="text-white font-bold text-xs">{template.name}</span>
                      </div>
                    </div>
                    
                    {/* Icon Badge - Bottom Left */}
                    <div className="absolute bottom-2 left-2">
                      <div className="w-8 h-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-300">
                        <template.icon className={`w-4 h-4 ${template.borderColor.replace('border-', 'text-').replace('-500', '-700')} dark:${template.borderColor.replace('border-', 'text-').replace('-500', '-300')}`} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Template Info - Minimal */}
                <div className="space-y-3">
                  {/* Features - Compact */}
                  <div className="flex flex-wrap gap-1">
                    {template.features.slice(0, 3).map((feature, idx) => (
                      <span key={idx} className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${template.borderColor.replace('border-', 'bg-').replace('-500', '-100')} ${template.borderColor.replace('border-', 'text-').replace('-500', '-700')} dark:${template.borderColor.replace('border-', 'text-').replace('-500', '-300')}`}>
                        <div className={`w-1 h-1 rounded-full ${template.borderColor.replace('border-', 'bg-')}`}></div>
                        <span>{feature}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ATS Info Card */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-6 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
              <div className="text-center">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {t('atsInfo.title')}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {t('atsInfo.description')}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                    {t('atsInfo.badge1')}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                    {t('atsInfo.badge2')}
                  </span>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                    {t('atsInfo.badge3')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Mobile Optimized */}
      <section className="relative py-12 sm:py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-gray-900 via-gray-800 to-black dark:from-gray-950 dark:via-gray-900 dark:to-black" />
        
        <div className="relative max-w-4xl mx-auto text-center px-3 sm:px-4 z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 animate-fade-in-up px-2">
            {t('cta.title1')}
            <span className="block bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mt-1 sm:mt-2">
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
              <span className="text-xl font-bold bg-linear-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
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

      {/* Template Preview Modal */}
      {selectedTemplatePreview && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setSelectedTemplatePreview(null)}
        >
          <div 
            className="relative bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedTemplatePreview(null)}
              className="sticky top-4 right-4 float-right z-10 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
              aria-label="Close preview"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Full CV Preview */}
            <div className="p-8">
              <div className="transform scale-90 origin-top">
                {selectedTemplatePreview === 'modern' && <ModernTemplate data={sampleCVData} />}
                {selectedTemplatePreview === 'classic' && <ClassicTemplate data={sampleCVData} />}
                {selectedTemplatePreview === 'creative' && <CreativeTemplate data={sampleCVData} />}
                {selectedTemplatePreview === 'professional' && <ProfessionalTemplate data={sampleCVData} />}
                {selectedTemplatePreview === 'minimal' && <MinimalTemplate data={sampleCVData} />}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
