# 📧 Production Email Kurulum Rehberi

Bu dosya, uygulamanızı yayınlarken email sistemini nasıl kuracağınızı açıklar.

## 🎯 Gereksinimler

Uygulamanız tüm kullanıcılara email gönderebilmesi için **kendi domain'inizi** Resend'e eklemeniz gerekiyor.

---

## 🚀 Adım Adım Kurulum

### 1️⃣ Domain Sahibi Olun

Eğer yoksa bir domain satın alın:
- **Namecheap** (ucuz): ~$10/yıl
- **GoDaddy**: ~$15/yıl  
- **Cloudflare**: ~$10/yıl

Örnek domain: `cvmaker.com`, `mycvbuilder.com`, vs.

---

### 2️⃣ Resend'de Domain Ekleyin

1. **https://resend.com/domains** adresine gidin
2. **"Add Domain"** butonuna tıklayın
3. Domain'inizi girin (örn: `cvmaker.com`)
4. **Continue** tıklayın

---

### 3️⃣ DNS Kayıtlarını Ekleyin

Resend size 3 DNS kaydı verecek:

#### SPF Kaydı
```
Type: TXT
Name: @
Value: v=spf1 include:spf.resend.com ~all
```

#### DKIM Kaydı
```
Type: TXT
Name: resend._domainkey
Value: [Resend'in verdiği uzun değer]
```

#### DMARC Kaydı (Opsiyonel ama önerilen)
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none
```

**Bu kayıtları domain sağlayıcınızda ekleyin:**
- GoDaddy → DNS Management → Add Record
- Namecheap → Advanced DNS → Add New Record
- Cloudflare → DNS → Add Record

---

### 4️⃣ Doğrulamayı Bekleyin

- DNS kayıtlarının yayılması **5-30 dakika** sürebilir
- Resend otomatik olarak kontrol edecek
- ✅ Domain doğrulandığında email alacaksınız

---

### 5️⃣ .env Dosyasını Güncelleyin

`.env.production` veya production ortamınızda:

```bash
# Production Email
EMAIL_FROM=CvMaker <noreply@cvmaker.com>

# Resend API Key (aynı kalacak)
RESEND_API_KEY=re_aTEwiFPA_EGHEobSXmrJV8zg7yDhibhYs
```

**Önemli:** `noreply@cvmaker.com` kısmını kendi domain'inizle değiştirin!

---

## 🧪 Test Etme

Domain doğrulandıktan sonra:

1. Uygulamanızı production'a deploy edin
2. Herhangi bir email ile kayıt olun
3. ✅ Email gelmeli!

---

## 🔒 Güvenlik İpuçları

### API Key Güvenliği
- ❌ `.env` dosyasını Git'e eklemeyin (`.gitignore`'da olmalı)
- ✅ Production'da environment variables kullanın
- ✅ Vercel/Railway/Heroku'da "Environment Variables" bölümünden ekleyin

### Domain Güvenliği
- DMARC politikasını `p=quarantine` veya `p=reject` yapın
- SPF kaydını doğru ekleyin
- DKIM kaydını mutlaka ekleyin

---

## 📊 Deployment Platformları

### Vercel
```bash
vercel env add EMAIL_FROM
# Değer: noreply@cvmaker.com
```

### Railway
1. Dashboard → Variables
2. `EMAIL_FROM=noreply@cvmaker.com` ekleyin

### Heroku
```bash
heroku config:set EMAIL_FROM=noreply@cvmaker.com
```

---

## 💡 Alternatif: Domain Yoksa

Eğer domain alamıyorsanız, geçici olarak:

1. **Resend'de email ekleyin:**
   - https://resend.com/emails
   - "Add Email" tıklayın
   - Test etmek istediğiniz emaili ekleyin
   - Doğrulayın
   - Sadece o adrese mail gidecek (sınırlı)

2. **Gmail SMTP kullanın:** (Önerilmez - günlük limit var)
   - Nodemailer + Gmail
   - Günde 500 email limiti

---

## ❓ Sık Sorulan Sorular

### Q: Domain olmadan production'a geçebilir miyim?
A: Hayır. Resend test domain'i sadece doğrulanmış emaillere gönderir. Tüm kullanıcılara email için kendi domain'iniz olmalı.

### Q: Domain maliyeti nedir?
A: Yıllık ~$10-15. İlk yıl genelde indirimli (~$5).

### Q: DNS kayıtları ne kadar sürer?
A: Genelde 5-30 dakika, bazen 24 saat sürebilir.

### Q: Test için başka çözüm var mı?
A: Development modunda kod ekranda görünür, bu test için yeterli. Production için domain şart.

---

## 🎉 Özet

✅ **Development:** Test domain (`onboarding@resend.dev`) - Sınırlı  
✅ **Production:** Kendi domain'iniz (`noreply@cvmaker.com`) - Sınırsız

**Toplam Maliyet:** ~$10/yıl (domain)  
**Kurulum Süresi:** ~30 dakika  
**Email Limiti:** 100 email/gün (Resend free plan), sonrası ücretli

---

## 📞 Yardım

Sorun yaşarsanız:
- Resend Docs: https://resend.com/docs
- Resend Support: support@resend.com
- Resend Discord: https://resend.com/discord

Good luck! 🚀
