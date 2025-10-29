/**
 * Template Selection Component
 * 
 * Allows users to choose from 5 ATS-friendly CV templates
 * 
 * @module components/cv-templates/TemplateSelector
 */

'use client';

import React, { useState } from 'react';
import { CheckCircle2, FileText, Eye } from 'lucide-react';
import { ModernTemplate, ClassicTemplate, CreativeTemplate, ProfessionalTemplate, MinimalTemplate } from '@/components/cv-templates';
import type { CVData } from '@/types/cv-builder';

interface TemplateSelectorProps {
  selectedTemplate: 'modern' | 'classic' | 'creative' | 'professional' | 'minimal';
  onSelectTemplate: (template: 'modern' | 'classic' | 'creative' | 'professional' | 'minimal') => void;
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
  summary: {
    text: '8+ yıllık deneyime sahip, full-stack yazılım geliştirici. React, Node.js ve cloud teknolojilerinde uzman. Agile metodolojileri kullanarak yüksek performanslı web uygulamaları geliştirme konusunda kanıtlanmış başarı kaydı. Takım liderliği ve mentorluk deneyimi.',
  },
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
      degree: 'Yüksek Lisans',
      field: 'Bilgisayar Mühendisliği',
      location: 'İstanbul, Türkiye',
      startDate: '09/2015',
      endDate: '06/2017',
      current: false,
      gpa: '3.8/4.0',
      description: 'Tez: Makine Öğrenmesi Algoritmalarının Web Uygulamalarında Kullanımı',
    },
    {
      id: '2',
      school: 'Boğaziçi Üniversitesi',
      degree: 'Lisans',
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
    { id: '3', name: 'Almanca', level: 'conversational' },
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
  template: 'modern',
};

const templates = [
  {
    id: 'modern' as const,
    name: 'Modern',
    description: 'İki sütun düzenli, temiz ve çağdaş tasarım',
    color: 'from-blue-500 to-blue-600',
    borderColor: 'border-blue-500',
    features: ['İki sütun düzen', 'Renk vurguları', 'İkon destekli', 'ATS uyumlu'],
    preview: '📄 Modern, profesyonel görünüm',
  },
  {
    id: 'classic' as const,
    name: 'Classic',
    description: 'Geleneksel ve profesyonel tek sütun düzeni',
    color: 'from-gray-600 to-gray-700',
    borderColor: 'border-gray-600',
    features: ['Tek sütun', 'Sade tasarım', 'Kolay okunur', 'Evrensel'],
    preview: '📋 Klasik, güvenilir tasarım',
  },
  {
    id: 'creative' as const,
    name: 'Creative',
    description: 'Yaratıcı pozisyonlar için özgün tasarım',
    color: 'from-purple-500 to-purple-600',
    borderColor: 'border-purple-500',
    features: ['Yan panel', 'Grafik elemanlar', 'Dikkat çekici', 'Renkli'],
    preview: '🎨 Yaratıcı, farklı görünüm',
  },
  {
    id: 'professional' as const,
    name: 'Professional',
    description: 'Kurumsal pozisyonlar için ciddi tasarım',
    color: 'from-green-500 to-green-600',
    borderColor: 'border-green-500',
    features: ['Klasik düzen', 'Net bölümler', 'ATS optimize', 'Kurumsal'],
    preview: '💼 Kurumsal, güçlü görünüm',
  },
  {
    id: 'minimal' as const,
    name: 'Minimal',
    description: 'Sade ve şık minimalist tasarım',
    color: 'from-orange-500 to-orange-600',
    borderColor: 'border-orange-500',
    features: ['Minimalist', 'Bol beyaz alan', 'Okunabilir', 'Zarif'],
    preview: '✨ Minimal, zarif görünüm',
  },
];

export function TemplateSelector({ selectedTemplate, onSelectTemplate }: TemplateSelectorProps) {
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-foreground mb-2">
          CV Şablonu Seçin
        </h3>
        <p className="text-muted-foreground text-sm">
          5 farklı ATS uyumlu profesyonel şablon arasından size en uygun olanı seçin.
          Tüm şablonlar başvuru takip sistemleri tarafından kolayca okunabilir.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => {
          const isSelected = selectedTemplate === template.id;
          
          return (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template.id)}
              className={`
                relative p-6 rounded-xl border-2 transition-all duration-300 text-left
                ${isSelected 
                  ? `${template.borderColor} shadow-lg scale-105` 
                  : 'border-border hover:border-primary/50 hover:shadow-md'
                }
              `}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                </div>
              )}

              {/* Template Preview */}
              <div className={`h-32 bg-linear-to-br ${template.color} rounded-lg p-4 flex items-center justify-center relative overflow-hidden mb-4`}>
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <FileText className="w-12 h-12 text-white/40 absolute" />
                <div className="relative text-center">
                  <h4 className="text-white font-bold text-lg mb-1">{template.name}</h4>
                  <p className="text-white/90 text-xs">{template.preview}</p>
                </div>
              </div>

              {/* Template Info */}
              <div>
                <h4 className="font-bold text-foreground mb-2">{template.name}</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  {template.description}
                </p>

                {/* Features */}
                <ul className="space-y-1 mb-4">
                  {template.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Preview Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewTemplate(template.id);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 text-foreground rounded-lg text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <Eye className="w-3 h-3" />
                  <span>Örnek CV Görüntüle</span>
                </button>
              </div>
            </button>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          ATS Uyumluluk Nedir?
        </h4>
        <p className="text-sm text-blue-800 dark:text-blue-200">
          ATS (Applicant Tracking System - Başvuru Takip Sistemi), şirketlerin CV&apos;leri otomatik olarak 
          taramasına olanak tanır. Tüm şablonlarımız bu sistemler tarafından kolayca okunabilecek 
          şekilde tasarlanmıştır, böylece başvurunuzun insan kaynakları departmanına ulaşma şansı artar.
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
                  {templates.find(t => t.id === previewTemplate)?.name} Şablonu - Örnek CV
                </h3>
                <p className="text-sm text-muted-foreground">
                  Bu şablon ile CV&apos;niz nasıl görünecek
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    onSelectTemplate(previewTemplate as 'modern' | 'classic' | 'creative' | 'professional' | 'minimal');
                    setPreviewTemplate(null);
                  }}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Bu Şablonu Seç
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
            <div className="overflow-auto p-8 bg-gray-100 dark:bg-gray-800">
              <div className="transform scale-75 origin-top mx-auto">
                {previewTemplate === 'modern' && <ModernTemplate data={sampleCVData} />}
                {previewTemplate === 'classic' && <ClassicTemplate data={sampleCVData} />}
                {previewTemplate === 'creative' && <CreativeTemplate data={sampleCVData} />}
                {previewTemplate === 'professional' && <ProfessionalTemplate data={sampleCVData} />}
                {previewTemplate === 'minimal' && <MinimalTemplate data={sampleCVData} />}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
