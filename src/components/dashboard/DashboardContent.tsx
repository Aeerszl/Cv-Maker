/**
 * Dashboard Content Component
 * 
 * Client-side dashboard content with CV grid and examples
 * 
 * @module components/dashboard/DashboardContent
 */

'use client';

import { useState, useEffect } from 'react';
import { Plus, CheckCircle, Target, FileText, Zap, Hash, Mail, GraduationCap, Briefcase, Code, Globe, Sparkles, Search } from 'lucide-react';
import Link from 'next/link';
import type { CVCard as CVCardType } from '@/types/dashboard';

interface DashboardContentProps {
  initialCVs: CVCardType[];
}

/**
 * CV Tips
 */
const cvTips = [
  {
    icon: CheckCircle,
    title: 'Net ve Öz Olun',
    description: 'CV\'niz 1-2 sayfa arasında olmalı. Gereksiz detaylardan kaçının ve önemli bilgilere odaklanın.',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
  },
  {
    icon: Target,
    title: 'İş İlanına Uygun',
    description: 'Her pozisyon için CV\'nizi özelleştirin. İlgili becerileri ve deneyimleri öne çıkarın.',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/20',
  },
  {
    icon: FileText,
    title: 'ATS Uyumlu Format',
    description: 'Başvuru sistemleri CV\'nizi okuyabilmeli. Standart başlıklar ve düzenli formatlar kullanın.',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20',
  },
  {
    icon: Zap,
    title: 'Başarılarınızı Ölçün',
    description: 'Sayılarla desteklenmiş başarılar ekleyin. "Satışları %30 artırdım" gibi somut örnekler verin.',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/20',
  },
  {
    icon: Hash,
    title: 'Anahtar Kelimeler',
    description: 'İş ilanındaki anahtar kelimeleri CV\'nize dahil edin. Bu, sistemler tarafından fark edilmenizi sağlar.',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/20',
  },
  {
    icon: Mail,
    title: 'İletişim Bilgileri',
    description: 'Güncel telefon, e-posta ve LinkedIn profilinizi ekleyin. Profesyonel bir e-posta adresi kullanın.',
    color: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-100 dark:bg-cyan-900/20',
  },
  {
    icon: GraduationCap,
    title: 'Eğitim ve Sertifikalar',
    description: 'Mezuniyet bilgilerinizi, önemli sertifikalarınızı ve eğitim programlarınızı belirtin.',
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/20',
  },
  {
    icon: Briefcase,
    title: 'İş Deneyimi',
    description: 'Son pozisyondan başlayarak çalışma geçmişinizi kronolojik sırayla listeleyin.',
    color: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-100 dark:bg-pink-900/20',
  },
  {
    icon: Code,
    title: 'Teknik Beceriler',
    description: 'Pozisyonla ilgili yazılım, araç ve teknolojilerdeki yetkinliklerinizi gösterin.',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/20',
  },
  {
    icon: Globe,
    title: 'Dil Becerileri',
    description: 'Yabancı dil seviyelerinizi (A1-C2) veya sertifikalarınızı (TOEFL, IELTS) belirtin.',
    color: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-100 dark:bg-teal-900/20',
  },
  {
    icon: Sparkles,
    title: 'Temiz Tasarım',
    description: 'Okunabilir fontlar, yeterli boşluklar ve profesyonel bir görünüm kullanın.',
    color: 'text-violet-600 dark:text-violet-400',
    bgColor: 'bg-violet-100 dark:bg-violet-900/20',
  },
  {
    icon: Search,
    title: 'Hatasız İçerik',
    description: 'Yazım ve dilbilgisi hatalarını kontrol edin. CV\'nizi başkasına okutarak gözden geçirin.',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/20',
  },
];

/**
 * Dashboard Content Component
 */
export function DashboardContent({ initialCVs }: DashboardContentProps) {
  const [cvs, setCvs] = useState<CVCardType[]>(initialCVs);

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
        } else {
          console.error('API Error:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching CVs:', error);
        // Keep initial CVs on error
      }
    };

    fetchCVs();
  }, []);

  // Calculate statistics
  const totalCVs = cvs.length;
  const completedCVs = cvs.filter(cv => cv.isComplete).length;
  const lastModified = cvs.length > 0 
    ? cvs.reduce((latest, cv) => cv.lastModified > latest ? cv.lastModified : latest, cvs[0].lastModified)
    : null;

  return (
    <>
      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Toplam CV
            </h3>
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {totalCVs}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Tamamlanan
            </h3>
            <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {completedCVs}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Son Güncelleme
            </h3>
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-lg font-semibold text-foreground">
            {lastModified 
              ? lastModified.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
              : '-'
            }
          </p>
        </div>
      </div>

      {/* CV Tips Section */}
      <div className="mb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            İyi Bir CV&apos;de Neler Olmalı?
          </h2>
          <p className="text-muted-foreground">
            Profesyonel bir CV hazırlarken dikkat etmeniz gereken önemli noktalar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cvTips.map((tip, index) => {
            const Icon = tip.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <div className={`w-12 h-12 rounded-lg ${tip.bgColor} flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${tip.color}`} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {tip.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {tip.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Action - Create CV */}
      <div className="text-center py-16 bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-border">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
          <Plus className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-3">
          Profesyonel CV&apos;nizi Oluşturun
        </h3>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          ATS uyumlu şablonlarımızla dakikalar içinde etkileyici bir CV hazırlayın.
          {totalCVs > 0 && ` Şu ana kadar ${totalCVs} CV oluşturdunuz.`}
        </p>
        <Link
          href="/cv/create"
          className="inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          <Plus className="w-6 h-6" />
          <span>Yeni CV Oluştur</span>
        </Link>
      </div>
    </>
  );
}
