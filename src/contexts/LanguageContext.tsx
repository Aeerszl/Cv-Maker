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
    'nav.features': 'Neden Biz',
    'nav.templates': 'Şablonlar',
    'nav.about': 'Hakkımızda',
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
    'features.badge': 'Neden Biz',
    'features.title': 'Neden',
    'features.title.brand': 'CvMaker.Aliee',
    'features.subtitle': 'Profesyonel CV oluşturma deneyimini modern teknoloji ve kullanıcı dostu tasarım ile yeniden tanımlıyoruz',
    'features.fast.title': 'Tamamen Ücretsiz',
    'features.fast.desc': 'Sınırsız CV oluşturun, hiçbir ücret ödemeden profesyonel sonuçlar elde edin.',
    'features.fast.badge': 'Ücretsiz',
    'features.ats.title': 'ATS Uyumlu Tasarım',
    'features.ats.desc': 'Başvuru takip sistemleri tarafından kolayca okunabilen, optimize edilmiş şablonlar.',
    'features.ats.badge': 'ATS Uyumlu',
    'features.pdf.title': 'Anında PDF İndirme',
    'features.pdf.desc': 'CV\'nizi yüksek kaliteli PDF formatında saniyeler içinde indirin.',
    'features.pdf.badge': 'Anında',
    'features.ai.title': 'Profesyonel Şablonlar',
    'features.ai.desc': '5 farklı modern ve klasik tasarım seçeneği ile her sektöre uygun CV.',
    'features.ai.badge': '5 Şablon',
    
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

    // About Page
    'about.hero.badge': 'Hakkımızda',
    'about.hero.title': 'Profesyonel CV\'lerin Geleceği',
    'about.hero.description': 'Modern teknoloji ve kullanıcı dostu tasarım ile profesyonel CV oluşturma deneyimini yeniden tanımlıyoruz. ATS uyumlu şablonlar ve yapay zeka destekli öneriler ile kariyerinizde fark yaratın.',
    'about.features.title': 'Neden CvMaker.Aliee?',
    'about.features.subtitle': 'Profesyonel CV oluşturma deneyimini modern teknoloji ve kullanıcı dostu tasarım ile yeniden tanımlıyoruz',
    'about.features.templates.title': '5 Profesyonel Şablon',
    'about.features.templates.description': 'Modern, klasik, yaratıcı, profesyonel ve minimal tasarımlar ile her sektöre uygun CV şablonu.',
    'about.features.ats.title': 'ATS Uyumlu Tasarım',
    'about.features.ats.description': 'Başvuru takip sistemleri tarafından kolayca okunabilen, optimize edilmiş şablonlar.',
    'about.features.fast.title': 'Anında PDF İndirme',
    'about.features.fast.description': 'CV\'nizi yüksek kaliteli PDF formatında saniyeler içinde indirin.',
    'about.features.free.title': 'Tamamen Ücretsiz',
    'about.features.free.description': 'Sınırsız CV oluşturun, hiçbir ücret ödemeden profesyonel sonuçlar elde edin.',
    'about.stats.templates': 'Şablon',
    'about.stats.ats': 'ATS Uyumlu',
    'about.stats.support': 'Destek',
    'about.stats.price': 'Ücretsiz',
    'about.ats.benefits.title': 'ATS Faydaları',
    'about.ats.benefits.keyword': 'Anahtar kelime optimizasyonu',
    'about.ats.benefits.format': 'Doğru format ve yapı',
    'about.ats.benefits.speed': 'Hızlı tarama ve okuma',
    'about.ats.templates.title': 'Şablon Çeşitliliği',
    'about.ats.templates.description': 'Her sektör ve pozisyon için uygun şablon seçeneği',
    'about.cta.title': 'Kariyeriniz İçin İlk Adımı Atın',
    'about.cta.description': 'Ücretsiz hesap oluşturun, sınırsız CV oluşturun',
    'about.cta.button': 'Ücretsiz Başla',
    'about.cta.templates': 'Şablonları Keşfet',
    'about.back': 'Ana Sayfaya Dön',

    // About Page New Sections
    'about.page.hero.title': 'Proje Hakkında',
    'about.page.hero.description': 'Bu platformu insanların hızlı ve zahmetsizce modern bir CV oluşturup indirebilmesi için tek başıma geliştirdim.',
    'about.page.why.title': 'Neden Bu Projeyi Yaptım?',
    'about.page.why.description': 'Kariyer yolculuğunda CV hazırlamanın ne kadar önemli olduğunu biliyorum. Ancak çoğu insan Word\'de saatlerce uğraşır, format sorunları yaşar veya profesyonel görünüm elde etmek için tasarım bilgisi gerektirir. Bu sorunu çözmek için bu platformu geliştirdim. Amacım, herkesin 5 dakika içinde ücretsiz ve profesyonel bir CV oluşturabilmesi.',
    'about.page.ats.title': 'ATS Format Nedir?',
    'about.page.ats.description': 'ATS (Applicant Tracking System), şirketlerin CV\'leri otomatik olarak taramasına olanak tanıyan yazılımlardır. Başvuruların %75\'i ATS sistemlerinden geçer ve uygun formatta olmayan CV\'ler elenir.',
    'about.page.ats.correct': 'Doğru Format',
    'about.page.ats.wrong': 'Yanlış Format',
    'about.page.ats.correctItems.0': 'Standart yazı tipleri (Arial, Calibri)',
    'about.page.ats.correctItems.1': 'Anahtar kelime optimizasyonu',
    'about.page.ats.correctItems.2': 'Temiz, düzenli yapı',
    'about.page.ats.wrongItems.0': 'Fancy yazı tipleri',
    'about.page.ats.wrongItems.1': 'Tablolar, resimler',
    'about.page.ats.wrongItems.2': 'Karmaşık düzenlemeler',
    'about.page.aboutMe.title': 'Hakkımda',
    'about.page.aboutMe.description': 'Merhaba! Ben Aliee, bu uygulamayı geliştiren yazılım geliştiriciyim. Modern teknolojilerle kullanıcı dostu çözümler üretmeyi seviyorum. CV Maker, kişisel projelerimden biri olarak hayat buldu ve artık binlerce kişinin kariyer yolculuğuna yardımcı oluyor.',
    'about.page.aboutMe.visitWebsite': 'Web Sitemi Ziyaret Et',
    'about.page.footer.message': 'Umarım bu uygulama işinize yarar! ',
    'about.page.footer.signature': '— CvMaker.Aliee',
  },
  en: {
    // Navbar
    'nav.features': 'Features',
    'nav.templates': 'Templates',
    'nav.about': 'About Us',
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
    'features.badge': 'Why Us',
    'features.title': 'Why',
    'features.title.brand': 'CvMaker.Aliee',
    'features.subtitle': 'We redefine the professional CV creation experience with modern technology and user-friendly design',
    'features.fast.title': 'Completely Free',
    'features.fast.desc': 'Create unlimited CVs and get professional results without paying any fees.',
    'features.fast.badge': 'Free',
    'features.ats.title': 'ATS Compatible Design',
    'features.ats.desc': 'Optimized templates that can be easily read by application tracking systems.',
    'features.ats.badge': 'ATS Compatible',
    'features.pdf.title': 'Instant PDF Download',
    'features.pdf.desc': 'Download your CV in high-quality PDF format within seconds.',
    'features.pdf.badge': 'Instant',
    'features.ai.title': 'Professional Templates',
    'features.ai.desc': '5 different modern and classic design options suitable for every sector.',
    'features.ai.badge': '5 Templates',
    
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

    // About Page
    'about.hero.badge': 'About Us',
    'about.hero.title': 'The Future of Professional CVs',
    'about.hero.description': 'We redefine the professional CV creation experience with modern technology and user-friendly design. Make a difference in your career with ATS-compatible templates and AI-powered suggestions.',
    'about.features.title': 'Why CvMaker.Aliee?',
    'about.features.subtitle': 'We redefine the professional CV creation experience with modern technology and user-friendly design',
    'about.features.templates.title': '5 Professional Templates',
    'about.features.templates.description': 'Modern, classic, creative, professional and minimal designs with CV templates suitable for every sector.',
    'about.features.ats.title': 'ATS Compatible Design',
    'about.features.ats.description': 'Optimized templates that can be easily read by application tracking systems.',
    'about.features.fast.title': 'Instant PDF Download',
    'about.features.fast.description': 'Download your CV in high-quality PDF format within seconds.',
    'about.features.free.title': 'Completely Free',
    'about.features.free.description': 'Create unlimited CVs and get professional results without paying any fees.',
    'about.stats.templates': 'Templates',
    'about.stats.ats': 'ATS Compatible',
    'about.stats.support': 'Support',
    'about.stats.price': 'Free',
    'about.ats.benefits.title': 'ATS Benefits',
    'about.ats.benefits.keyword': 'Keyword optimization',
    'about.ats.benefits.format': 'Correct format and structure',
    'about.ats.benefits.speed': 'Fast scanning and reading',
    'about.ats.templates.title': 'Template Variety',
    'about.ats.templates.description': 'Suitable template option for every sector and position',
    'about.cta.title': 'Take the First Step for Your Career',
    'about.cta.description': 'Create a free account, build unlimited CVs',
    'about.cta.button': 'Get Started Free',
    'about.cta.templates': 'Explore Templates',
    'about.back': 'Back to Home',

    // About Page New Sections
    'about.page.hero.title': 'About the Project',
    'about.page.hero.description': 'I developed this platform myself so that people can create and download modern CVs quickly and effortlessly.',
    'about.page.why.title': 'Why Did I Make This Project?',
    'about.page.why.description': 'I know how important CV preparation is in career journey. However, most people struggle for hours in Word, face format issues, or need design knowledge to achieve a professional look. To solve this problem, I developed this platform. My goal is for everyone to create a free and professional CV in 5 minutes.',
    'about.page.ats.title': 'What is ATS Format?',
    'about.page.ats.description': 'ATS (Applicant Tracking System) are software that allow companies to automatically scan CVs. 75% of applications pass through ATS systems and CVs that are not in the appropriate format are eliminated.',
    'about.page.ats.correct': 'Correct Format',
    'about.page.ats.wrong': 'Wrong Format',
    'about.page.ats.correctItems.0': 'Standard fonts (Arial, Calibri)',
    'about.page.ats.correctItems.1': 'Keyword optimization',
    'about.page.ats.correctItems.2': 'Clean, organized structure',
    'about.page.ats.wrongItems.0': 'Fancy fonts',
    'about.page.ats.wrongItems.1': 'Tables, images',
    'about.page.ats.wrongItems.2': 'Complex layouts',
    'about.page.aboutMe.title': 'About Me',
    'about.page.aboutMe.description': 'Hello! I am Aliee, the software developer who developed this application. I love producing user-friendly solutions with modern technologies. CV Maker is one of my personal projects and now it helps thousands of people in their career journey.',
    'about.page.aboutMe.visitWebsite': 'Visit My Website',
    'about.page.footer.message': 'I hope this application works for you! ',
    'about.page.footer.signature': '— CvMaker.Aliee',
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
