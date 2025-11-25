/**
 * CV PDF Download API
 *
 * Generates and downloads PDF version of a CV
 *
 * @module app/api/cv/[id]/download/route
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import connectDB from '@/lib/mongodb';
import CV, { ICV } from '@/models/CV';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { rateLimit, RATE_LIMITS } from '@/lib/rateLimit';
import { handleError } from '@/lib/errorHandler';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  // ✅ RATE LIMIT: PDF download spam önleme
  const rateLimitResult = rateLimit(req, RATE_LIMITS.CV_OPERATIONS);
  if (rateLimitResult) return rateLimitResult;
  
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      );
    }

    await connectDB();

    const { id } = await params;
    const cv = await CV.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!cv) {
      return NextResponse.json(
        { error: 'CV bulunamadı' },
        { status: 404 }
      );
    }

    // Validate required fields for PDF generation
    const errors: string[] = [];
    
    if (!cv.title) errors.push('CV başlığı eksik');
    if (!cv.personalInfo?.fullName) errors.push('Ad Soyad eksik');
    if (!cv.personalInfo?.email) errors.push('E-posta eksik');

    if (errors.length > 0) {
      return NextResponse.json(
        { 
          error: 'PDF oluşturmak için zorunlu bilgiler eksik. Lütfen CV başlığını, adınızı soyadınızı ve e-posta adresinizi doldurun.',
          missingFields: errors
        },
        { status: 400 }
      );
    }

    // Generate HTML for the CV using the selected template
    const htmlContent = generateCVHTML(cv);

    console.log('Starting PDF generation for CV:', id);

    // Launch Puppeteer
    console.log('Chromium path:', await chromium.executablePath());
    console.log('Starting Puppeteer...');
    const browser = await puppeteer.launch({
      args: [
        ...chromium.args,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ],
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();

    // Set content and wait for load
    await page.setContent(htmlContent, { 
      waitUntil: 'networkidle0',
      timeout: 120000 
    });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px',
      },
    });

    await browser.close();

    console.log('PDF generated successfully, size:', pdfBuffer.length);

    // Return PDF as response
    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${cv.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`,
      },
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return handleError(error, 'PDF generation');
  }
}

function generateCVHTML(cv: ICV): string {
  const personalInfo = cv.personalInfo || {};
  const fullName = personalInfo.fullName || 'İsim Soyisim';
  const title = personalInfo.title || '';
  const email = personalInfo.email || '';
  const phone = personalInfo.phone || '';
  const location = personalInfo.location || '';
  const linkedin = personalInfo.linkedin || '';
  const summary = cv.summary || '';

  // Template-specific styling
  let headerStyle = '';
  let bodyStyle = '';
  let sectionStyle = '';

  switch (cv.template) {
    case 'modern':
      headerStyle = 'bg-gray-800 text-white px-8 py-6';
      bodyStyle = 'bg-white text-gray-900';
      sectionStyle = 'border-l-4 border-blue-500 pl-4';
      break;
    case 'classic':
      headerStyle = 'text-center border-b-2 border-gray-300 pb-4';
      bodyStyle = 'bg-white text-gray-900';
      sectionStyle = 'border-b border-gray-200 pb-4';
      break;
    case 'creative':
      headerStyle = 'bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-6 rounded-lg';
      bodyStyle = 'bg-gray-50 text-gray-900';
      sectionStyle = 'bg-white p-6 rounded-lg shadow-md';
      break;
    case 'professional':
      headerStyle = 'bg-blue-900 text-white px-8 py-6';
      bodyStyle = 'bg-white text-gray-900';
      sectionStyle = 'border-l-4 border-blue-900 pl-4';
      break;
    case 'minimal':
      headerStyle = 'text-center py-4';
      bodyStyle = 'bg-white text-gray-900';
      sectionStyle = 'py-4';
      break;
    case 'executive':
      headerStyle = 'bg-gray-900 text-white px-8 py-8';
      bodyStyle = 'bg-white text-gray-900';
      sectionStyle = 'border-b-2 border-gray-300 pb-6';
      break;
    case 'techpro':
      headerStyle = 'bg-black text-green-400 px-8 py-6 font-mono';
      bodyStyle = 'bg-gray-900 text-green-400 font-mono';
      sectionStyle = 'border border-green-400 p-4';
      break;
    case 'elegant':
      headerStyle = 'text-center bg-gradient-to-r from-gray-100 to-gray-200 py-8';
      bodyStyle = 'bg-white text-gray-900';
      sectionStyle = 'bg-gray-50 p-6 rounded-lg';
      break;
    case 'bold':
      headerStyle = 'bg-red-600 text-white px-8 py-6 font-bold';
      bodyStyle = 'bg-white text-gray-900';
      sectionStyle = 'border-2 border-red-600 p-4';
      break;
    default:
      headerStyle = 'bg-blue-600 text-white px-8 py-6';
      bodyStyle = 'bg-white text-gray-900';
      sectionStyle = 'border-l-4 border-blue-600 pl-4';
  }

  return `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${cv.title}</title>
        <style>
          /* Minimal Tailwind CSS inline */
          * { box-sizing: border-box; }
          body { margin: 0; font-family: Arial, sans-serif; line-height: 1.5; }
          .max-w-4xl { max-width: 56rem; margin: 0 auto; padding: 2rem; }
          .mb-8 { margin-bottom: 2rem; }
          .mb-6 { margin-bottom: 1.5rem; }
          .mb-4 { margin-bottom: 1rem; }
          .mb-3 { margin-bottom: 0.75rem; }
          .mb-2 { margin-bottom: 0.5rem; }
          .mt-4 { margin-top: 1rem; }
          .pt-6 { padding-top: 1.5rem; }
          .pb-4 { padding-bottom: 1rem; }
          .pb-6 { padding-bottom: 1.5rem; }
          .pl-4 { padding-left: 1rem; }
          .p-8 { padding: 2rem; }
          .p-6 { padding: 1.5rem; }
          .p-3 { padding: 0.75rem; }
          .px-8 { padding-left: 2rem; padding-right: 2rem; }
          .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
          .py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
          .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
          .text-4xl { font-size: 2.25rem; font-weight: bold; }
          .text-2xl { font-size: 1.5rem; font-weight: bold; }
          .text-xl { font-size: 1.25rem; }
          .text-lg { font-size: 1.125rem; }
          .text-sm { font-size: 0.875rem; }
          .font-bold { font-weight: bold; }
          .font-semibold { font-weight: 600; }
          .font-medium { font-weight: 500; }
          .font-mono { font-family: 'Courier New', monospace; }
          .leading-relaxed { line-height: 1.625; }
          .opacity-90 { opacity: 0.9; }
          .text-center { text-align: center; }
          .text-blue-600 { color: #2563eb; }
          .text-gray-800 { color: #1f2937; }
          .text-gray-700 { color: #374151; }
          .text-gray-600 { color: #4b5563; }
          .text-white { color: #ffffff; }
          .text-green-400 { color: #4ade80; }
          .bg-white { background-color: #ffffff; }
          .bg-gray-800 { background-color: #1f2937; }
          .bg-gray-100 { background-color: #f3f4f6; }
          .bg-gray-900 { background-color: #111827; }
          .bg-black { background-color: #000000; }
          .bg-blue-600 { background-color: #2563eb; }
          .bg-blue-900 { background-color: #1e3a8a; }
          .bg-red-600 { background-color: #dc2626; }
          .bg-gradient-to-r { background: linear-gradient(to right, var(--tw-gradient-stops)); }
          .from-purple-500 { --tw-gradient-from: #a855f7; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(168, 85, 247, 0)); }
          .to-pink-500 { --tw-gradient-to: #ec4899; }
          .from-gray-100 { --tw-gradient-from: #f3f4f6; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(243, 244, 246, 0)); }
          .to-gray-200 { --tw-gradient-to: #e5e7eb; }
          .border { border-width: 1px; border-color: #d1d5db; }
          .border-t { border-top-width: 1px; border-color: #d1d5db; }
          .border-b { border-bottom-width: 1px; border-color: #d1d5db; }
          .border-b-2 { border-bottom-width: 2px; border-color: #d1d5db; }
          .border-l-4 { border-left-width: 4px; border-color: #2563eb; }
          .border-2 { border-width: 2px; border-color: #dc2626; }
          .rounded-lg { border-radius: 0.5rem; }
          .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
          .flex { display: flex; }
          .flex-wrap { flex-wrap: wrap; }
          .gap-4 { gap: 1rem; }
          .grid { display: grid; }
          .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .border-gray-300 { border-color: #d1d5db; }
          .border-gray-200 { border-color: #e5e7eb; }
          .bg-gray-50 { background-color: #f9fafb; }
        </style>
    </head>
    <body class="${bodyStyle} max-w-4xl mx-auto p-8">
        <!-- Header -->
        <div class="header ${headerStyle} mb-8">
            <h1 class="text-4xl font-bold mb-2">${fullName}</h1>
            ${title ? `<p class="text-xl opacity-90">${title}</p>` : ''}
            <div class="mt-4 flex flex-wrap gap-4 text-sm">
                ${email ? `<span>📧 ${email}</span>` : ''}
                ${phone ? `<span>📱 ${phone}</span>` : ''}
                ${location ? `<span>📍 ${location}</span>` : ''}
                ${linkedin ? `<span>💼 ${linkedin}</span>` : ''}
            </div>
        </div>

        <!-- Summary -->
        ${summary ? `
        <div class="section ${sectionStyle} mb-8">
            <h2 class="text-2xl font-bold mb-4 text-blue-600">ÖZET</h2>
            <p class="text-lg leading-relaxed">${summary}</p>
        </div>
        ` : ''}

        <!-- Work Experience -->
        ${cv.workExperience && cv.workExperience.length > 0 ? `
        <div class="section ${sectionStyle} mb-8">
            <h2 class="text-2xl font-bold mb-6 text-blue-600">İŞ DENEYİMİ</h2>
            ${cv.workExperience?.map((exp, index) => `
                <div class="mb-6 ${index > 0 ? 'border-t pt-6' : ''}">
                    <h3 class="text-xl font-semibold text-gray-800">${exp.position || ''}</h3>
                    <p class="text-lg text-blue-600 mb-2">${exp.company || ''}</p>
                    <p class="text-sm text-gray-600 mb-3">${exp.startDate || ''} - ${exp.endDate || (exp.current ? 'Devam Ediyor' : '')}</p>
                    ${exp.description ? `<p class="text-gray-700 leading-relaxed">${exp.description}</p>` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}

        <!-- Education -->
        ${cv.education && cv.education.length > 0 ? `
        <div class="section ${sectionStyle} mb-8">
            <h2 class="text-2xl font-bold mb-6 text-blue-600">EĞİTİM</h2>
            ${cv.education?.map((edu, index) => `
                <div class="mb-6 ${index > 0 ? 'border-t pt-6' : ''}">
                    <h3 class="text-xl font-semibold text-gray-800">${edu.degree || ''} ${edu.field ? `in ${edu.field}` : ''}</h3>
                    <p class="text-lg text-blue-600 mb-2">${edu.school || ''}</p>
                    <p class="text-sm text-gray-600">${edu.startDate || ''} - ${edu.endDate || (edu.current ? 'Devam Ediyor' : '')}</p>
                </div>
            `).join('')}
        </div>
        ` : ''}

        <!-- Skills -->
        ${cv.skills && cv.skills.length > 0 ? `
        <div class="section ${sectionStyle} mb-8">
            <h2 class="text-2xl font-bold mb-6 text-blue-600">YETENEKLER</h2>
            <div class="flex flex-wrap gap-2">
                ${cv.skills?.map((skill) => `
                    <span class="text-xs px-2 py-1 bg-gray-100 text-gray-800 border border-gray-300 rounded">
                        ${skill.name || ''}${skill.years ? `-${skill.years}y` : ''}
                    </span>
                `).join('')}
            </div>
        </div>
        ` : ''}

        <!-- Languages -->
        ${cv.languages && cv.languages.length > 0 ? `
        <div class="section ${sectionStyle} mb-8">
            <h2 class="text-2xl font-bold mb-6 text-blue-600">DİL BİLGİLERİ</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                ${cv.languages?.map((lang) => `
                    <div class="bg-gray-100 p-3 rounded-lg">
                        <span class="font-medium">${lang.name || ''}</span>
                        <span class="text-sm text-gray-600 ml-2">(${getLanguageLevelText(lang.level)})</span>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
    </body>
    </html>
  `;
}

function getLanguageLevelText(level: string): string {
  const levels: { [key: string]: string } = {
    'basic': 'Temel',
    'intermediate': 'Orta',
    'fluent': 'Akıcı',
    'native': 'Anadil'
  };
  return levels[level] || level;
}