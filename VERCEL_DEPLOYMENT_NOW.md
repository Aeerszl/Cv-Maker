# 🚀 VERCEL DEPLOYMENT - Adım Adım

## ✅ Şu Ana Kadar Hazır Olan:
- ✅ GitHub'a push edildi
- ✅ Build testi başarılı
- ✅ Secrets oluşturuldu
- ✅ Production ready!

---

## 📋 ŞİMDİ YAPILACAKLAR

### 1️⃣ MongoDB Atlas Setup (5 dakika)

**Adımlar:**
```
1. https://cloud.mongodb.com → Sign In
2. "Create" → "Build a Database"
3. FREE (M0) seç → Create
4. Username: cvmaker_user
5. Password: (güçlü şifre - KAYDET!)
6. Cloud Provider: AWS
7. Region: Frankfurt (eu-central-1)
8. Cluster Name: cv-maker-prod
9. "Create Cluster" → 2-3 dakika bekle
```

**Database User:**
```
1. Sol menü → Database Access
2. "Add New Database User"
3. Authentication: Password
4. Username: cvmaker_user
5. Password: (güçlü şifre oluştur ve KAYDET!)
6. Database User Privileges: "Read and write to any database"
7. "Add User"
```

**Network Access:**
```
1. Sol menü → Network Access
2. "Add IP Address"
3. "Allow Access from Anywhere" seç (0.0.0.0/0)
   ⚠️ Production'da Vercel IP'lerini eklemen daha güvenli
4. "Confirm"
```

**Connection String Al:**
```
1. Sol menü → Database → Connect
2. "Connect your application"
3. Driver: Node.js
4. Version: 6.8 or later
5. Connection string'i KOPYALA:

mongodb+srv://cvmaker_user:<password>@cv-maker-prod.xxxxx.mongodb.net/?retryWrites=true&w=majority

6. <password> yerine gerçek şifreni yaz
7. Son ekle: /cv-maker (database adı)

Final:
mongodb+srv://cvmaker_user:GERÇEK_ŞİFRE@cv-maker-prod.xxxxx.mongodb.net/cv-maker?retryWrites=true&w=majority
```

---

### 2️⃣ Resend API Key (2 dakika)

```
1. https://resend.com → Sign up
2. GitHub ile bağlan
3. Email'ini onayla
4. Dashboard → API Keys
5. "Create API Key"
6. Name: CV Maker Production
7. Permission: Full Access
8. "Create"
9. API Key'i KOPYALA (sadece bir kez gösterilir!)

re_xxxxxxxxxxxxxxxxxxxxx
```

---

### 3️⃣ Vercel'e Deploy (5 dakika)

**A) Vercel'e Giriş:**
```
1. https://vercel.com
2. "Sign Up" veya "Continue with GitHub"
3. GitHub hesabını authorize et
```

**B) Repository Import:**
```
1. Vercel Dashboard → "Add New" → "Project"
2. "Import Git Repository"
3. GitHub repo seç: Aeerszl/Cv-Maker
4. "Import" tıkla
```

**C) Project Ayarları:**
```
Framework Preset: Next.js (otomatik algılanır)
Root Directory: ./
Build Command: npm run build (default)
Output Directory: .next (default)
Install Command: npm install (default)

→ "Deploy" butonuna BASMA henüz!
```

**D) Environment Variables Ekle:**

`VERCEL_ENV_VARS.txt` dosyasındaki her satırı tek tek ekle:

```
Settings → Environment Variables

1. MONGODB_URI
   Value: (MongoDB connection string)
   Environment: Production ✓

2. NEXTAUTH_URL
   Value: https://cv-maker.vercel.app (şimdilik bunu yaz)
   Environment: Production ✓

3. NEXTAUTH_SECRET
   Value: t3jK94HbFfBN+ITVyUWu7BSPPJeohxtWpJAOUzm2CRA=
   Environment: Production ✓

4. JWT_SECRET
   Value: e5x+CCUoG7wH8d1Oz7zf2E79hI5a3Lr7Lxg1ktGxuII=
   Environment: Production ✓

5. RESEND_API_KEY
   Value: re_xxxxxxxxxxxxxxxxxxxxx
   Environment: Production ✓

6. EMAIL_FROM
   Value: onboarding@resend.dev
   Environment: Production ✓

7. NODE_ENV
   Value: production
   Environment: Production ✓
```

**E) Deploy!**
```
1. "Deploy" butonuna bas
2. 2-3 dakika bekle (build süreci)
3. ✅ Success!
```

---

### 4️⃣ NEXTAUTH_URL Güncelle

Deployment tamamlandıktan sonra:

```
1. Vercel domain'ini göreceksin:
   https://cv-maker-xxxxx.vercel.app

2. Settings → Environment Variables
3. NEXTAUTH_URL değişkenini bul
4. "Edit" → Gerçek URL'i yaz:
   https://cv-maker-xxxxx.vercel.app

5. "Save"
6. Deployments → Latest → "..." → "Redeploy"
```

---

## 🧪 Test Et!

### A) Siteyi Aç
```
https://cv-maker-xxxxx.vercel.app
```

### B) Sign Up Test
```
1. Sign Up sayfasına git
2. Email, şifre gir
3. Kayıt ol
4. Email geldi mi kontrol et
   ⚠️ Test domain kullanıyorsan sadece kendi email'ine gelir
5. Verification code gir
6. ✅ Dashboard'a yönlendirildin mi?
```

### C) CV Oluşturma Test
```
1. Dashboard → Create CV
2. Bilgileri doldur
3. Template seç
4. Save
5. PDF indir
6. ✅ Çalışıyor mu?
```

---

## 🎯 Başarılı Deployment Sonrası

### ✅ Çalışanlar:
- Site: https://cv-maker-xxxxx.vercel.app
- SSL: Otomatik aktif (Let's Encrypt)
- Database: MongoDB Atlas bağlı
- Email: Resend test domain (sadece sana gönderir)
- Analytics: Aktif
- Admin Panel: /admin/dashboard

### ⏳ Daha Sonra (Domain Aldıktan Sonra):
- Custom domain bağla (cvmaker.com)
- Resend'de domain doğrula
- Production email aktif (herkese gönderir)

---

## 🆘 Sorun Giderme

### Build Hatası:
```
Vercel → Deployments → Latest → View Function Logs
Hatayı oku ve düzelt
```

### Database Bağlanamıyor:
```
1. MONGODB_URI doğru mu?
2. IP whitelist var mı (0.0.0.0/0)?
3. User/password doğru mu?
```

### Email Gönderilmiyor:
```
1. RESEND_API_KEY doğru mu?
2. Test domain kullanıyorsan sadece kendi email'ine gider
3. Spam klasörünü kontrol et
```

### NextAuth Hatası:
```
1. NEXTAUTH_URL deployment URL'i ile aynı mı?
2. NEXTAUTH_SECRET var mı?
3. Cookies çalışıyor mu?
```

---

## 📊 Monitoring

### Vercel Dashboard:
```
- Analytics → Visitor stats
- Functions → API call stats
- Logs → Real-time logs
- Speed Insights → Performance
```

### MongoDB Atlas:
```
- Database → Collections
- Metrics → Storage usage
- Performance → Slow queries
```

---

## 💰 Maliyetler

| Servis | Plan | Maliyet |
|--------|------|---------|
| Vercel | Hobby | ÜCRETSİZ |
| MongoDB Atlas | M0 | ÜCRETSİZ (512MB) |
| Resend | Free | ÜCRETSİZ (3K email/ay) |
| **TOPLAM** | | **₺0/ay** ✨ |

---

## 🎉 BAŞARILI!

Site canlı: https://cv-maker-xxxxx.vercel.app

Domain almak istersen:
- GoDaddy.com
- Namecheap.com
- Vercel Domains

Domain aldıktan sonra:
1. Vercel → Settings → Domains → Add
2. DNS kayıtlarını güncelle
3. Resend'de domain doğrula
4. Production email aktif!

---

## 📞 Yardım

- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Resend: https://resend.com/docs

Bir sorun olursa bana sor! 💪
