/**
 * Template Selection Component
 * 
 * Allows users to choose from 5 ATS-friendly CV templates
 * 
 * @module components/cv-templates/TemplateSelector
 */

'use client';

import React, { useState } from 'react';
import { CheckCircle2, Eye, Zap, BookOpen, Palette, Briefcase, Circle, Crown, Code, Sparkles, Bold as BoldIcon } from 'lucide-react';
import { 
  ModernTemplate, 
  ClassicTemplate, 
  CreativeTemplate, 
  ProfessionalTemplate, 
  MinimalTemplate,
  ExecutiveTemplate,
  TechProTemplate,
  ElegantTemplate,
  BoldTemplate
} from '@/components/cv-templates';
import type { CVData } from '@/types/cv-builder';
import { useLanguage } from '@/contexts/LanguageContext';

interface TemplateSelectorProps {
  selectedTemplate: 'modern' | 'classic' | 'creative' | 'professional' | 'minimal' | 'executive' | 'techpro' | 'elegant' | 'bold';
  onSelectTemplate: (template: 'modern' | 'classic' | 'creative' | 'professional' | 'minimal' | 'executive' | 'techpro' | 'elegant' | 'bold') => void;
}

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
    { id: '1', name: 'JavaScript / TypeScript', level: 'expert', years: 8 },
    { id: '2', name: 'React.js / Next.js', level: 'expert', years: 6 },
    { id: '3', name: 'Node.js / Express', level: 'advanced', years: 7 },
    { id: '4', name: 'Python / Django', level: 'advanced', years: 5 },
    { id: '5', name: 'AWS / Cloud Services', level: 'advanced', years: 4 },
    { id: '6', name: 'MongoDB / PostgreSQL', level: 'advanced', years: 6 },
    { id: '7', name: 'Docker / Kubernetes', level: 'intermediate', years: 3 },
    { id: '8', name: 'Git / CI/CD', level: 'expert', years: 8 },
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

const templates = [
  {
    id: 'modern' as const,
    name: 'Modern',
    description: 'ATS-optimized modern design',
    color: 'from-gray-600 to-gray-700',
    borderColor: 'border-gray-600',
    icon: Zap,
    features: ['%90 ATS', 'İki sütun', 'Grid cols-3'],
    atsScore: 90,
  },
  {
    id: 'classic' as const,
    name: 'Classic',
    description: 'ATS-optimized classic layout',
    color: 'from-gray-600 to-gray-700',
    borderColor: 'border-gray-600',
    icon: BookOpen,
    features: ['%90 ATS', 'Center align', 'Grid cols-3'],
    atsScore: 90,
  },
  {
    id: 'creative' as const,
    name: 'Creative',
    description: 'ATS-optimized creative sidebar',
    color: 'from-gray-600 to-gray-700',
    borderColor: 'border-gray-600',
    icon: Palette,
    features: ['%90 ATS', '30% sidebar', 'Grid cols-3/5'],
    atsScore: 90,
  },
  {
    id: 'professional' as const,
    name: 'Professional',
    description: 'ATS-optimized professional design',
    color: 'from-gray-600 to-gray-700',
    borderColor: 'border-gray-600',
    icon: Briefcase,
    features: ['%90 ATS', 'Sidebar bars', 'Grid cols-3'],
    atsScore: 90,
  },
  {
    id: 'minimal' as const,
    name: 'Minimal',
    description: 'ATS-optimized minimalist design',
    color: 'from-gray-600 to-gray-700',
    borderColor: 'border-gray-600',
    icon: Circle,
    features: ['%95 ATS', 'Single col', 'Grid cols-3'],
    atsScore: 95,
  },
  {
    id: 'executive' as const,
    name: 'Executive',
    description: 'ATS-optimized executive layout',
    color: 'from-gray-600 to-gray-700',
    borderColor: 'border-gray-600',
    icon: Crown,
    features: ['%92 ATS', '3 columns', 'Grid cols-2/3'],
    atsScore: 92,
  },
  {
    id: 'techpro' as const,
    name: 'Tech Pro',
    description: 'ATS-optimized tech-focused design',
    color: 'from-gray-600 to-gray-700',
    borderColor: 'border-gray-600',
    icon: Code,
    features: ['%90 ATS', '3 columns', 'Sidebar'],
    atsScore: 90,
  },
  {
    id: 'elegant' as const,
    name: 'Elegant',
    description: 'ATS-optimized elegant design',
    color: 'from-gray-600 to-gray-700',
    borderColor: 'border-gray-600',
    icon: Sparkles,
    features: ['%92 ATS', 'Serif font', 'Grid cols-2/5'],
    atsScore: 92,
  },
  {
    id: 'bold' as const,
    name: 'Bold',
    description: 'ATS-optimized bold typography',
    color: 'from-gray-600 to-gray-700',
    borderColor: 'border-gray-600',
    icon: BoldIcon,
    features: ['%90 ATS', 'Bold fonts', 'Grid cols-3'],
    atsScore: 90,
  },
];

export function TemplateSelector({ selectedTemplate, onSelectTemplate }: TemplateSelectorProps) {
  const { t } = useLanguage();
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-foreground mb-2">
          {t('templateSelector.title')}
        </h3>
        <p className="text-muted-foreground text-sm">
          {t('templateSelector.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => {
          const isSelected = selectedTemplate === template.id;
          
          return (
            <div
              key={template.id}
              className={`
                relative p-6 rounded-xl border-2 transition-all duration-300 text-left
                hover:shadow-xl hover:-translate-y-1 group cursor-pointer
                ${isSelected 
                  ? `${template.borderColor} shadow-lg scale-105 bg-primary/5` 
                  : 'border-border hover:border-primary/50 hover:shadow-md'
                }
              `}
              onClick={() => onSelectTemplate(template.id)}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                </div>
              )}

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
                    {template.id === 'executive' && <ExecutiveTemplate data={sampleCVData} />}
                    {template.id === 'techpro' && <TechProTemplate data={sampleCVData} />}
                    {template.id === 'elegant' && <ElegantTemplate data={sampleCVData} />}
                    {template.id === 'bold' && <BoldTemplate data={sampleCVData} />}
                  </div>
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Template Name Badge - Top Right */}
                  <div className="absolute top-2 right-2">
                    <div className="bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
                      <span className="text-white font-bold text-xs">{template.name}</span>
                    </div>
                  </div>
                  
                  {/* Icon Badge - Bottom Left */}
                  <div className="absolute bottom-2 left-2">
                    <div className="w-8 h-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-300">
                      <template.icon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Template Info - Minimal */}
              <div className="space-y-3">
                {/* ATS Score Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {template.name}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                    <CheckCircle2 className="w-3 h-3" />
                    {template.atsScore}% ATS
                  </span>
                </div>

                {/* Features - Compact */}
                <div className="flex flex-wrap gap-1">
                  {template.features.map((feature, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                      <span>{feature}</span>
                    </span>
                  ))}
                </div>

                {/* Preview Button - Minimal */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewTemplate(template.id);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 text-foreground rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105"
                >
                  <Eye className="w-4 h-4" />
                  <span>{t('templateSelector.preview')}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {t('templateSelector.atsInfo.title')}
        </h4>
        <p className="text-sm text-green-800 dark:text-green-200">
          {t('templateSelector.atsInfo.description')}
        </p>
      </div>

      {/* Template Preview Modal */}
      {previewTemplate && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewTemplate(null)}
        >
          <div
            className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-border px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  {templates.find(t => t.id === previewTemplate)?.name} {t('templateSelector.modalTitle')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('templateSelector.modalSubtitle')}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    onSelectTemplate(previewTemplate as 'modern' | 'classic' | 'creative' | 'professional' | 'minimal' | 'executive' | 'techpro' | 'elegant' | 'bold');
                    setPreviewTemplate(null);
                  }}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  {t('templateSelector.selectTemplate')}
                </button>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-foreground hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content - CV Preview */}
            <div className="overflow-auto p-8 bg-gray-100 dark:bg-gray-800 max-h-[calc(90vh-80px)]">
              <div className="transform scale-75 origin-top mx-auto">
                {previewTemplate === 'modern' && <ModernTemplate data={sampleCVData} />}
                {previewTemplate === 'classic' && <ClassicTemplate data={sampleCVData} />}
                {previewTemplate === 'creative' && <CreativeTemplate data={sampleCVData} />}
                {previewTemplate === 'professional' && <ProfessionalTemplate data={sampleCVData} />}
                {previewTemplate === 'minimal' && <MinimalTemplate data={sampleCVData} />}
                {previewTemplate === 'executive' && <ExecutiveTemplate data={sampleCVData} />}
                {previewTemplate === 'techpro' && <TechProTemplate data={sampleCVData} />}
                {previewTemplate === 'elegant' && <ElegantTemplate data={sampleCVData} />}
                {previewTemplate === 'bold' && <BoldTemplate data={sampleCVData} />}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
