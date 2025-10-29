/**
 * CV Builder Client Component
 * 
 * Client-side CV builder with form state
 * 
 * @module app/cv/create/CVBuilderClient
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TemplateSelector } from '@/components/cv-templates/TemplateSelector';
import { ModernTemplate, ClassicTemplate, CreativeTemplate, ProfessionalTemplate, MinimalTemplate } from '@/components/cv-templates';
import type { CVData, FormStep } from '@/types/cv-builder';

interface CVBuilderClientProps {
  userName: string;
  userEmail?: string;
}

/**
 * Initial CV Data
 */
const initialCVData: CVData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    title: '',
    linkedIn: '',
    website: '',
  },
  summary: {
    text: '',
  },
  experience: [],
  education: [],
  skills: [],
  languages: [],
  certificates: [],
  template: 'modern',
};

/**
 * CV Builder Client Component
 */
export default function CVBuilderClient({ userName, userEmail }: CVBuilderClientProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<FormStep>('template');
  const [cvData, setCVData] = useState<CVData>(initialCVData);

  /**
   * Step configuration
   */
  const steps: FormStep[] = [
    'template',
    'personal',
    'summary',
    'experience',
    'education',
    'skills',
    'preview',
  ];

  const stepTitles: Record<FormStep, string> = {
    personal: 'Kişisel Bilgiler',
    summary: 'Özet',
    experience: 'İş Deneyimi',
    education: 'Eğitim',
    skills: 'Yetenekler',
    template: 'Şablon Seçimi',
    preview: 'Önizleme',
  };

  /**
   * Get current step index
   */
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  /**
   * Navigate to next step
   */
  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1]);
    }
  };

  /**
   * Navigate to previous step
   */
  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1]);
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async () => {
    try {
      // TODO: Save CV to database
      console.log('Saving CV:', cvData);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving CV:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar userName={userName} userEmail={userEmail} />

      {/* Main Content */}
      <main className="ml-72 transition-all duration-300 py-8">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Yeni CV Oluştur
            </h1>
            <p className="text-muted-foreground">
              Profesyonel CV&apos;nizi adım adım oluşturun
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                {stepTitles[currentStep]}
              </span>
              <span className="text-sm text-muted-foreground">
                Adım {currentStepIndex + 1} / {steps.length}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Step Navigation Pills */}
          <div className="mb-8 overflow-x-auto">
            <div className="flex gap-2 min-w-max pb-2">
              {steps.map((step, index) => (
                <button
                  key={step}
                  onClick={() => setCurrentStep(step)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${currentStep === step
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : index < currentStepIndex
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-muted-foreground hover:bg-gray-200 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <span className="flex items-center gap-2">
                    {index < currentStepIndex && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {stepTitles[step]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-border p-8 mb-8">
            {currentStep === 'template' && (
              <div className="space-y-6">
                <TemplateSelector
                  selectedTemplate={cvData.template}
                  onSelectTemplate={(template) => setCVData({ ...cvData, template })}
                />
              </div>
            )}

            {currentStep === 'personal' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Kişisel Bilgileriniz
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Ad *
                    </label>
                    <input
                      type="text"
                      value={cvData.personalInfo.firstName}
                      onChange={(e) => setCVData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, firstName: e.target.value }
                      })}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Adınız"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Soyad *
                    </label>
                    <input
                      type="text"
                      value={cvData.personalInfo.lastName}
                      onChange={(e) => setCVData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, lastName: e.target.value }
                      })}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Soyadınız"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Meslek Unvanı *
                    </label>
                    <input
                      type="text"
                      value={cvData.personalInfo.title}
                      onChange={(e) => setCVData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, title: e.target.value }
                      })}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Örn: Yazılım Geliştirici"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={cvData.personalInfo.email}
                      onChange={(e) => setCVData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, email: e.target.value }
                      })}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      value={cvData.personalInfo.phone}
                      onChange={(e) => setCVData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, phone: e.target.value }
                      })}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="+90 555 123 45 67"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Şehir *
                    </label>
                    <input
                      type="text"
                      value={cvData.personalInfo.city}
                      onChange={(e) => setCVData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, city: e.target.value }
                      })}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="İstanbul"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      LinkedIn (Opsiyonel)
                    </label>
                    <input
                      type="url"
                      value={cvData.personalInfo.linkedIn}
                      onChange={(e) => setCVData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, linkedIn: e.target.value }
                      })}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="https://linkedin.com/in/kullanici-adi"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'summary' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Profesyonel Özet
                </h2>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Kendinizi tanıtın *
                  </label>
                  <textarea
                    value={cvData.summary.text}
                    onChange={(e) => setCVData({
                      ...cvData,
                      summary: { text: e.target.value }
                    })}
                    rows={8}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Kariyeriniz, uzmanlık alanlarınız ve hedefleriniz hakkında kısa bir özet yazın..."
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    {cvData.summary.text.length} / 500 karakter
                  </p>
                </div>
              </div>
            )}

            {currentStep === 'experience' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  İş Deneyimi
                </h2>
                
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-muted-foreground mb-4">
                    Henüz iş deneyimi eklenmedi
                  </p>
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    + İş Deneyimi Ekle
                  </button>
                </div>
              </div>
            )}

            {currentStep === 'education' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Eğitim
                </h2>
                
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-muted-foreground mb-4">
                    Henüz eğitim bilgisi eklenmedi
                  </p>
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    + Eğitim Ekle
                  </button>
                </div>
              </div>
            )}

            {currentStep === 'skills' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Yetenekler & Diller
                </h2>
                
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-muted-foreground mb-4">
                    Henüz yetenek eklenmedi
                  </p>
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    + Yetenek Ekle
                  </button>
                </div>
              </div>
            )}

            {currentStep === 'preview' && (
              <div className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    CV Önizleme
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    CV&apos;niz {cvData.template} şablonu ile nasıl görünüyor? Kaydetmeden önce kontrol edin.
                  </p>
                </div>

                {/* Template Preview */}
                <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg overflow-auto max-h-[800px]">
                  <div className="transform scale-75 origin-top">
                    {cvData.template === 'modern' && <ModernTemplate data={cvData} />}
                    {cvData.template === 'classic' && <ClassicTemplate data={cvData} />}
                    {cvData.template === 'creative' && <CreativeTemplate data={cvData} />}
                    {cvData.template === 'professional' && <ProfessionalTemplate data={cvData} />}
                    {cvData.template === 'minimal' && <MinimalTemplate data={cvData} />}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStepIndex === 0}
              className="px-6 py-3 rounded-lg border border-border text-foreground hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Önceki
            </button>

            {currentStepIndex === steps.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                CV&apos;yi Kaydet
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Sonraki →
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
