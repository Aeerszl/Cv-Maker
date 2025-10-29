/**
 * Language Context
 * 
 * Provides language switching functionality (TR/EN)
 * 
 * @module contexts/LanguageContext
 */

'use client';

import React, { createContext, useContext, useState } from 'react';

type Language = 'tr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  tr: {
    // Navbar
    'nav.features': 'Özellikler',
    'nav.templates': 'Şablonlar',
    'nav.pricing': 'Fiyatlandırma',
    'nav.signin': 'Giriş Yap',
    'nav.signup': 'Ücretsiz Başla',
    
    // Hero
    'hero.badge': 'AI destekli CV oluşturucu',
    'hero.title1': 'Profesyonel',
    'hero.title2': "CV'nizi Oluşturun",
    'hero.description': 'ATS uyumlu şablonlar, yapay zeka destekli öneriler ve profesyonel PDF çıktısı ile',
    'hero.description2': 'iş başvurularınızda fark yaratın',
    'hero.cta.start': 'Hemen Başla',
    'hero.cta.features': 'Özellikleri Keşfet',
    
    // Free Trial Banner
    'trial.title': 'Tamamen Ücretsiz',
    'trial.subtitle': 'Kredi kartı gerekmez • Sınırsız CV',
    'trial.button': 'Şimdi Dene',
    
    // Simple Steps
    'steps.1.title': 'Ücretsiz Başla',
    'steps.1.desc': 'Hemen kayıt ol',
    'steps.2.title': '5 ATS Şablon',
    'steps.2.desc': 'Şablonunu seç',
    'steps.3.title': 'Hızlı İndir',
    'steps.3.desc': 'PDF olarak indir',
    
    // Features
    'features.badge': 'Özellikler',
    'features.title': 'Neden',
    'features.title.brand': 'CV Maker',
    'features.subtitle': 'Modern, hızlı ve kullanıcı dostu arayüzümüzle profesyonel CV\'nizi kolayca oluşturun',
    'features.fast.title': 'Hızlı & Kolay',
    'features.fast.desc': 'Sezgisel arayüz ile dakikalar içinde profesyonel CV oluşturun.',
    'features.fast.badge': 'Ücretsiz',
    'features.ats.title': 'ATS Uyumlu Şablonlar',
    'features.ats.desc': '5 farklı profesyonel şablon ile başvurularınızı öne çıkarın.',
    'features.ats.badge': '5 Şablon',
    'features.pdf.title': 'PDF Export',
    'features.pdf.desc': 'CV\'nizi yüksek kaliteli PDF formatında anında indirin.',
    'features.pdf.badge': 'Anında',
    'features.ai.title': 'AI Destekli',
    'features.ai.desc': 'Yapay zeka önerileri ile CV\'nizi optimize edin.',
    'features.ai.badge': 'Yakında',
    
    // CTA
    'cta.title1': 'Profesyonel Kariyeriniz İçin',
    'cta.title2': 'İlk Adımı Atın',
    'cta.description': 'Ücretsiz hesap oluşturun, sınırsız CV oluşturun',
    'cta.button': 'Ücretsiz Başla',
    
    // Footer
    'footer.rights': 'Tüm hakları saklıdır.',
  },
  en: {
    // Navbar
    'nav.features': 'Features',
    'nav.templates': 'Templates',
    'nav.pricing': 'Pricing',
    'nav.signin': 'Sign In',
    'nav.signup': 'Get Started Free',
    
    // Hero
    'hero.badge': 'AI-powered CV builder',
    'hero.title1': 'Professional',
    'hero.title2': 'Create Your Resume',
    'hero.description': 'With ATS-compatible templates, AI-powered suggestions and professional PDF output',
    'hero.description2': 'make a difference in your job applications',
    'hero.cta.start': 'Get Started',
    'hero.cta.features': 'Explore Features',
    
    // Free Trial Banner
    'trial.title': 'Completely Free',
    'trial.subtitle': 'No credit card required • Unlimited CVs',
    'trial.button': 'Try Now',
    
    // Simple Steps
    'steps.1.title': 'Start Free',
    'steps.1.desc': 'Sign up now',
    'steps.2.title': '5 ATS Templates',
    'steps.2.desc': 'Choose template',
    'steps.3.title': 'Quick Download',
    'steps.3.desc': 'Download as PDF',
    
    // Features
    'features.badge': 'Features',
    'features.title': 'Why',
    'features.title.brand': 'CV Maker',
    'features.subtitle': 'Create your professional CV easily with our modern, fast and user-friendly interface',
    'features.fast.title': 'Fast & Easy',
    'features.fast.desc': 'Create professional CV in minutes with intuitive interface.',
    'features.fast.badge': 'Free',
    'features.ats.title': 'ATS Compatible Templates',
    'features.ats.desc': 'Stand out with 5 professional templates.',
    'features.ats.badge': '5 Templates',
    'features.pdf.title': 'PDF Export',
    'features.pdf.desc': 'Download your CV in high-quality PDF format instantly.',
    'features.pdf.badge': 'Instant',
    'features.ai.title': 'AI Powered',
    'features.ai.desc': 'Optimize your CV with artificial intelligence suggestions.',
    'features.ai.badge': 'Coming Soon',
    
    // CTA
    'cta.title1': 'For Your Professional Career',
    'cta.title2': 'Take The First Step',
    'cta.description': 'Create a free account, build unlimited CVs',
    'cta.button': 'Get Started Free',
    
    // Footer
    'footer.rights': 'All rights reserved.',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('language') as Language;
      if (savedLang && (savedLang === 'tr' || savedLang === 'en')) {
        return savedLang;
      }
    }
    return 'tr';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.tr] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
