# CV Maker

Bu proje, Next.js ile oluşturulmuş modern bir CV yapıcı uygulamasıdır.

## 🎯 Özellikler

- ⚡ Next.js 16.0.0 (En son sürüm)
- 🎨 Tailwind CSS ile modern, elegant tasarım
- 📝 TypeScript desteği
- 🔍 ESLint ile kod kalitesi
- 🚀 Turbopack ile hızlı geliştirme
- 📱 App Router (yeni nesil routing)
- 🗄️ MongoDB + Mongoose (Database)
- 🔐 NextAuth + JWT + bcryptjs (Authentication)
- 📄 PDF Export (@react-pdf/renderer)
- 📋 React Hook Form (Form yönetimi)
- 🎯 Zustand (State management)
- 🎨 Lucide React (Icons)

## 🏗️ Proje Mimarisi

Bu proje **Clean Code** ve **OOP (Object-Oriented Programming)** prensipleriyle geliştirilmiştir.

### Klasör Yapısı

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/         # Authentication endpoints
│   │   └── test/         # Test endpoints
│   ├── auth/             # Auth pages (signin, signup)
│   └── dashboard/        # Protected pages
├── components/            # React Components
│   ├── ui/               # Reusable UI components (Button, Card, Input)
│   ├── layout/           # Layout components
│   ├── forms/            # Form components
│   └── cards/            # Card components
├── lib/                  # Utilities & configs
│   └── mongodb.ts        # Database connection
├── models/               # Mongoose models
│   ├── User.ts          # User model
│   └── CV.ts            # CV model (5 ATS templates)
├── services/             # Business logic layer (OOP)
│   └── AuthService.ts   # Authentication service
├── store/                # Zustand stores
├── hooks/                # Custom React hooks
├── utils/                # Utility functions
│   └── cn.ts            # ClassName merger
├── constants/            # Constants & design tokens
│   └── design.ts        # Design system
└── types/                # TypeScript type definitions
```

## 🎨 Design System

Projenin tasarımı **nevsoft.com** tarzında:
- ✨ Sade, zarif, profesyonel
- ⚪ Beyaz tema ağırlıklı
- 🎭 Smooth animasyonlar
- 📦 Card-based layout
- 🎯 Modern SaaS görünümü

### Renkler
- Primary: `#0f172a` (Slate 900)
- Accent: `#3b82f6` (Blue 500)
- Background: `#ffffff` (White)

## 📊 CV Şablonları

5 ATS uyumlu profesyonel şablon:
1. **Modern** - Modern ve minimal
2. **Classic** - Klasik profesyonel
3. **Creative** - Yaratıcı tasarım
4. **Professional** - Kurumsal
5. **Minimal** - Sade ve temiz

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 🔐 Security Notice

**IMPORTANT**: This project contains sensitive files that should NEVER be committed to Git:
- `/scripts/create-admin.js` - Admin creation script
- `.env.local` - Environment variables
- `ADMIN_CREDENTIALS.md` - Admin login details

These files are already in `.gitignore`. Keep them private!

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
