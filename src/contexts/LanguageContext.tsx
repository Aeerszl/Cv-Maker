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
    
    // Templates
    'template.modern.description': 'İki sütun düzenli, temiz ve çağdaş tasarım',
    'template.modern.features.1': 'İki sütun düzen',
    'template.modern.features.2': 'Renk vurguları',
    'template.modern.features.3': 'İkon destekli',
    'template.modern.features.4': 'ATS uyumlu',
    'template.modern.preview': '📄 Modern, profesyonel görünüm',
    
    'template.classic.description': 'Geleneksel ve profesyonel tek sütun düzeni',
    'template.classic.features.1': 'Tek sütun',
    'template.classic.features.2': 'Sade tasarım',
    'template.classic.features.3': 'Kolay okunur',
    'template.classic.features.4': 'Evrensel',
    'template.classic.preview': '📋 Klasik, güvenilir tasarım',
    
    'template.creative.description': 'Yaratıcı pozisyonlar için özgün tasarım',
    'template.creative.features.1': 'Yan panel',
    'template.creative.features.2': 'Grafik elemanlar',
    'template.creative.features.3': 'Dikkat çekici',
    'template.creative.features.4': 'Renkli',
    'template.creative.preview': '🎨 Yaratıcı, farklı görünüm',
    
    'template.professional.description': 'Kurumsal pozisyonlar için ciddi tasarım',
    'template.professional.features.1': 'Klasik düzen',
    'template.professional.features.2': 'Net bölümler',
    'template.professional.features.3': 'ATS optimize',
    'template.professional.features.4': 'Kurumsal',
    'template.professional.preview': '💼 Kurumsal, güçlü görünüm',
    
    'template.minimal.description': 'Sade ve şık minimalist tasarım',
    'template.minimal.features.1': 'Minimalist',
    'template.minimal.features.2': 'Bol beyaz alan',
    'template.minimal.features.3': 'Okunabilir',
    'template.minimal.features.4': 'Zarif',
    'template.minimal.preview': '✨ Minimal, zarif görünüm',

    // ATS Info
    'atsInfo.title': 'ATS Uyumluluk Nedir?',
    'atsInfo.description': 'ATS (Applicant Tracking System - Başvuru Takip Sistemi), şirketlerin CV\'leri otomatik olarak taramasına olanak tanır. Tüm şablonlarımız bu sistemler tarafından kolayca okunabilecek şekilde tasarlanmıştır, böylece başvurunuzun insan kaynakları departmanına ulaşma şansı artar.',
    'atsInfo.badge1': 'Anahtar Kelime Optimizasyonu',
    'atsInfo.badge2': 'Standart Format',
    'atsInfo.badge3': 'Hızlı Tarama',
    
    // Dashboard
    'dashboard.title': 'Ana Sayfa',
    'dashboard.subtitle': 'CV\'lerinizi yönetin ve düzenleyin',
    'dashboard.totalCvs': 'Toplam CV',
    'dashboard.completed': 'Tamamlanan',
    'dashboard.lastUpdate': 'Son Güncelleme',
    'dashboard.createNew': 'Yeni CV Oluştur',
    'dashboard.newBadge': 'Yeni',
    'dashboard.cvTips.title': 'İyi Bir CV\'de Neler Olmalı?',
    'dashboard.cvTips.subtitle': 'Profesyonel bir CV hazırlarken dikkat etmeniz gereken önemli noktalar',
    'dashboard.emptyState.title': 'Henüz CV\'niz yok',
    'dashboard.emptyState.subtitle': 'ATS uyumlu şablonlarımızla dakikalar içinde etkileyici bir CV hazırlayın.',
    'dashboard.emptyState.count': 'Şu ana kadar {count} CV oluşturdunuz.',
    'dashboard.cta.title': 'Profesyonel CV\'nizi Oluşturun',
    'dashboard.cta.description': 'ATS uyumlu şablonlarımızla dakikalar içinde etkileyici bir CV hazırlayın.',
    'dashboard.cta.descriptionWithCount': 'Şu ana kadar {count} CV oluşturdunuz.',
    'dashboard.cta.button': 'Yeni CV Oluştur',
    
    // CV Tips
    'cvTips.1.title': 'Net ve Öz Olun',
    'cvTips.1.description': 'CV\'niz 1-2 sayfa arasında olmalı. Gereksiz detaylardan kaçının ve önemli bilgilere odaklanın.',
    'cvTips.2.title': 'İş İlanına Uygun',
    'cvTips.2.description': 'Her pozisyon için CV\'nizi özelleştirin. İlgili becerileri ve deneyimleri öne çıkarın.',
    'cvTips.3.title': 'ATS Uyumlu Format',
    'cvTips.3.description': 'Başvuru sistemleri CV\'nizi okuyabilmeli. Standart başlıklar ve düzenli formatlar kullanın.',
    'cvTips.4.title': 'Başarılarınızı Ölçün',
    'cvTips.4.description': 'Sayılarla desteklenmiş başarılar ekleyin. "Satışları %30 artırdım" gibi somut örnekler verin.',
    'cvTips.5.title': 'Anahtar Kelimeler',
    'cvTips.5.description': 'İş ilanındaki anahtar kelimeleri CV\'nize dahil edin. Bu, sistemler tarafından fark edilmenizi sağlar.',
    'cvTips.6.title': 'İletişim Bilgileri',
    'cvTips.6.description': 'Güncel telefon, e-posta ve LinkedIn profilinizi ekleyin. Profesyonel bir e-posta adresi kullanın.',
    'cvTips.7.title': 'Eğitim ve Sertifikalar',
    'cvTips.7.description': 'Mezuniyet bilgilerinizi, önemli sertifikalarınızı ve eğitim programlarınızı belirtin.',
    'cvTips.8.title': 'İş Deneyimi',
    'cvTips.8.description': 'Son pozisyondan başlayarak çalışma geçmişinizi kronolojik sırayla listeleyin.',
    'cvTips.9.title': 'Teknik Beceriler',
    'cvTips.9.description': 'Yazılım, diller ve araçlar gibi teknik yeteneklerinizi belirtin. Sadece yetkin olduklarınızı ekleyin.',
    'cvTips.10.title': 'Dil Becerileri',
    'cvTips.10.description': 'Yabancı dil seviyelerinizi açıkça belirtin. Sertifikalar varsa ekleyin.',
    'cvTips.11.title': 'Temiz Tasarım',
    'cvTips.11.description': 'Okunması kolay, profesyonel ve düzenli bir görünüm sağlayın.',
    'cvTips.12.title': 'Hatasız İçerik',
    'cvTips.12.description': 'Yazım hatalarını kontrol edin. CV\'nizi birkaç kişiye okutun ve geri bildirim alın.',

    // CV Builder Steps
    'cvBuilder.steps.personal': 'Kişisel Bilgiler',
    'cvBuilder.steps.summary': 'Özet',
    'cvBuilder.steps.experience': 'İş Deneyimi',
    'cvBuilder.steps.education': 'Eğitim',
    'cvBuilder.steps.skills': 'Yetenekler',
    'cvBuilder.steps.projects': 'Projeler',
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
    'cvBuilder.experience.company': 'Şirket',
    'cvBuilder.experience.companyPlaceholder': 'Şirket adı',
    'cvBuilder.experience.position': 'Pozisyon',
    'cvBuilder.experience.positionPlaceholder': 'Pozisyon adı',
    'cvBuilder.experience.startDate': 'Başlangıç Tarihi',
    'cvBuilder.experience.endDate': 'Bitiş Tarihi',
    'cvBuilder.experience.current': 'Hala bu pozisyonda çalışıyorum',
    'cvBuilder.experience.description': 'Açıklama',
    'cvBuilder.experience.descriptionPlaceholder': 'Görev ve sorumluluklarınızı açıklayın...',
    'cvBuilder.experience.delete': 'Sil',
    'cvBuilder.experience.addAnother': 'Başka İş Deneyimi Ekle',

    // Education
    'cvBuilder.education.title': 'Eğitim',
    'cvBuilder.education.empty': 'Henüz eğitim bilgisi eklenmedi',
    'cvBuilder.education.add': 'Eğitim Ekle',
    'cvBuilder.education.school': 'Okul',
    'cvBuilder.education.schoolPlaceholder': 'Üniversite/okul adı',
    'cvBuilder.education.degree': 'Derece',
    'cvBuilder.education.degreeSelect': 'Derece Seçin',
    'cvBuilder.education.degree.highSchool': 'Lise',
    'cvBuilder.education.degree.associate': 'Ön Lisans',
    'cvBuilder.education.degree.bachelor': 'Lisans',
    'cvBuilder.education.degree.master': 'Yüksek Lisans',
    'cvBuilder.education.degree.phd': 'Doktora',
    'cvBuilder.education.degree.other': 'Diğer',
    'cvBuilder.education.field': 'Bölüm',
    'cvBuilder.education.fieldPlaceholder': 'Bilgisayar Mühendisliği, vb.',
    'cvBuilder.education.gpa': 'Not Ortalaması',
    'cvBuilder.education.gpaPlaceholder': '3.5/4.0',
    'cvBuilder.education.startDate': 'Başlangıç Tarihi',
    'cvBuilder.education.endDate': 'Mezuniyet Tarihi',
    'cvBuilder.education.current': 'Hala bu eğitim kurumundayım',
    'cvBuilder.education.delete': 'Sil',
    'cvBuilder.education.addAnother': 'Başka Eğitim Bilgisi Ekle',

    // Skills
    'cvBuilder.skills.title': 'Yetenekler & Diller',
    'cvBuilder.skills.empty': 'Henüz yetenek eklenmedi',
    'cvBuilder.skills.add': 'Yetenek Ekle',
    'cvBuilder.skills.name': 'Yetenek Adı',
    'cvBuilder.skills.namePlaceholder': 'JavaScript, Python, vb.',
    'cvBuilder.skills.years': 'Deneyim (Yıl)',
    'cvBuilder.skills.yearsPlaceholder': 'Örn: 3',
    'cvBuilder.skills.delete': 'Sil',
    'cvBuilder.skills.addAnother': 'Başka Yetenek Ekle',
    'cvBuilder.skills.languages': 'Dil Bilgileri',
    'cvBuilder.skills.languagesEmpty': 'Henüz dil bilgisi eklenmedi',
    'cvBuilder.skills.languageAdd': 'Dil Ekle',
    'cvBuilder.skills.languageName': 'Dil',
    'cvBuilder.skills.languageNamePlaceholder': 'İngilizce, Almanca, vb.',
    'cvBuilder.skills.languageLevel': 'Seviye',
    'cvBuilder.skills.languageLevel.basic': 'Temel',
    'cvBuilder.skills.languageLevel.intermediate': 'Orta',
    'cvBuilder.skills.languageLevel.fluent': 'Akıcı',
    'cvBuilder.skills.languageLevel.native': 'Anadil',
    'cvBuilder.skills.languageDelete': 'Sil',
    'cvBuilder.skills.languageAddAnother': 'Başka Dil Ekle',

    // Projects
    'cvBuilder.projects.title': 'Projeler',
    'cvBuilder.projects.empty': 'Henüz proje eklenmedi',
    'cvBuilder.projects.add': 'Proje Ekle',
    'cvBuilder.projects.projectTitle': 'Proje Başlığı',
    'cvBuilder.projects.projectTitlePlaceholder': 'E-Ticaret Sitesi, vb.',
    'cvBuilder.projects.description': 'Açıklama',
    'cvBuilder.projects.descriptionPlaceholder': 'Proje hakkında kısa açıklama...',
    'cvBuilder.projects.link': 'Website Linki (Opsiyonel)',
    'cvBuilder.projects.linkPlaceholder': 'https://myproject.com',
    'cvBuilder.projects.github': 'GitHub Linki (Opsiyonel)',
    'cvBuilder.projects.githubPlaceholder': 'https://github.com/username/project',
    'cvBuilder.projects.delete': 'Sil',
    'cvBuilder.projects.addAnother': 'Başka Proje Ekle',

    // Preview
    'cvBuilder.preview.title': 'CV Önizleme',
    'cvBuilder.preview.subtitle': 'CV\'niz',
    'cvBuilder.preview.subtitleEnd': 'şablonu ile nasıl görünüyor? Kaydetmeden önce kontrol edin.',

    // Validation Messages
    'cvBuilder.validation.nameRequired': 'Ad ve soyad zorunludur',
    'cvBuilder.validation.titleRequired': 'Meslek unvanı zorunludur',
    'cvBuilder.validation.emailRequired': 'Email adresi zorunludur',
    'cvBuilder.validation.phoneRequired': 'Telefon numarası zorunludur',
    'cvBuilder.validation.cityRequired': 'Şehir zorunludur',
    'cvBuilder.validation.summaryRequired': 'Profesyonel özet zorunludur. Lütfen kendinizi tanıtın.',
    'cvBuilder.validation.educationRequired': 'En az bir eğitim bilgisi eklemelisiniz',
    'cvBuilder.validation.educationIncomplete': 'Eğitim bilgileri eksik: Okul, derece, bölüm ve başlangıç tarihi zorunludur',
    'cvBuilder.validation.skillsRequired': 'En az bir yetenek eklemelisiniz',
    'cvBuilder.validation.skillsIncomplete': 'Yetenek bilgileri eksik: Yetenek adı zorunludur',
    'cvBuilder.validation.experienceIncomplete': 'İş deneyimi bilgileri eksik: Şirket, pozisyon ve başlangıç tarihi zorunludur',

    // Template Selector
    'templateSelector.atsInfo.title': 'Tüm Templateler %90+ ATS Uyumlu',
    'templateSelector.atsInfo.description': '9 template de ATS sistemleri tarafından kolayca okunabilir formatta optimize edilmiştir. Grid layoutlar modern ATS sistemleri tarafından %85-95 başarıyla işlenir.',

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
    'about.page.hero.description': 'İş başvuru sürecini kolaylaştırmak amacıyla bu CV oluşturma platformunu geliştirdim. Platform, kullanıcıların kişisel bilgilerini, deneyimlerini ve yeteneklerini girerek ATS (Applicant Tracking System) uyumlu 5 farklı profesyonel CV şablonu arasından seçim yapmasına olanak tanıyor. Tüm hizmetler tamamen ücretsiz ve kullanımı son derece basit.',
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
    'hero.title1': 'Professional and Free',
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
    
    // Templates
    'template.modern.description': 'Clean and modern two-column design',
    'template.modern.features.1': 'Two-column layout',
    'template.modern.features.2': 'Color highlights',
    'template.modern.features.3': 'Icon support',
    'template.modern.features.4': 'ATS friendly',
    'template.modern.preview': '📄 Modern, professional look',
    
    'template.classic.description': 'Traditional and professional single-column layout',
    'template.classic.features.1': 'Single column',
    'template.classic.features.2': 'Clean design',
    'template.classic.features.3': 'Easy to read',
    'template.classic.features.4': 'Universal',
    'template.classic.preview': '📋 Classic, reliable design',
    
    'template.creative.description': 'Unique design for creative positions',
    'template.creative.features.1': 'Side panel',
    'template.creative.features.2': 'Graphic elements',
    'template.creative.features.3': 'Eye-catching',
    'template.creative.features.4': 'Colorful',
    'template.creative.preview': '🎨 Creative, distinctive look',
    
    'template.professional.description': 'Serious design for corporate positions',
    'template.professional.features.1': 'Classic layout',
    'template.professional.features.2': 'Clear sections',
    'template.professional.features.3': 'ATS optimized',
    'template.professional.features.4': 'Corporate',
    'template.professional.preview': '💼 Corporate, strong look',
    
    'template.minimal.description': 'Clean and elegant minimalist design',
    'template.minimal.features.1': 'Minimalist',
    'template.minimal.features.2': 'Plenty of white space',
    'template.minimal.features.3': 'Readable',
    'template.minimal.features.4': 'Elegant',
    'template.minimal.preview': '✨ Minimal, elegant look',

    // ATS Info
    'atsInfo.title': 'What is ATS Compatibility?',
    'atsInfo.description': 'ATS (Applicant Tracking System) allows companies to automatically scan CVs. All our templates are designed to be easily readable by these systems, thus increasing the chance of your application reaching human resources.',
    'atsInfo.badge1': 'Keyword Optimization',
    'atsInfo.badge2': 'Standard Format',
    'atsInfo.badge3': 'Fast Scanning',
    
    // Dashboard
    'dashboard.title': 'Home',
    'dashboard.subtitle': 'Manage and edit your CVs',
    'dashboard.totalCvs': 'Total CVs',
    'dashboard.completed': 'Completed',
    'dashboard.lastUpdate': 'Last Update',
    'dashboard.createNew': 'Create New CV',
    'dashboard.newBadge': 'New',
    'dashboard.cvTips.title': 'What Should Be in a Good CV?',
    'dashboard.cvTips.subtitle': 'Important points to consider when preparing a professional CV',
    'dashboard.emptyState.title': 'You don\'t have any CVs yet',
    'dashboard.emptyState.subtitle': 'Prepare an impressive CV in minutes with our ATS-compatible templates.',
    'dashboard.emptyState.count': 'You have created {count} CVs so far.',
    'dashboard.cta.title': 'Create Your Professional CV',
    'dashboard.cta.description': 'Prepare an impressive CV in minutes with our ATS-compatible templates.',
    'dashboard.cta.descriptionWithCount': 'You have created {count} CVs so far.',
    'dashboard.cta.button': 'Create New CV',
    
    // CV Tips
    'cvTips.1.title': 'Be Clear and Concise',
    'cvTips.1.description': 'Your CV should be between 1-2 pages. Avoid unnecessary details and focus on important information.',
    'cvTips.2.title': 'Tailor to Job Posting',
    'cvTips.2.description': 'Customize your CV for each position. Highlight relevant skills and experiences.',
    'cvTips.3.title': 'ATS-Friendly Format',
    'cvTips.3.description': 'Application systems should be able to read your CV. Use standard headings and organized formats.',
    'cvTips.4.title': 'Measure Your Achievements',
    'cvTips.4.description': 'Add achievements supported by numbers. Give concrete examples like "increased sales by 30%".',
    'cvTips.5.title': 'Keywords',
    'cvTips.5.description': 'Include keywords from the job posting in your CV. This helps you get noticed by systems.',
    'cvTips.6.title': 'Contact Information',
    'cvTips.6.description': 'Add your current phone, email and LinkedIn profile. Use a professional email address.',
    'cvTips.7.title': 'Education and Certifications',
    'cvTips.7.description': 'Specify your graduation information, important certifications and training programs.',
    'cvTips.8.title': 'Work Experience',
    'cvTips.8.description': 'List your work history chronologically, starting from the most recent position.',
    'cvTips.9.title': 'Technical Skills',
    'cvTips.9.description': 'Specify your technical abilities such as software, languages and tools. Only add what you are proficient in.',
    'cvTips.10.title': 'Language Skills',
    'cvTips.10.description': 'Clearly specify your foreign language proficiency levels. Add certificates if you have any.',
    'cvTips.11.title': 'Clean Design',
    'cvTips.11.description': 'Provide an easy-to-read, professional and organized appearance.',
    'cvTips.12.title': 'Error-Free Content',
    'cvTips.12.description': 'Check for spelling errors. Have several people read your CV and get feedback.',

    // CV Builder Steps
    'cvBuilder.steps.personal': 'Personal Information',
    'cvBuilder.steps.summary': 'Summary',
    'cvBuilder.steps.experience': 'Work Experience',
    'cvBuilder.steps.education': 'Education',
    'cvBuilder.steps.skills': 'Skills',
    'cvBuilder.steps.projects': 'Projects',
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
    'cvBuilder.experience.company': 'Company',
    'cvBuilder.experience.companyPlaceholder': 'Company name',
    'cvBuilder.experience.position': 'Position',
    'cvBuilder.experience.positionPlaceholder': 'Job title',
    'cvBuilder.experience.startDate': 'Start Date',
    'cvBuilder.experience.endDate': 'End Date',
    'cvBuilder.experience.current': 'I currently work here',
    'cvBuilder.experience.description': 'Description',
    'cvBuilder.experience.descriptionPlaceholder': 'Describe your duties and responsibilities...',
    'cvBuilder.experience.delete': 'Delete',
    'cvBuilder.experience.addAnother': 'Add Another Experience',

    // Education
    'cvBuilder.education.title': 'Education',
    'cvBuilder.education.empty': 'No education information added yet',
    'cvBuilder.education.add': 'Add Education',
    'cvBuilder.education.school': 'School',
    'cvBuilder.education.schoolPlaceholder': 'University/school name',
    'cvBuilder.education.degree': 'Degree',
    'cvBuilder.education.degreeSelect': 'Select Degree',
    'cvBuilder.education.degree.highSchool': 'High School',
    'cvBuilder.education.degree.associate': 'Associate',
    'cvBuilder.education.degree.bachelor': 'Bachelor',
    'cvBuilder.education.degree.master': 'Master',
    'cvBuilder.education.degree.phd': 'PhD',
    'cvBuilder.education.degree.other': 'Other',
    'cvBuilder.education.field': 'Field of Study',
    'cvBuilder.education.fieldPlaceholder': 'Computer Engineering, etc.',
    'cvBuilder.education.gpa': 'GPA',
    'cvBuilder.education.gpaPlaceholder': '3.5/4.0',
    'cvBuilder.education.startDate': 'Start Date',
    'cvBuilder.education.endDate': 'Graduation Date',
    'cvBuilder.education.current': 'I currently study here',
    'cvBuilder.education.delete': 'Delete',
    'cvBuilder.education.addAnother': 'Add Another Education',

    // Skills
    'cvBuilder.skills.title': 'Skills & Languages',
    'cvBuilder.skills.empty': 'No skills added yet',
    'cvBuilder.skills.add': 'Add Skill',
    'cvBuilder.skills.name': 'Skill Name',
    'cvBuilder.skills.namePlaceholder': 'JavaScript, Python, etc.',
    'cvBuilder.skills.years': 'Experience (Years)',
    'cvBuilder.skills.yearsPlaceholder': 'e.g. 3',
    'cvBuilder.skills.delete': 'Delete',
    'cvBuilder.skills.addAnother': 'Add Another Skill',
    'cvBuilder.skills.languages': 'Language Skills',
    'cvBuilder.skills.languagesEmpty': 'No languages added yet',
    'cvBuilder.skills.languageAdd': 'Add Language',
    'cvBuilder.skills.languageName': 'Language',
    'cvBuilder.skills.languageNamePlaceholder': 'English, German, etc.',
    'cvBuilder.skills.languageLevel': 'Level',
    'cvBuilder.skills.languageLevel.basic': 'Basic',
    'cvBuilder.skills.languageLevel.intermediate': 'Intermediate',
    'cvBuilder.skills.languageLevel.fluent': 'Fluent',
    'cvBuilder.skills.languageLevel.native': 'Native',
    'cvBuilder.skills.languageDelete': 'Delete',
    'cvBuilder.skills.languageAddAnother': 'Add Another Language',

    // Projects
    'cvBuilder.projects.title': 'Projects',
    'cvBuilder.projects.empty': 'No projects added yet',
    'cvBuilder.projects.add': 'Add Project',
    'cvBuilder.projects.projectTitle': 'Project Title',
    'cvBuilder.projects.projectTitlePlaceholder': 'E-Commerce Website, etc.',
    'cvBuilder.projects.description': 'Description',
    'cvBuilder.projects.descriptionPlaceholder': 'Brief description about the project...',
    'cvBuilder.projects.link': 'Website Link (Optional)',
    'cvBuilder.projects.linkPlaceholder': 'https://myproject.com',
    'cvBuilder.projects.github': 'GitHub Link (Optional)',
    'cvBuilder.projects.githubPlaceholder': 'https://github.com/username/project',
    'cvBuilder.projects.delete': 'Delete',
    'cvBuilder.projects.addAnother': 'Add Another Project',

    // Preview
    'cvBuilder.preview.title': 'CV Preview',
    'cvBuilder.preview.subtitle': 'How does your CV look with the',
    'cvBuilder.preview.subtitleEnd': 'template? Check before saving.',

    // Validation Messages
    'cvBuilder.validation.nameRequired': 'First name and last name are required',
    'cvBuilder.validation.titleRequired': 'Job title is required',
    'cvBuilder.validation.emailRequired': 'Email address is required',
    'cvBuilder.validation.phoneRequired': 'Phone number is required',
    'cvBuilder.validation.cityRequired': 'City is required',
    'cvBuilder.validation.summaryRequired': 'Professional summary is required. Please introduce yourself.',
    'cvBuilder.validation.educationRequired': 'You must add at least one education entry',
    'cvBuilder.validation.educationIncomplete': 'Education information incomplete: School, degree, field and start date are required',
    'cvBuilder.validation.skillsRequired': 'You must add at least one skill',
    'cvBuilder.validation.skillsIncomplete': 'Skills information incomplete: Skill name is required',
    'cvBuilder.validation.experienceIncomplete': 'Work experience information incomplete: Company, position and start date are required',

    // Template Selector
    'templateSelector.atsInfo.title': 'All Templates 90%+ ATS Compatible',
    'templateSelector.atsInfo.description': 'All 9 templates are optimized in an easily readable format by ATS systems. Grid layouts are successfully processed by modern ATS systems with 85-95% accuracy.',

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
    'about.page.hero.description': 'I developed this CV creation platform to simplify the job application process. The platform allows users to enter their personal information, experiences, and skills to choose from 5 different professional CV templates that are compatible with ATS (Applicant Tracking System). All services are completely free and extremely easy to use.',
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
