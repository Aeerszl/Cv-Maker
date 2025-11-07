/**
 * CV Builder Client Component
 * 
 * Client-side CV builder with form state
 * 
 * @module app/cv/create/CVBuilderClient
 */

'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TemplateSelector } from '@/components/cv-templates/TemplateSelector';
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
import type { CVData, FormStep, WorkExperience, Education } from '@/types/cv-builder';
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
  summary: '',
  experience: [],
  education: [],
  skills: [],
  languages: [],
  certificates: [],
  projects: [],
  cvLanguage: 'tr',
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
      const transformedData: CVData = {
        personalInfo: {
          firstName: initialData.personalInfo?.firstName || '',
          lastName: initialData.personalInfo?.lastName || '',
          email: initialData.personalInfo?.email || '',
          phone: initialData.personalInfo?.phone || '',
          address: '',
          city: initialData.personalInfo?.city || '',
          country: '',
          postalCode: '',
          title: initialData.personalInfo?.title || '',
          linkedIn: initialData.personalInfo?.linkedIn || '',
          github: initialData.personalInfo?.github || '',
          instagram: initialData.personalInfo?.instagram || '',
          website: '',
        },
        summary: initialData.summary || '',
        experience: initialData.experience?.map((exp: WorkExperience) => ({
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
          degree: (edu.degree as Education['degree']) || 'bachelor',
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
          years: skill.years,
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
        projects: initialData.projects?.map(project => ({
          id: Date.now().toString() + Math.random(),
          title: project.title || '',
          description: project.description || '',
          link: project.link || '',
          github: project.github || '',
          technologies: project.technologies || [],
        })) || [],
        cvLanguage: initialData.cvLanguage || 'tr',
        template: initialData.template || 'modern',
      };
      return transformedData;
    }
    return initialCVData;
  });

  // Ref for CV preview element (used for PDF generation)
  const cvPreviewRef = useRef<HTMLDivElement>(null);

  /**
   * Handle PDF download with clickable links and selectable text
   */
  const handleDownloadPDF = async () => {
    if (!cvPreviewRef.current) {
      alert('CV önizleme bulunamadı. Lütfen sayfayı yenileyin.');
      return;
    }

    try {
      // Show loading indicator
      const loadingToast = document.createElement('div');
      loadingToast.style.cssText = 'position:fixed;top:20px;right:20px;background:#1f2937;color:white;padding:16px 24px;border-radius:8px;z-index:9999;box-shadow:0 4px 6px rgba(0,0,0,0.1);';
      loadingToast.textContent = 'PDF oluşturuluyor...';
      document.body.appendChild(loadingToast);

      // Get HTML content from preview
      const htmlContent = cvPreviewRef.current.innerHTML;

      // Send to backend for PDF generation
      const response = await fetch('/api/cv/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          html: htmlContent,
          filename: `${cvData.personalInfo.firstName}_${cvData.personalInfo.lastName}_CV.pdf`.replace(/\s+/g, '_'),
        }),
      });

      if (!response.ok) {
        throw new Error('PDF oluşturulamadı');
      }

      // Download PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${cvData.personalInfo.firstName}_${cvData.personalInfo.lastName}_CV.pdf`.replace(/\s+/g, '_');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      // Remove loading indicator
      document.body.removeChild(loadingToast);

      // Show success message
      const successToast = document.createElement('div');
      successToast.style.cssText = 'position:fixed;top:20px;right:20px;background:#10b981;color:white;padding:16px 24px;border-radius:8px;z-index:9999;box-shadow:0 4px 6px rgba(0,0,0,0.1);';
      successToast.textContent = '✓ PDF başarıyla indirildi!';
      document.body.appendChild(successToast);
      setTimeout(() => {
        document.body.removeChild(successToast);
      }, 3000);

    } catch (error) {
      console.error('PDF generation error:', error);
      alert('PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

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
    'projects',
    'preview',
  ];

  const stepTitles: Record<FormStep, string> = {
    personal: t('cvBuilder.steps.personal'),
    summary: t('cvBuilder.steps.summary'),
    experience: t('cvBuilder.steps.experience'),
    education: t('cvBuilder.steps.education'),
    skills: t('cvBuilder.steps.skills'),
    projects: t('cvBuilder.steps.projects'),
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
        alert(t('cvBuilder.validation.nameRequired'));
        return;
      }
      if (!cvData.personalInfo.title) {
        alert(t('cvBuilder.validation.titleRequired'));
        return;
      }
      if (!cvData.personalInfo.email) {
        alert(t('cvBuilder.validation.emailRequired'));
        return;
      }
      if (!cvData.personalInfo.phone) {
        alert(t('cvBuilder.validation.phoneRequired'));
        return;
      }
      if (!cvData.personalInfo.city) {
        alert(t('cvBuilder.validation.cityRequired'));
        return;
      }
      
      // Validate summary (required)
      if (!cvData.summary || cvData.summary.trim().length === 0) {
        alert(t('cvBuilder.validation.summaryRequired'));
        return;
      }
      
      // Validate at least one education entry (required)
      if (cvData.education.length === 0) {
        alert(t('cvBuilder.validation.educationRequired'));
        return;
      }
      
      // Validate education entries
      const invalidEducation = cvData.education.some(edu => 
        !edu.school.trim() || !edu.degree.trim() || !edu.field.trim() || !edu.startDate
      );
      if (invalidEducation) {
        alert(t('cvBuilder.validation.educationIncomplete'));
        return;
      }
      
      // Validate at least one skill (required)
      if (cvData.skills.length === 0) {
        alert(t('cvBuilder.validation.skillsRequired'));
        return;
      }
      
      // Validate skills
      const invalidSkills = cvData.skills.some(skill => !skill.name.trim());
      if (invalidSkills) {
        alert(t('cvBuilder.validation.skillsIncomplete'));
        return;
      }

      // Validate work experience (if provided)
      const invalidWorkExperience = cvData.experience.some(exp => 
        !exp.company.trim() || !exp.position.trim() || !exp.startDate
      );
      if (invalidWorkExperience) {
        alert(t('cvBuilder.validation.experienceIncomplete'));
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
        cvLanguage: cvData.cvLanguage || 'tr',
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
        summary: cvData.summary,
        },
        summary: cvData.summary,
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
        projects: cvData.projects
          .filter(project => project.title.trim() !== '') // Filter out empty projects
          .map(project => ({
            name: project.title, // Backend expects 'name' not 'title'
            description: project.description,
            technologies: project.technologies || [],
            url: project.link, // Backend expects 'url' not 'link'
          })),
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
                {/* CV Language Selection */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    CV Language Selection
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Select the language for your CV. Section headings will be displayed in the selected language.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setCVData({ ...cvData, cvLanguage: 'tr' })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        cvData.cvLanguage === 'tr' || !cvData.cvLanguage
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                          : 'border-gray-300 dark:border-gray-700 hover:border-blue-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">🇹🇷</div>
                      <div className="font-bold">Türkçe</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Turkish CV</div>
                    </button>
                    <button
                      onClick={() => setCVData({ ...cvData, cvLanguage: 'en' })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        cvData.cvLanguage === 'en'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                          : 'border-gray-300 dark:border-gray-700 hover:border-blue-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">🇬🇧</div>
                      <div className="font-bold">English</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">English CV</div>
                    </button>
                  </div>
                </div>

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
                    value={cvData.summary}
                    onChange={(e) => setCVData({
                      ...cvData,
                      summary: e.target.value
                    })}
                    rows={8}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder={t('cvBuilder.summary.placeholder')}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    {cvData.summary.length} / 500 {t('cvBuilder.summary.characterLimit')}
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
                              {t('cvBuilder.experience.company')} *
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
                              placeholder={t('cvBuilder.experience.companyPlaceholder')}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              {t('cvBuilder.experience.position')} *
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
                              placeholder={t('cvBuilder.experience.positionPlaceholder')}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              {t('cvBuilder.experience.startDate')} *
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
                              {t('cvBuilder.experience.endDate')}
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
                            <span className="text-sm font-medium text-foreground">{t('cvBuilder.experience.current')}</span>
                          </label>
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-foreground mb-2">
                            {t('cvBuilder.experience.description')} *
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
                            placeholder={t('cvBuilder.experience.descriptionPlaceholder')}
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
                            {t('cvBuilder.experience.delete')}
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
                      + {t('cvBuilder.experience.addAnother')}
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
                        const newEducation: Education = {
                          id: Date.now().toString(),
                          school: '',
                          degree: 'bachelor',
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
                              {t('cvBuilder.education.school')} *
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
                              placeholder={t('cvBuilder.education.schoolPlaceholder')}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              {t('cvBuilder.education.degree')} *
                            </label>
                            <select
                              value={edu.degree}
                              onChange={(e) => {
                                const updated = [...cvData.education];
                                updated[index].degree = e.target.value as Education['degree'];
                                setCVData({ ...cvData, education: updated });
                              }}
                              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                              <option value="">{t('cvBuilder.education.degreeSelect')}</option>
                              <option value="high-school">{t('cvBuilder.education.degree.highSchool')}</option>
                              <option value="associate">{t('cvBuilder.education.degree.associate')}</option>
                              <option value="bachelor">{t('cvBuilder.education.degree.bachelor')}</option>
                              <option value="master">{t('cvBuilder.education.degree.master')}</option>
                              <option value="phd">{t('cvBuilder.education.degree.phd')}</option>
                              <option value="other">{t('cvBuilder.education.degree.other')}</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              {t('cvBuilder.education.field')} *
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
                              placeholder={t('cvBuilder.education.fieldPlaceholder')}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              {t('cvBuilder.education.gpa')}
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
                              placeholder={t('cvBuilder.education.gpaPlaceholder')}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              {t('cvBuilder.education.startDate')} *
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
                              {t('cvBuilder.education.endDate')}
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
                            <span className="text-sm font-medium text-foreground">{t('cvBuilder.education.current')}</span>
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
                            {t('cvBuilder.education.delete')}
                          </button>
                        </div>
                      </div>
                    ))}
                    <button 
                      className="w-full py-3 border-2 border-dashed border-border rounded-lg text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                      onClick={() => {
                        const newEducation: Education = {
                          id: Date.now().toString(),
                          school: '',
                          degree: 'bachelor',
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
                      + {t('cvBuilder.education.addAnother')}
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
                              {t('cvBuilder.skills.name')} *
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
                              placeholder={t('cvBuilder.skills.namePlaceholder')}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              {t('cvBuilder.skills.years')}
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="50"
                              value={skill.years || ''}
                              onChange={(e) => {
                                const updated = [...cvData.skills];
                                updated[index].years = e.target.value ? parseInt(e.target.value) : undefined;
                                setCVData({ ...cvData, skills: updated });
                              }}
                              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder={t('cvBuilder.skills.yearsPlaceholder')}
                            />
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
                            {t('cvBuilder.skills.delete')}
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
                          years: undefined,
                        };
                        setCVData({
                          ...cvData,
                          skills: [...cvData.skills, newSkill]
                        });
                      }}
                    >
                      + {t('cvBuilder.skills.addAnother')}
                    </button>
                  </div>
                )}

                {/* Languages Section */}
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-foreground mb-4">{t('cvBuilder.skills.languages')}</h3>
                  
                  {cvData.languages.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-muted-foreground mb-4">
                        {t('cvBuilder.skills.languagesEmpty')}
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
                        + {t('cvBuilder.skills.languageAdd')}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cvData.languages.map((lang, index) => (
                        <div key={lang.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-foreground mb-2">
                                {t('cvBuilder.skills.languageName')} *
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
                                placeholder={t('cvBuilder.skills.languageNamePlaceholder')}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-foreground mb-2">
                                {t('cvBuilder.skills.languageLevel')} *
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
                                <option value="basic">{t('cvBuilder.skills.languageLevel.basic')}</option>
                                <option value="intermediate">{t('cvBuilder.skills.languageLevel.intermediate')}</option>
                                <option value="fluent">{t('cvBuilder.skills.languageLevel.fluent')}</option>
                                <option value="native">{t('cvBuilder.skills.languageLevel.native')}</option>
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
                              {t('cvBuilder.skills.languageDelete')}
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
                      + {t('cvBuilder.skills.languageAddAnother')}
                    </button>
                  </div>
                  )}
                </div>
              </div>
            )}

            {currentStep === 'projects' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  {t('cvBuilder.projects.title')}
                </h2>
                
                {cvData.projects.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-muted-foreground mb-4">
                      {t('cvBuilder.projects.empty')}
                    </p>
                    <button 
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      onClick={() => {
                        const newProject = {
                          id: Date.now().toString(),
                          title: '',
                          description: '',
                          link: '',
                          github: '',
                        };
                        setCVData({
                          ...cvData,
                          projects: [...cvData.projects, newProject]
                        });
                      }}
                    >
                      + {t('cvBuilder.projects.add')}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cvData.projects.map((project, index) => (
                      <div key={project.id} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              {t('cvBuilder.projects.projectTitle')} *
                            </label>
                            <input
                              type="text"
                              value={project.title}
                              onChange={(e) => {
                                const updated = [...cvData.projects];
                                updated[index].title = e.target.value;
                                setCVData({ ...cvData, projects: updated });
                              }}
                              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder={t('cvBuilder.projects.projectTitlePlaceholder')}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              {t('cvBuilder.projects.description')} *
                            </label>
                            <textarea
                              value={project.description}
                              onChange={(e) => {
                                const updated = [...cvData.projects];
                                updated[index].description = e.target.value;
                                setCVData({ ...cvData, projects: updated });
                              }}
                              rows={3}
                              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                              placeholder={t('cvBuilder.projects.descriptionPlaceholder')}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-foreground mb-2">
                                {t('cvBuilder.projects.link')}
                              </label>
                              <input
                                type="url"
                                value={project.link || ''}
                                onChange={(e) => {
                                  const updated = [...cvData.projects];
                                  updated[index].link = e.target.value;
                                  setCVData({ ...cvData, projects: updated });
                                }}
                                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder={t('cvBuilder.projects.linkPlaceholder')}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-foreground mb-2">
                                {t('cvBuilder.projects.github')}
                              </label>
                              <input
                                type="url"
                                value={project.github || ''}
                                onChange={(e) => {
                                  const updated = [...cvData.projects];
                                  updated[index].github = e.target.value;
                                  setCVData({ ...cvData, projects: updated });
                                }}
                                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder={t('cvBuilder.projects.githubPlaceholder')}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end mt-4">
                          <button
                            onClick={() => {
                              const updated = (cvData.projects || []).filter((_, i) => i !== index);
                              setCVData({ ...cvData, projects: updated });
                            }}
                            className="px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
                          >
                            {t('cvBuilder.projects.delete')}
                          </button>
                        </div>
                      </div>
                    ))}
                    <button 
                      className="w-full py-3 border-2 border-dashed border-border rounded-lg text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                      onClick={() => {
                        const newProject = {
                          id: Date.now().toString(),
                          title: '',
                          description: '',
                          link: '',
                          github: '',
                        };
                        setCVData({
                          ...cvData,
                          projects: [...(cvData.projects || []), newProject]
                        });
                      }}
                    >
                      + {t('cvBuilder.projects.addAnother')}
                    </button>
                  </div>
                )}
              </div>
            )}            {currentStep === 'preview' && (
              <div className="space-y-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-2">
                        {t('cvBuilder.preview.title')}
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        {t('cvBuilder.preview.subtitle')} {cvData.template} {t('cvBuilder.preview.subtitleEnd')}
                      </p>
                    </div>
                    <button
                      onClick={handleDownloadPDF}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      PDF İndir
                    </button>
                  </div>
                </div>

                {/* Template Preview */}
                <div id="cv-preview" ref={cvPreviewRef} className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg overflow-auto max-h-[800px]">
                  <div className="transform scale-75 origin-top">
                    {cvData.template === 'modern' && <ModernTemplate data={cvData} />}
                    {cvData.template === 'classic' && <ClassicTemplate data={cvData} />}
                    {cvData.template === 'creative' && <CreativeTemplate data={cvData} />}
                    {cvData.template === 'professional' && <ProfessionalTemplate data={cvData} />}
                    {cvData.template === 'minimal' && <MinimalTemplate data={cvData} />}
                    {cvData.template === 'executive' && <ExecutiveTemplate data={cvData} />}
                    {cvData.template === 'techpro' && <TechProTemplate data={cvData} />}
                    {cvData.template === 'elegant' && <ElegantTemplate data={cvData} />}
                    {cvData.template === 'bold' && <BoldTemplate data={cvData} />}
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
