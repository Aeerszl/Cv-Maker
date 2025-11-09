# CV Maker 📄# CV Maker



![CI/CD](https://github.com/Aeerszl/Cv-Maker/workflows/CI%2FCD%20Pipeline/badge.svg)Bu proje, Next.js ile oluşturulmuş modern bir CV yapıcı uygulamasıdır.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black.svg)](https://nextjs.org/)## 🎯 Özellikler

[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

- ⚡ Next.js 16.0.0 (En son sürüm)

Modern, profesyonel CV oluşturma platformu. Next.js 16, TypeScript ve MongoDB ile geliştirilmiş, production-ready bir SaaS uygulaması.- 🎨 Tailwind CSS ile modern, elegant tasarım

- 📝 TypeScript desteği

---- 🔍 ESLint ile kod kalitesi

- 🚀 Turbopack ile hızlı geliştirme

## 🎯 Özellikler- 📱 App Router (yeni nesil routing)

- 🗄️ MongoDB + Mongoose (Database)

### 🚀 Core Features- 🔐 NextAuth + JWT + bcryptjs (Authentication)

- ⚡ **Next.js 16.0.0** - App Router ile modern React framework- 📄 PDF Export (@react-pdf/renderer)

- 📝 **TypeScript** - Type-safe development- 📋 React Hook Form (Form yönetimi)

- 🎨 **Tailwind CSS 4** - Utility-first CSS framework- 🎯 Zustand (State management)

- 🗄️ **MongoDB + Mongoose** - Scalable database solution- 🎨 Lucide React (Icons)

- 🔐 **NextAuth.js** - Secure authentication with JWT

- 📄 **PDF Export** - High-quality CV PDF generation## 🏗️ Proje Mimarisi

- 🌐 **i18n** - Multi-language support (TR/EN)

- 📱 **Responsive** - Mobile-first designBu proje **Clean Code** ve **OOP (Object-Oriented Programming)** prensipleriyle geliştirilmiştir.



### 🔒 Security Features### Klasör Yapısı

- ✅ Input sanitization (XSS prevention)

- ✅ NoSQL injection protection```

- ✅ Rate limiting on critical endpointssrc/

- ✅ Centralized error handling├── app/                    # Next.js App Router

- ✅ Production-safe logging│   ├── api/               # API Routes

- ✅ Password hashing with bcrypt│   │   ├── auth/         # Authentication endpoints

- ✅ JWT token authentication│   │   └── test/         # Test endpoints

- ✅ Email verification system│   ├── auth/             # Auth pages (signin, signup)

│   └── dashboard/        # Protected pages

### 🧪 Testing & Quality├── components/            # React Components

- ✅ **63 passing tests** (Jest + React Testing Library)│   ├── ui/               # Reusable UI components (Button, Card, Input)

- ✅ Unit tests for critical utilities│   ├── layout/           # Layout components

- ✅ CI/CD pipeline with GitHub Actions│   ├── forms/            # Form components

- ✅ TypeScript strict mode│   └── cards/            # Card components

- ✅ ESLint configuration├── lib/                  # Utilities & configs

- ✅ Code coverage reporting│   └── mongodb.ts        # Database connection

├── models/               # Mongoose models

### 📊 CV Templates│   ├── User.ts          # User model

10 ATS-optimized professional templates:│   └── CV.ts            # CV model (5 ATS templates)

- **Modern** - Contemporary and clean├── services/             # Business logic layer (OOP)

- **Classic** - Traditional professional│   └── AuthService.ts   # Authentication service

- **Creative** - Bold and unique├── store/                # Zustand stores

- **Professional** - Corporate style├── hooks/                # Custom React hooks

- **Minimal** - Simple and elegant├── utils/                # Utility functions

- **Bold** - Stand-out design│   └── cn.ts            # ClassName merger

- **Compact** - Space-efficient├── constants/            # Constants & design tokens

- **Elegant** - Sophisticated look│   └── design.ts        # Design system

- **Executive** - Senior-level format└── types/                # TypeScript type definitions

- **TechPro** - Tech industry focused```



---## 🎨 Design System



## 🏗️ ArchitectureProjenin tasarımı **nevsoft.com** tarzında:

- ✨ Sade, zarif, profesyonel

### Tech Stack- ⚪ Beyaz tema ağırlıklı

```- 🎭 Smooth animasyonlar

Frontend:- 📦 Card-based layout

├── Next.js 16 (App Router)- 🎯 Modern SaaS görünümü

├── React 19

├── TypeScript 5### Renkler

├── Tailwind CSS 4- Primary: `#0f172a` (Slate 900)

└── Zustand (State Management)- Accent: `#3b82f6` (Blue 500)

- Background: `#ffffff` (White)

Backend:

├── Next.js API Routes## 📊 CV Şablonları

├── MongoDB + Mongoose

├── NextAuth.js5 ATS uyumlu profesyonel şablon:

└── Resend (Email Service)1. **Modern** - Modern ve minimal

2. **Classic** - Klasik profesyonel

Testing:3. **Creative** - Yaratıcı tasarım

├── Jest 304. **Professional** - Kurumsal

├── React Testing Library5. **Minimal** - Sade ve temiz

└── ts-jest

---

DevOps:

├── GitHub Actions (CI/CD)This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

├── Vercel (Deployment)

└── ESLint + TypeScript## 🔐 Security Notice

```

**IMPORTANT**: This project contains sensitive files that should NEVER be committed to Git:

### Project Structure- `/scripts/create-admin.js` - Admin creation script

```- `.env.local` - Environment variables

cv.maker/- `ADMIN_CREDENTIALS.md` - Admin login details

├── src/

│   ├── app/                    # Next.js App RouterThese files are already in `.gitignore`. Keep them private!

│   │   ├── api/               # API Routes

│   │   │   ├── auth/         # Authentication endpoints---

│   │   │   ├── cv/           # CV CRUD operations

│   │   │   ├── user/         # User management## Getting Started

│   │   │   └── admin/        # Admin panel APIs

│   │   ├── auth/             # Auth pages (signin/signup)First, run the development server:

│   │   ├── dashboard/        # User dashboard

│   │   ├── admin/            # Admin panel```bash

│   │   └── cv/               # CV creation/editingnpm run dev

│   ├── components/            # React Components# or

│   │   ├── ui/               # Reusable UI (Button, Card, Input)yarn dev

│   │   ├── cv-templates/     # CV template components# or

│   │   ├── forms/            # Form componentspnpm dev

│   │   └── layout/           # Layout components# or

│   ├── lib/                  # Core utilitiesbun dev

│   │   ├── mongodb.ts        # Database connection```

│   │   ├── logger.ts         # Production-safe logger

│   │   ├── errorHandler.ts   # Centralized error handlingOpen [http://localhost:3000](http://localhost:3000) with your browser to see the result.

│   │   ├── sanitize.ts       # Input sanitization

│   │   ├── rateLimit.ts      # Rate limitingYou can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

│   │   └── email.ts          # Email service

│   ├── models/               # Mongoose modelsThis project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

│   │   ├── User.ts           # User model

│   │   ├── CV.ts             # CV model## Learn More

│   │   ├── Admin.ts          # Admin model

│   │   └── Analytics.ts      # Analytics trackingTo learn more about Next.js, take a look at the following resources:

│   ├── services/             # Business logic (OOP)

│   │   ├── AuthService.ts    # Authentication service- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

│   │   └── AnalyticsService.ts- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

│   ├── middleware/           # Custom middleware

│   │   └── adminAuth.ts      # Admin authorizationYou can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

│   ├── hooks/                # Custom React hooks

│   ├── store/                # Zustand stores## Deploy on Vercel

│   ├── types/                # TypeScript definitions

│   └── utils/                # Helper functionsThe easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

├── __tests__/                # Test files

│   └── lib/                  # Unit testsCheck out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

├── public/                   # Static assets
├── scripts/                  # Utility scripts
│   └── create-admin.js       # Admin user creation
└── .github/
    └── workflows/
        └── ci.yml            # CI/CD pipeline
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 20.x or higher
- **MongoDB** (local or Atlas)
- **npm** or **yarn** or **pnpm**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aeerszl/Cv-Maker.git
   cd Cv-Maker
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create `.env.local` file in the root directory:
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in the required variables:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/cvmaker
   # or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/cvmaker
   
   # Authentication (NextAuth)
   NEXTAUTH_SECRET=your-super-secret-key-min-32-chars
   NEXTAUTH_URL=http://localhost:3000
   
   # Email Service (Resend)
   RESEND_API_KEY=re_xxxxxxxxxxxx
   RESEND_FROM_EMAIL=noreply@yourdomain.com
   
   # Environment
   NODE_ENV=development
   ```

4. **Run database migrations (optional)**
   ```bash
   # No migrations needed - Mongoose auto-creates collections
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Creating Admin User

```bash
npm run create-admin
```

Follow the prompts to create an admin account. Credentials will be saved to `ADMIN_CREDENTIALS.md` (gitignored).

---

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Watch mode (development)
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Structure
```
__tests__/
├── lib/
│   ├── rateLimit.test.ts      # 12 tests - Rate limiting
│   ├── sanitize.test.ts       # 12 tests - Input sanitization
│   └── errorHandler.test.ts   # 39 tests - Error handling
```

**Current Test Coverage**: 63/63 passing ✅

---

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (with Turbopack) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate coverage report |
| `npm run create-admin` | Create admin user |

---

## 🔒 Security

### Implemented Security Measures

1. **Input Sanitization**
   - XSS prevention with HTML stripping
   - NoSQL injection protection
   - Email validation
   - Applied to all user inputs

2. **Rate Limiting**
   - Authentication endpoints: 5 req/15min
   - Email sending: 3 req/hour
   - CV operations: 10 req/5min
   - Profile updates: 5 req/5min

3. **Error Handling**
   - Centralized error handling
   - No stack trace leakage in production
   - User-friendly error messages
   - Detailed server-side logging

4. **Authentication**
   - JWT tokens with secure secrets
   - Password hashing (bcrypt)
   - Email verification
   - Session management

5. **Production Logging**
   - No console.log in production
   - Structured logging with context
   - Error tracking and monitoring

### Security Checklist
- ✅ Input validation and sanitization
- ✅ XSS prevention
- ✅ NoSQL injection prevention
- ✅ Rate limiting
- ✅ CSRF protection (NextAuth)
- ✅ Secure password hashing
- ✅ JWT authentication
- ✅ Environment variable management
- ✅ Error message sanitization
- ✅ Production-safe logging

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables (copy from `.env.local`)
   - Deploy!

3. **Environment Variables on Vercel**
   
   Add these in Vercel Dashboard → Settings → Environment Variables:
   ```
   MONGODB_URI
   NEXTAUTH_SECRET
   NEXTAUTH_URL
   RESEND_API_KEY
   RESEND_FROM_EMAIL
   NODE_ENV=production
   ```

### Deploy to Other Platforms

**Build the application:**
```bash
npm run build
```

**Start production server:**
```bash
npm run start
```

The app will run on port 3000. Configure your reverse proxy (Nginx/Apache) accordingly.

---

## 🎨 Design System

### Color Palette
```css
Primary:     #0f172a (Slate 900)
Accent:      #3b82f6 (Blue 500)
Background:  #ffffff (White)
Text:        #1e293b (Slate 800)
Muted:       #64748b (Slate 500)
```

### Design Principles
- ✨ Clean and professional
- ⚪ Light theme focused
- 🎭 Smooth animations
- 📦 Card-based layouts
- 🎯 Modern SaaS aesthetic

Inspired by: **nevsoft.com**

---

## 📝 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/cvmaker` |
| `NEXTAUTH_SECRET` | Secret for JWT signing (min 32 chars) | `your-super-secret-key-here` |
| `NEXTAUTH_URL` | Application URL | `http://localhost:3000` |
| `RESEND_API_KEY` | Resend API key for emails | `re_xxxxxxxxxxxx` |
| `RESEND_FROM_EMAIL` | Sender email address | `noreply@yourdomain.com` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `RATE_LIMIT_ENABLED` | Enable rate limiting | `true` |
| `LOG_LEVEL` | Logging level | `info` |

See `.env.example` for complete list.

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards
- ✅ TypeScript strict mode
- ✅ ESLint rules compliance
- ✅ Write tests for new features
- ✅ Follow existing code style
- ✅ Update documentation

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔐 Security Notice

**IMPORTANT**: Never commit these files:
- `.env.local` - Environment variables
- `ADMIN_CREDENTIALS.md` - Admin login credentials
- `/scripts/create-admin.js` - Admin creation script

These files are in `.gitignore` for your security.

If you find a security vulnerability, please email: [security@yourdomain.com](mailto:security@yourdomain.com)

---

## 📚 Learn More

### Next.js Resources
- [Next.js Documentation](https://nextjs.org/docs) - Features and API
- [Next.js GitHub](https://github.com/vercel/next.js) - Repository
- [Learn Next.js](https://nextjs.org/learn) - Interactive tutorial

### Project Resources
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Cloud database
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Tailwind CSS](https://tailwindcss.com/docs) - Styling
- [Resend](https://resend.com/docs) - Email service

---

## 👨‍💻 Author

**Aeerszl**
- GitHub: [@Aeerszl](https://github.com/Aeerszl)
- Repository: [Cv-Maker](https://github.com/Aeerszl/Cv-Maker)

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting platform
- MongoDB for database solution
- Open source community

---

**Made with ❤️ using Next.js 16**
