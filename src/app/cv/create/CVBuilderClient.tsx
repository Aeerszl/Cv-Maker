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
import { useLanguage } from '@/contexts/LanguageContext';

interface CVBuilderClientProps {
  userName: string;
  userEmail?: string;
  initialData?: Partial<CVData> & { _id?: string };
  isEdit?: boolean;
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
export default function CVBuilderClient({ userName, userEmail, initialData, isEdit }: CVBuilderClientProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<FormStep>('template');
  const [cvData, setCVData] = useState<CVData>(() => {
    if (initialData) {
      // Transform backend data to frontend format
      return {
        personalInfo: {
          firstName: initialData.personalInfo?.fullName?.split(' ')[0] || '',
          lastName: initialData.personalInfo?.fullName?.split(' ').slice(1).join(' ') || '',
          email: initialData.personalInfo?.email || '',
          phone: initialData.personalInfo?.phone || '',
          address: '',
          city: initialData.personalInfo?.location || '',
          country: '',
          postalCode: '',
          title: initialData.personalInfo?.title || '',
          linkedIn: initialData.personalInfo?.linkedin || '',
          github: initialData.personalInfo?.github || '',
          instagram: initialData.personalInfo?.instagram || '',
          website: '',
        },
        summary: {
          text: initialData.summary || '',
        },
        experience: initialData.workExperience?.map(exp => ({
          id: Date.now().toString() + Math.random(),
          company: exp.company || '',
          position: exp.position || '',
          location: exp.location || '',
          startDate: exp.startDate || '',
          endDate: exp.endDate || '',
          current: exp.current || false,
          description: exp.description || '',
        })) || [],
        education: initialData.education?.map(edu => ({
          id: Date.now().toString() + Math.random(),
          school: edu.school || '',
          degree: edu.degree || '',
          field: edu.field || '',
          location: edu.location || '',
          startDate: edu.startDate || '',
          endDate: edu.endDate || '',
          current: edu.current || false,
          gpa: edu.gpa || '',
        })) || [],
        skills: initialData.skills?.map(skill => ({
          id: Date.now().toString() + Math.random(),
          name: skill.name || '',
          level: skill.level || 'intermediate',
        })) || [],
        languages: initialData.languages?.map(lang => ({
          id: Date.now().toString() + Math.random(),
          name: lang.name || '',
          level: lang.level || 'intermediate',
        })) || [],
        certificates: initialData.certificates?.map(cert => ({
          id: Date.now().toString() + Math.random(),
          name: cert.name || '',
          issuer: cert.issuer || '',
          date: cert.date || '',
          url: cert.url || '',
        })) || [],
        template: initialData.template || 'modern',
      };
    }
    return initialCVData;
  });

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
    personal: t('cvBuilder.steps.personal'),
    summary: t('cvBuilder.steps.summary'),
    experience: t('cvBuilder.steps.experience'),
    education: t('cvBuilder.steps.education'),
    skills: t('cvBuilder.steps.skills'),
    template: t('cvBuilder.steps.template'),
    preview: t('cvBuilder.steps.preview'),
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
      // Validate required fields before submission
      if (!cvData.personalInfo.firstName || !cvData.personalInfo.lastName) {
        alert('Ad ve soyad zorunludur');
        return;
      }
      if (!cvData.personalInfo.title) {
        alert('Ünvan zorunludur');
        return;
      }
      if (!cvData.personalInfo.email) {
        alert('Email zorunludur');
        return;
      }
      if (!cvData.personalInfo.phone) {
        alert('Telefon zorunludur');
        return;
      }
      if (!cvData.personalInfo.city) {
        alert('Şehir zorunludur');
        return;
      }
      // Validate work experience
      const invalidWorkExperience = cvData.experience.some(exp => 
        !exp.company.trim() || !exp.position.trim() || !exp.startDate
      );
      if (invalidWorkExperience) {
        alert('İş deneyimi bilgileri eksik: Şirket, pozisyon ve başlangıç tarihi zorunludur');
        return;
      }

      // Validate education
      const invalidEducation = cvData.education.some(edu => 
        !edu.school.trim() || !edu.degree.trim() || !edu.field.trim() || !edu.startDate
      );
      if (invalidEducation) {
        alert('Eğitim bilgileri eksik: Okul, derece, bölüm ve başlangıç tarihi zorunludur');
        return;
      }

      // Filter out empty work experiences
      const filteredWorkExperience = cvData.experience.filter(exp => 
        exp.company.trim() && exp.position.trim() && exp.startDate
      );

      // Filter out empty education
      const filteredEducation = cvData.education.filter(edu => 
        edu.school.trim() && edu.degree.trim() && edu.field.trim() && edu.startDate
      );

      // Filter out empty skills
      const filteredSkills = cvData.skills.filter(skill => skill.name.trim());

      // Filter out empty languages (already done in payload creation)

      // Transform CVData to match backend schema
      const cvPayload = {
        title: `${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName} - CV`,
        template: cvData.template,
        status: 'completed' as const,
        personalInfo: {
          fullName: `${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}`,
          title: cvData.personalInfo.title,
          email: cvData.personalInfo.email,
          phone: cvData.personalInfo.phone,
          location: cvData.personalInfo.city,
          linkedin: cvData.personalInfo.linkedIn,
          github: cvData.personalInfo.github,
          instagram: cvData.personalInfo.instagram,
          summary: cvData.summary.text,
        },
        summary: cvData.summary.text,
        workExperience: filteredWorkExperience.map(exp => ({
          company: exp.company,
          position: exp.position,
          startDate: exp.startDate,
          endDate: exp.endDate,
          current: exp.current,
          description: exp.description,
          location: exp.location,
        })),
        education: filteredEducation.map(edu => ({
          school: edu.school,
          degree: edu.degree,
          field: edu.field,
          startDate: edu.startDate,
          endDate: edu.endDate,
          current: edu.current,
          gpa: edu.gpa,
        })),
        skills: filteredSkills.map(skill => ({
          name: skill.name,
          level: skill.level,
        })),
        languages: cvData.languages
          .filter(lang => lang.name.trim() !== '') // Boş dil isimlerini filtrele
          .map(lang => ({
            name: lang.name,
            level: lang.level,
          })),
        certifications: cvData.certificates.map(cert => ({
          name: cert.name,
          issuer: cert.issuer,
          date: cert.date,
          url: cert.url,
        })),
        projects: [], // Empty for now
      };

      console.log('Sending CV payload:', cvPayload);

      let response;
      if (isEdit && initialData?._id) {
        // Update existing CV
        response = await fetch(`/api/cv/${initialData._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cvPayload),
        });
      } else {
        // Create new CV
        response = await fetch('/api/cv', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cvPayload),
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('CV Save Error:', errorText);
        throw new Error('CV kaydedilemedi');
      }

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving CV:', error);
      alert('CV kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
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
              {t('cvBuilder.title')}
            </h1>
            <p className="text-muted-foreground">
              {t('cvBuilder.subtitle')}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                {stepTitles[currentStep]}
              </span>
              <span className="text-sm text-muted-foreground">
                {t('cvBuilder.stepLabel')} {currentStepIndex + 1} / {steps.length}
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
                  {t('cvBuilder.personal.title')}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('cvBuilder.personal.firstName')} *
                    </label>
                    <input
                      type="text"
                      value={cvData.personalInfo.firstName}
                      onChange={(e) => setCVData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, firstName: e.target.value }
                      })}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder={t('cvBuilder.personal.firstNamePlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('cvBuilder.personal.lastName')} *
                    </label>
                    <input
                      type="text"
                      value={cvData.personalInfo.lastName}
                      onChange={(e) => setCVData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, lastName: e.target.value }
                      })}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder={t('cvBuilder.personal.lastNamePlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('cvBuilder.personal.titleField')} *
                    </label>
                    <input
                      type="text"
                      value={cvData.personalInfo.title}
                      onChange={(e) => setCVData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, title: e.target.value }
                      })}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder={t('cvBuilder.personal.titlePlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('cvBuilder.personal.email')} *
                    </label>
                    <input
                      type="email"
                      value={cvData.personalInfo.email}
                      onChange={(e) => setCVData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, email: e.target.value }
                      })}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder={t('cvBuilder.personal.emailPlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('cvBuilder.personal.phone')} *
                    </label>
                    <input
                      type="tel"
                      value={cvData.personalInfo.phone}
                      onChange={(e) => setCVData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, phone: e.target.value }
                      })}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder={t('cvBuilder.personal.phonePlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('cvBuilder.personal.city')} *
                    </label>
                    <input
                      type="text"
                      value={cvData.personalInfo.city}
                      onChange={(e) => setCVData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, city: e.target.value }
                      })}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder={t('cvBuilder.personal.cityPlaceholder')}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      value={cvData.personalInfo.linkedIn}
                      onChange={(e) => setCVData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, linkedIn: e.target.value }
                      })}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      GitHub
                    </label>
                    <input
                      type="url"
                      value={cvData.personalInfo.github || ''}
                      onChange={(e) => setCVData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, github: e.target.value }
                      })}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="https://github.com/username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Instagram
                    </label>
                    <input
                      type="url"
                      value={cvData.personalInfo.instagram || ''}
                      onChange={(e) => setCVData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, instagram: e.target.value }
                      })}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="https://instagram.com/username"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Website/Portfolio
                    </label>
                    <input
                      type="url"
                      value={cvData.personalInfo.website || ''}
                      onChange={(e) => setCVData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, website: e.target.value }
                      })}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'summary' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  {t('cvBuilder.summary.title')}
                </h2>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('cvBuilder.summary.label')} *
                  </label>
                  <textarea
                    value={cvData.summary.text}
                    onChange={(e) => setCVData({
                      ...cvData,
                      summary: { text: e.target.value }
                    })}
                    rows={8}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder={t('cvBuilder.summary.placeholder')}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    {cvData.summary.text.length} / 500 {t('cvBuilder.summary.characterLimit')}
                  </p>
                </div>
              </div>
            )}

            {currentStep === 'experience' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  {t('cvBuilder.experience.title')}
                </h2>
                
                {cvData.experience.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-muted-foreground mb-4">
                      {t('cvBuilder.experience.empty')}
                    </p>
                    <button 
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      onClick={() => {
                        const newExperience = {
                          id: Date.now().toString(),
                          company: '',
                          position: '',
                          location: '',
                          startDate: '',
                          endDate: '',
                          current: false,
                          description: '',
                        };
                        setCVData({
                          ...cvData,
                          experience: [...cvData.experience, newExperience]
                        });
                      }}
                    >
                      + {t('cvBuilder.experience.add')}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cvData.experience.map((exp, index) => (
                      <div key={exp.id} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Şirket *
                            </label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => {
                                const updated = [...cvData.experience];
                                updated[index].company = e.target.value;
                                setCVData({ ...cvData, experience: updated });
                              }}
                              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="Şirket adı"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Pozisyon *
                            </label>
                            <input
                              type="text"
                              value={exp.position}
                              onChange={(e) => {
                                const updated = [...cvData.experience];
                                updated[index].position = e.target.value;
                                setCVData({ ...cvData, experience: updated });
                              }}
                              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="Pozisyon adı"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Başlangıç Tarihi *
                            </label>
                            <input
                              type="date"
                              value={exp.startDate}
                              onChange={(e) => {
                                const updated = [...cvData.experience];
                                updated[index].startDate = e.target.value;
                                setCVData({ ...cvData, experience: updated });
                              }}
                              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Bitiş Tarihi
                            </label>
                            <input
                              type="date"
                              value={exp.endDate}
                              onChange={(e) => {
                                const updated = [...cvData.experience];
                                updated[index].endDate = e.target.value;
                                setCVData({ ...cvData, experience: updated });
                              }}
                              disabled={exp.current}
                              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                            />
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="flex items-center gap-2 mb-2">
                            <input
                              type="checkbox"
                              checked={exp.current}
                              onChange={(e) => {
                                const updated = [...cvData.experience];
                                updated[index].current = e.target.checked;
                                if (e.target.checked) {
                                  updated[index].endDate = '';
                                }
                                setCVData({ ...cvData, experience: updated });
                              }}
                              className="rounded border-border"
                            />
                            <span className="text-sm font-medium text-foreground">Hala bu pozisyonda çalışıyorum</span>
                          </label>
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Açıklama *
                          </label>
                          <textarea
                            value={exp.description}
                            onChange={(e) => {
                              const updated = [...cvData.experience];
                              updated[index].description = e.target.value;
                              setCVData({ ...cvData, experience: updated });
                            }}
                            rows={4}
                            className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            placeholder="Görev ve sorumluluklarınızı açıklayın..."
                          />
                        </div>
                        <div className="flex justify-end">
                          <button
                            onClick={() => {
                              const updated = cvData.experience.filter((_, i) => i !== index);
                              setCVData({ ...cvData, experience: updated });
                            }}
                            className="px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
                          >
                            Sil
                          </button>
                        </div>
                      </div>
                    ))}
                    <button 
                      className="w-full py-3 border-2 border-dashed border-border rounded-lg text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                      onClick={() => {
                        const newExperience = {
                          id: Date.now().toString(),
                          company: '',
                          position: '',
                          location: '',
                          startDate: '',
                          endDate: '',
                          current: false,
                          description: '',
                        };
                        setCVData({
                          ...cvData,
                          experience: [...cvData.experience, newExperience]
                        });
                      }}
                    >
                      + Başka İş Deneyimi Ekle
                    </button>
                  </div>
                )}
              </div>
            )}

            {currentStep === 'education' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  {t('cvBuilder.education.title')}
                </h2>
                
                {cvData.education.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-muted-foreground mb-4">
                      {t('cvBuilder.education.empty')}
                    </p>
                    <button 
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      onClick={() => {
                        const newEducation = {
                          id: Date.now().toString(),
                          school: '',
                          degree: '',
                          field: '',
                          location: '',
                          startDate: '',
                          endDate: '',
                          current: false,
                          gpa: '',
                        };
                        setCVData({
                          ...cvData,
                          education: [...cvData.education, newEducation]
                        });
                      }}
                    >
                      + {t('cvBuilder.education.add')}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cvData.education.map((edu, index) => (
                      <div key={edu.id} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Okul *
                            </label>
                            <input
                              type="text"
                              value={edu.school}
                              onChange={(e) => {
                                const updated = [...cvData.education];
                                updated[index].school = e.target.value;
                                setCVData({ ...cvData, education: updated });
                              }}
                              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="Üniversite/okul adı"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Derece *
                            </label>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => {
                                const updated = [...cvData.education];
                                updated[index].degree = e.target.value;
                                setCVData({ ...cvData, education: updated });
                              }}
                              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="Lisans, Yüksek Lisans, vb."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Bölüm *
                            </label>
                            <input
                              type="text"
                              value={edu.field}
                              onChange={(e) => {
                                const updated = [...cvData.education];
                                updated[index].field = e.target.value;
                                setCVData({ ...cvData, education: updated });
                              }}
                              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="Bilgisayar Mühendisliği, vb."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Not Ortalaması
                            </label>
                            <input
                              type="text"
                              value={edu.gpa}
                              onChange={(e) => {
                                const updated = [...cvData.education];
                                updated[index].gpa = e.target.value;
                                setCVData({ ...cvData, education: updated });
                              }}
                              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="3.5/4.0"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Başlangıç Tarihi *
                            </label>
                            <input
                              type="date"
                              value={edu.startDate}
                              onChange={(e) => {
                                const updated = [...cvData.education];
                                updated[index].startDate = e.target.value;
                                setCVData({ ...cvData, education: updated });
                              }}
                              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Mezuniyet Tarihi
                            </label>
                            <input
                              type="date"
                              value={edu.endDate}
                              onChange={(e) => {
                                const updated = [...cvData.education];
                                updated[index].endDate = e.target.value;
                                setCVData({ ...cvData, education: updated });
                              }}
                              disabled={edu.current}
                              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                            />
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="flex items-center gap-2 mb-2">
                            <input
                              type="checkbox"
                              checked={edu.current}
                              onChange={(e) => {
                                const updated = [...cvData.education];
                                updated[index].current = e.target.checked;
                                if (e.target.checked) {
                                  updated[index].endDate = '';
                                }
                                setCVData({ ...cvData, education: updated });
                              }}
                              className="rounded border-border"
                            />
                            <span className="text-sm font-medium text-foreground">Hala bu eğitim kurumundayım</span>
                          </label>
                        </div>
                        <div className="flex justify-end">
                          <button
                            onClick={() => {
                              const updated = cvData.education.filter((_, i) => i !== index);
                              setCVData({ ...cvData, education: updated });
                            }}
                            className="px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
                          >
                            Sil
                          </button>
                        </div>
                      </div>
                    ))}
                    <button 
                      className="w-full py-3 border-2 border-dashed border-border rounded-lg text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                      onClick={() => {
                        const newEducation = {
                          id: Date.now().toString(),
                          school: '',
                          degree: '',
                          field: '',
                          location: '',
                          startDate: '',
                          endDate: '',
                          current: false,
                          gpa: '',
                        };
                        setCVData({
                          ...cvData,
                          education: [...cvData.education, newEducation]
                        });
                      }}
                    >
                      + Başka Eğitim Bilgisi Ekle
                    </button>
                  </div>
                )}
              </div>
            )}

            {currentStep === 'skills' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  {t('cvBuilder.skills.title')}
                </h2>
                
                {cvData.skills.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-muted-foreground mb-4">
                      {t('cvBuilder.skills.empty')}
                    </p>
                    <button 
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      onClick={() => {
                        const newSkill = {
                          id: Date.now().toString(),
                          name: '',
                          level: 'intermediate' as const,
                        };
                        setCVData({
                          ...cvData,
                          skills: [...cvData.skills, newSkill]
                        });
                      }}
                    >
                      + {t('cvBuilder.skills.add')}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cvData.skills.map((skill, index) => (
                      <div key={skill.id} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Yetenek Adı *
                            </label>
                            <input
                              type="text"
                              value={skill.name}
                              onChange={(e) => {
                                const updated = [...cvData.skills];
                                updated[index].name = e.target.value;
                                setCVData({ ...cvData, skills: updated });
                              }}
                              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="JavaScript, Python, vb."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Seviye *
                            </label>
                            <select
                              value={skill.level}
                              onChange={(e) => {
                                const updated = [...cvData.skills];
                                updated[index].level = e.target.value as typeof skill.level;
                                setCVData({ ...cvData, skills: updated });
                              }}
                              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                              <option value="beginner">Başlangıç</option>
                              <option value="intermediate">Orta</option>
                              <option value="advanced">İleri</option>
                              <option value="expert">Uzman</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <button
                            onClick={() => {
                              const updated = cvData.skills.filter((_, i) => i !== index);
                              setCVData({ ...cvData, skills: updated });
                            }}
                            className="px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
                          >
                            Sil
                          </button>
                        </div>
                      </div>
                    ))}
                    <button 
                      className="w-full py-3 border-2 border-dashed border-border rounded-lg text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                      onClick={() => {
                        const newSkill = {
                          id: Date.now().toString(),
                          name: '',
                          level: 'intermediate' as const,
                        };
                        setCVData({
                          ...cvData,
                          skills: [...cvData.skills, newSkill]
                        });
                      }}
                    >
                      + Başka Yetenek Ekle
                    </button>
                  </div>
                )}

                {/* Languages Section */}
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-foreground mb-4">Dil Bilgileri</h3>
                  
                  {cvData.languages.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-muted-foreground mb-4">
                        Henüz dil bilgisi eklenmedi
                      </p>
                      <button 
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        onClick={() => {
                          const newLanguage = {
                            id: Date.now().toString(),
                            name: '',
                            level: 'intermediate' as const,
                          };
                          setCVData({
                            ...cvData,
                            languages: [...cvData.languages, newLanguage]
                          });
                        }}
                      >
                        + Dil Ekle
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cvData.languages.map((lang, index) => (
                        <div key={lang.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-foreground mb-2">
                                Dil *
                              </label>
                              <input
                                type="text"
                                value={lang.name}
                                onChange={(e) => {
                                  const updated = [...cvData.languages];
                                  updated[index].name = e.target.value;
                                  setCVData({ ...cvData, languages: updated });
                                }}
                                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="İngilizce, Almanca, vb."
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-foreground mb-2">
                                Seviye *
                              </label>
                              <select
                                value={lang.level}
                                onChange={(e) => {
                                  const updated = [...cvData.languages];
                                  updated[index].level = e.target.value as typeof lang.level;
                                  setCVData({ ...cvData, languages: updated });
                                }}
                                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                              >
                                <option value="basic">Temel</option>
                                <option value="intermediate">Orta</option>
                                <option value="fluent">Akıcı</option>
                                <option value="native">Anadil</option>
                              </select>
                            </div>
                          </div>
                          <div className="flex justify-end mt-4">
                            <button
                              onClick={() => {
                                const updated = cvData.languages.filter((_, i) => i !== index);
                                setCVData({ ...cvData, languages: updated });
                              }}
                              className="px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
                            >
                              Sil
                            </button>
                          </div>
                        </div>
                      ))}
                      <button 
                        className="w-full py-3 border-2 border-dashed border-border rounded-lg text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                        onClick={() => {
                          const newLanguage = {
                            id: Date.now().toString(),
                            name: '',
                            level: 'intermediate' as const,
                          };
                          setCVData({
                            ...cvData,
                            languages: [...cvData.languages, newLanguage]
                          });
                        }}
                      >
                        + Başka Dil Ekle
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentStep === 'preview' && (
              <div className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    {t('cvBuilder.preview.title')}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {t('cvBuilder.preview.subtitle')} {cvData.template} {t('cvBuilder.preview.subtitleEnd')}
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
              ← {t('cvBuilder.previous')}
            </button>

            {currentStepIndex === steps.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                {t('cvBuilder.save')}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                {t('cvBuilder.next')} →
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
