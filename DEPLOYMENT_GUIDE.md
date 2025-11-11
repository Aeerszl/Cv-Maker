# 🚀 CV Maker - Deployment Guide

## 📋 Pre-Deployment Checklist

### 1️⃣ Resend Setup (Email Service)

#### A) Resend Hesabı Oluştur
1. https://resend.com adresine git
2. Sign up yap (GitHub ile bağlan)
3. Email'ini onayla

#### B) API Key Al
1. Dashboard → API Keys
2. "Create API Key" tıkla
3. Name: `CV Maker Production`
4. Permissions: `Full Access` (sending emails only)
5. **API Key'i kopyala** (sadece bir kez gösterilir!)
   ```
   re_xxxxxxxxxxxxxxxxxxxxx
   ```

#### C) Domain Ekle (Önerilen - Production için)

**Option 1: Kendi Domain'in Varsa**
```
1. Resend → Domains → Add Domain
2. Domain gir: cvmaker.com
3. DNS Kayıtları:
   
   Type: TXT
   Name: @
   Value: v=spf1 include:_spf.resend.com ~all
   
   Type: CNAME
   Name: resend._domainkey
   Value: resend._domainkey.resend.com
   
4. Verify Domain (5-10 dakika)
5. Sender email: noreply@cvmaker.com
```

**Option 2: Test Domain (Hızlı Başlangıç)**
```
- Resend test domain kullan
- Sadece kendi email'ine gönderebilirsin
- Sender: onboarding@resend.dev
```

---

### 2️⃣ MongoDB Atlas Setup (Database)

#### A) MongoDB Atlas Hesabı
1. https://cloud.mongodb.com
2. Sign up / Login
3. Create Free Cluster (M0 - 512MB ücretsiz)

#### B) Database Setup
```
1. Cluster Name: cv-maker-prod
2. Cloud Provider: AWS
3. Region: eu-central-1 (Frankfurt - Türkiye'ye yakın)
4. Cluster Tier: M0 (Free)
```

#### C) Database User Oluştur
```
1. Database Access → Add New Database User
2. Username: cvmaker_user
3. Password: (güçlü şifre oluştur - kaydet!)
4. Database User Privileges: Read and write to any database
```

#### D) Network Access
```
1. Network Access → Add IP Address
2. SELECT: "Allow Access from Anywhere" (0.0.0.0/0)
   ⚠️ Production'da Vercel IP'lerini ekle
```

#### E) Connection String Al
```
1. Cluster → Connect → Connect your application
2. Driver: Node.js, Version: 6.8 or later
3. Connection string'i kopyala:

mongodb+srv://cvmaker_user:<password>@cv-maker-prod.xxxxx.mongodb.net/?retryWrites=true&w=majority

4. <password> yerine gerçek şifreyi yaz
5. Database adı ekle:

mongodb+srv://cvmaker_user:YOUR_PASSWORD@cv-maker-prod.xxxxx.mongodb.net/cv-maker?retryWrites=true&w=majority
```

---

### 3️⃣ Environment Variables (Production)

Vercel'de bu değişkenleri ekleyeceğiz:

```bash
# Database
MONGODB_URI=mongodb+srv://cvmaker_user:YOUR_PASSWORD@cv-maker-prod.xxxxx.mongodb.net/cv-maker?retryWrites=true&w=majority

# Authentication
NEXTAUTH_URL=https://cv-maker.vercel.app  # Vercel domain
NEXTAUTH_SECRET=openssl rand -base64 32 ile üret  # Yeni secret
JWT_SECRET=openssl rand -base64 32 ile üret

# Email Service
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@cvmaker.com  # Domain'in varsa

# Environment
NODE_ENV=production
```

---

## 🚀 Vercel Deployment

### Adım 1: Vercel Hesabı
```
1. https://vercel.com
2. Sign up with GitHub
3. GitHub hesabını bağla
```

### Adım 2: GitHub Repository Bağla
```
1. Vercel Dashboard → Add New Project
2. Import Git Repository
3. Seç: Aeerszl/Cv-Maker
4. Import tıkla
```

### Adım 3: Project Settings
```
Framework Preset: Next.js (otomatik algılar)
Root Directory: ./
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### Adım 4: Environment Variables Ekle
```
1. Environment Variables sekmesini aç
2. Yukarıdaki tüm değişkenleri ekle
3. Environment: Production (tümü için)
```

### Adım 5: Deploy!
```
1. "Deploy" butonuna bas
2. 2-3 dakika bekle
3. ✅ Deployment başarılı!
```

---

## 🌐 Domain Bağlama

### Option A: Vercel Üzerinden Domain Al
```
1. Vercel → Project → Domains
2. Buy Domain → cvmaker.com ara
3. Satın al (otomatik bağlanır)
```

### Option B: Mevcut Domain'i Bağla
```
1. Vercel → Project → Domains → Add
2. Domain gir: cvmaker.com
3. DNS Kayıtlarını Güncelle:

   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME  
   Name: www
   Value: cname.vercel-dns.com

4. Save & Verify
5. SSL otomatik kurulur (Let's Encrypt)
```

---

## 🔧 Post-Deployment

### 1. Test Et
```bash
# Email Testi
1. Sign up yap
2. Email geldi mi kontrol et
3. Verification code çalışıyor mu

# CV Oluşturma
1. CV oluştur
2. PDF indir
3. Template'ler çalışıyor mu

# Admin Panel
1. Admin kullanıcı oluştur
2. /admin/dashboard erişimi var mı
3. Analytics çalışıyor mu
```

### 2. Monitoring
```
Vercel Dashboard:
- Analytics
- Function Logs
- Error Reports
- Performance Metrics
```

### 3. Domain + Resend Sync
```
1. Resend'de domain doğrulandı mı kontrol et
2. Production email'leri test et
3. SPF/DKIM DNS kayıtları doğru mu
```

---

## 💰 Aylık Maliyetler

| Servis | Free Tier | Ücretli Plan |
|--------|-----------|--------------|
| **Vercel** | ✅ Unlimited (Hobby) | Pro: $20/ay |
| **MongoDB Atlas** | ✅ 512MB Free | Shared: $9/ay |
| **Resend** | ✅ 3,000 email/ay | $20/ay (50K email) |
| **Domain** | - | $10-15/yıl |

**Başlangıç:** %100 ÜCRETSİZ! ✨

---

## 🆘 Troubleshooting

### Email Gönderilmiyor
```
1. RESEND_API_KEY doğru mu?
2. Domain doğrulandı mı?
3. Vercel logs kontrol et: vercel logs
```

### Database Bağlantı Hatası
```
1. MONGODB_URI doğru mu?
2. IP whitelist ayarı var mı (0.0.0.0/0)?
3. User/password doğru mu?
```

### Build Hatası
```
1. Local'de build al: npm run build
2. Typescript hataları var mı: npm run type-check
3. Dependencies güncel mi: npm install
```

---

## 📞 Support

- Vercel Docs: https://vercel.com/docs
- Resend Docs: https://resend.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com

---

## ✅ Final Checklist

- [ ] Resend API key alındı
- [ ] MongoDB Atlas cluster oluşturuldu
- [ ] Environment variables hazır
- [ ] GitHub repository güncel
- [ ] Vercel'e deploy edildi
- [ ] Domain bağlandı (opsiyonel)
- [ ] Email testi yapıldı
- [ ] CV oluşturma testi yapıldı
- [ ] Admin panel erişimi var

🎉 **Deployment Tamamlandı!**
