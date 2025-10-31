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
    'hero.title1': 'Profesyonel ve Ücretsiz',
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

    // Template Selector
    'templateSelector.title': 'CV Şablonu Seçin',
    'templateSelector.subtitle': '5 farklı ATS uyumlu profesyonel şablon arasından size en uygun olanı seçin. Tüm şablonlar başvuru takip sistemleri tarafından kolayca okunabilir.',
    'templateSelector.preview': 'Önizle',
    'templateSelector.selectTemplate': 'Bu Şablonu Seç',
    'templateSelector.modalTitle': 'Şablonu - Örnek CV',
    'templateSelector.modalSubtitle': 'Bu şablon ile CV\'niz nasıl görünecek',
    'templateSelector.close': 'Kapat',

    // ATS Info
    'atsInfo.title': 'ATS Uyumluluk Nedir?',
    'atsInfo.description': 'ATS (Applicant Tracking System - Başvuru Takip Sistemi), şirketlerin CV\'leri otomatik olarak taramasına olanak tanır. Tüm şablonlarımız bu sistemler tarafından kolayca okunabilecek şekilde tasarlanmıştır, böylece başvurunuzun insan kaynakları departmanına ulaşma şansı artar.',

    // CV Builder Steps
    'cvBuilder.steps.personal': 'Kişisel Bilgiler',
    'cvBuilder.steps.summary': 'Özet',
    'cvBuilder.steps.experience': 'İş Deneyimi',
    'cvBuilder.steps.education': 'Eğitim',
    'cvBuilder.steps.skills': 'Yetenekler',
    'cvBuilder.steps.template': 'Şablon Seçimi',
    'cvBuilder.steps.preview': 'Önizleme',

    // CV Builder
    'cvBuilder.title': 'Yeni CV Oluştur',
    'cvBuilder.subtitle': 'Profesyonel CV\'nizi adım adım oluşturun',
    'cvBuilder.stepLabel': 'Adım',
    'cvBuilder.previous': 'Önceki',
    'cvBuilder.next': 'Sonraki',
    'cvBuilder.save': 'CV\'yi Kaydet',

    // Personal Info
    'cvBuilder.personal.title': 'Kişisel Bilgileriniz',
    'cvBuilder.personal.firstName': 'Ad',
    'cvBuilder.personal.firstNamePlaceholder': 'Adınız',
    'cvBuilder.personal.lastName': 'Soyad',
    'cvBuilder.personal.lastNamePlaceholder': 'Soyadınız',
    'cvBuilder.personal.titleField': 'Meslek Unvanı',
    'cvBuilder.personal.titlePlaceholder': 'Örn: Yazılım Geliştirici',
    'cvBuilder.personal.email': 'Email',
    'cvBuilder.personal.emailPlaceholder': 'email@example.com',
    'cvBuilder.personal.phone': 'Telefon',
    'cvBuilder.personal.phonePlaceholder': '+90 555 123 45 67',
    'cvBuilder.personal.city': 'Şehir',
    'cvBuilder.personal.cityPlaceholder': 'İstanbul',
    'cvBuilder.personal.linkedin': 'LinkedIn (Opsiyonel)',
    'cvBuilder.personal.linkedinPlaceholder': 'https://linkedin.com/in/kullanici-adi',

    // Summary
    'cvBuilder.summary.title': 'Profesyonel Özet',
    'cvBuilder.summary.label': 'Kendinizi tanıtın',
    'cvBuilder.summary.placeholder': 'Kariyeriniz, uzmanlık alanlarınız ve hedefleriniz hakkında kısa bir özet yazın...',
    'cvBuilder.summary.characterLimit': 'karakter',

    // Experience
    'cvBuilder.experience.title': 'İş Deneyimi',
    'cvBuilder.experience.empty': 'Henüz iş deneyimi eklenmedi',
    'cvBuilder.experience.add': 'İş Deneyimi Ekle',

    // Education
    'cvBuilder.education.title': 'Eğitim',
    'cvBuilder.education.empty': 'Henüz eğitim bilgisi eklenmedi',
    'cvBuilder.education.add': 'Eğitim Ekle',

    // Skills
    'cvBuilder.skills.title': 'Yetenekler & Diller',
    'cvBuilder.skills.empty': 'Henüz yetenek eklenmedi',
    'cvBuilder.skills.add': 'Yetenek Ekle',

    // Preview
    'cvBuilder.preview.title': 'CV Önizleme',
    'cvBuilder.preview.subtitle': 'CV\'niz',
    'cvBuilder.preview.subtitleEnd': 'şablonu ile nasıl görünüyor? Kaydetmeden önce kontrol edin.',

    // Sidebar
    'sidebar.home': 'Ana Sayfa',
    'sidebar.myCVs': 'CV\'lerim',
    'sidebar.createCV': 'Yeni CV Oluştur',
    'sidebar.profile': 'Profil',
    'sidebar.settings': 'Ayarlar',
    'sidebar.lightMode': 'Aydınlık Mod',
    'sidebar.darkMode': 'Karanlık Mod',
    'sidebar.logout': 'Çıkış Yap',
    'sidebar.brand': 'CV Maker',
    'sidebar.tagline': 'Profesyonel CV\'ler',
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

    // Template Selector
    'templateSelector.title': 'Choose CV Template',
    'templateSelector.subtitle': 'Choose the most suitable one from 5 different ATS-friendly professional templates. All templates can be easily read by application tracking systems.',
    'templateSelector.preview': 'Preview',
    'templateSelector.selectTemplate': 'Select This Template',
    'templateSelector.modalTitle': 'Template - Sample CV',
    'templateSelector.modalSubtitle': 'How your CV will look with this template',
    'templateSelector.close': 'Close',

    // ATS Info
    'atsInfo.title': 'What is ATS Compatibility?',
    'atsInfo.description': 'ATS (Applicant Tracking System) allows companies to automatically scan CVs. All our templates are designed to be easily readable by these systems, thus increasing the chance of your application reaching human resources.',

    // CV Builder Steps
    'cvBuilder.steps.personal': 'Personal Information',
    'cvBuilder.steps.summary': 'Summary',
    'cvBuilder.steps.experience': 'Work Experience',
    'cvBuilder.steps.education': 'Education',
    'cvBuilder.steps.skills': 'Skills',
    'cvBuilder.steps.template': 'Template Selection',
    'cvBuilder.steps.preview': 'Preview',

    // CV Builder
    'cvBuilder.title': 'Create New CV',
    'cvBuilder.subtitle': 'Create your professional CV step by step',
    'cvBuilder.stepLabel': 'Step',
    'cvBuilder.previous': 'Previous',
    'cvBuilder.next': 'Next',
    'cvBuilder.save': 'Save CV',

    // Personal Info
    'cvBuilder.personal.title': 'Your Personal Information',
    'cvBuilder.personal.firstName': 'First Name',
    'cvBuilder.personal.firstNamePlaceholder': 'Your first name',
    'cvBuilder.personal.lastName': 'Last Name',
    'cvBuilder.personal.lastNamePlaceholder': 'Your last name',
    'cvBuilder.personal.titleField': 'Job Title',
    'cvBuilder.personal.titlePlaceholder': 'e.g. Software Developer',
    'cvBuilder.personal.email': 'Email',
    'cvBuilder.personal.emailPlaceholder': 'email@example.com',
    'cvBuilder.personal.phone': 'Phone',
    'cvBuilder.personal.phonePlaceholder': '+90 555 123 45 67',
    'cvBuilder.personal.city': 'City',
    'cvBuilder.personal.cityPlaceholder': 'Istanbul',
    'cvBuilder.personal.linkedin': 'LinkedIn (Optional)',
    'cvBuilder.personal.linkedinPlaceholder': 'https://linkedin.com/in/username',

    // Summary
    'cvBuilder.summary.title': 'Professional Summary',
    'cvBuilder.summary.label': 'Introduce yourself',
    'cvBuilder.summary.placeholder': 'Write a brief summary about your career, expertise areas and goals...',
    'cvBuilder.summary.characterLimit': 'characters',

    // Experience
    'cvBuilder.experience.title': 'Work Experience',
    'cvBuilder.experience.empty': 'No work experience added yet',
    'cvBuilder.experience.add': 'Add Work Experience',

    // Education
    'cvBuilder.education.title': 'Education',
    'cvBuilder.education.empty': 'No education information added yet',
    'cvBuilder.education.add': 'Add Education',

    // Skills
    'cvBuilder.skills.title': 'Skills & Languages',
    'cvBuilder.skills.empty': 'No skills added yet',
    'cvBuilder.skills.add': 'Add Skill',

    // Preview
    'cvBuilder.preview.title': 'CV Preview',
    'cvBuilder.preview.subtitle': 'How does your CV look with the',
    'cvBuilder.preview.subtitleEnd': 'template? Check before saving.',

    // Sidebar
    'sidebar.home': 'Home',
    'sidebar.myCVs': 'My CVs',
    'sidebar.createCV': 'Create New CV',
    'sidebar.profile': 'Profile',
    'sidebar.settings': 'Settings',
    'sidebar.lightMode': 'Light Mode',
    'sidebar.darkMode': 'Dark Mode',
    'sidebar.logout': 'Logout',
    'sidebar.brand': 'CV Maker',
    'sidebar.tagline': 'Professional CVs',
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
