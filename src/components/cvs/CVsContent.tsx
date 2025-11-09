/**
 * CVs Content Component
 * 
 * Client-side CV list with actions
 * 
 * @module components/cvs/CVsContent
 */

'use client';

import { useState, useEffect } from 'react';
import { CVCard } from '@/components/dashboard/CVCard';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import type { CVCard as CVCardType } from '@/types/dashboard';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/contexts/ToastContext';

interface CVsContentProps {
  initialCVs: CVCardType[];
}

export function CVsContent({ initialCVs }: CVsContentProps) {
  const [cvs, setCvs] = useState(initialCVs);
  const { t } = useLanguage();
  const toast = useToast();

  // Fetch CVs from API
  useEffect(() => {
    const fetchCVs = async () => {
      try {
        const response = await fetch('/api/cv');
        if (response.ok) {
          const data = await response.json();
          const apiCVs = data.cvs || data;
          const transformedCVs: CVCardType[] = apiCVs.map((cv: { _id: string; title: string; template: string; updatedAt: string; createdAt: string; status: string }) => ({
            id: cv._id,
            title: cv.title,
            template: cv.template as CVCardType['template'],
            lastModified: new Date(cv.updatedAt),
            createdAt: new Date(cv.createdAt),
            isComplete: cv.status === 'completed',
          }));
          setCvs(transformedCVs);
        }
      } catch {
        // Keep initial CVs on error - silently fail
      }
    };

    fetchCVs();
  }, []);

  /**
   * Handle CV edit
   */
  const handleEdit = (id: string) => {
    // Navigate to edit page with CV data
    window.location.href = `/cv/edit/${id}`;
  };

  /**
   * Handle CV delete
   */
  const handleDelete = async (id: string) => {
    if (!confirm(t('cvs.delete.confirm'))) {
      return;
    }

    try {
      const response = await fetch(`/api/cv/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t('cvs.delete.failed'));
      }

      // Remove from local state
      setCvs(cvs.filter(cv => cv.id !== id));
      toast.success(t('cvs.delete.success'));
    } catch {
      toast.error(t('cvs.delete.error'));
    }
  };

  /**
   * Handle CV duplicate
   */
  const handleDuplicate = async (id: string) => {
    try {
      // First get the original CV
      const response = await fetch(`/api/cv/${id}`);
      if (!response.ok) {
        throw new Error(t('cvs.notFound'));
      }

      const data = await response.json();
      const originalCV = data.cv;

      // Create duplicate payload
      const duplicatePayload = {
        title: `${originalCV.title} (Kopya)`,
        template: originalCV.template,
        status: 'draft',
        personalInfo: originalCV.personalInfo,
        summary: originalCV.summary,
        workExperience: originalCV.workExperience || [],
        education: originalCV.education || [],
        skills: originalCV.skills || [],
        languages: originalCV.languages || [],
        certifications: originalCV.certifications || [],
        projects: originalCV.projects || [],
      };

      // Create new CV
      const createResponse = await fetch('/api/cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(duplicatePayload),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(errorData.error || 'CV kopyalanamadı');
      }

      // Refresh CV list
      const refreshResponse = await fetch('/api/cv');
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        const apiCVs = refreshData.cvs || refreshData;
        const transformedCVs: CVCardType[] = apiCVs.map((cv: { _id: string; title: string; template: string; updatedAt: string; createdAt: string; status: string }) => ({
          id: cv._id,
          title: cv.title,
          template: cv.template as CVCardType['template'],
          lastModified: new Date(cv.updatedAt),
          createdAt: new Date(cv.createdAt),
          isComplete: cv.status === 'completed',
        }));
        setCvs(transformedCVs);
      }

      toast.success(t('cvs.duplicate.success'));
    } catch {
      toast.error(t('cvs.duplicate.error'));
    }
  };

  /**
   * Handle CV download
   */
  const handleDownload = async (id: string) => {
    try {
      // Create a temporary link to download the PDF
      const link = document.createElement('a');
      link.href = `/api/cv/${id}/download`;
      link.download = `cv_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.info(t('cvs.download.started'));
    } catch {
      toast.error(t('cvs.download.error'));
    }
  };

  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {t('cvs.title')}
            </h1>
            <p className="text-muted-foreground">
              {t('cvs.subtitle')}
            </p>
          </div>
          <Link
            href="/cv/create"
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>{t('cvs.createNew')}</span>
          </Link>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground mb-1">{t('cvs.stats.total')}</p>
          <p className="text-2xl font-bold text-foreground">{cvs.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground mb-1">{t('cvs.stats.completed')}</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {cvs.filter(cv => cv.isComplete).length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground mb-1">{t('cvs.stats.draft')}</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {cvs.filter(cv => !cv.isComplete).length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground mb-1">{t('cvs.stats.thisMonth')}</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {cvs.filter(cv => {
              const now = new Date();
              const cvDate = new Date(cv.createdAt);
              return cvDate.getMonth() === now.getMonth() && cvDate.getFullYear() === now.getFullYear();
            }).length}
          </p>
        </div>
      </div>

      {/* CV Grid */}
      {cvs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cvs.map((cv) => (
            <CVCard
              key={cv.id}
              {...cv}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              onDownload={handleDownload}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-xl border border-border">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <Plus className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            {t('cvs.emptyState.title')}
          </h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {t('cvs.emptyState.description')}
          </p>
          <Link
            href="/cv/create"
            className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <Plus className="w-6 h-6" />
            <span>{t('cvs.emptyState.button')}</span>
          </Link>
        </div>
      )}
    </>
  );
}
