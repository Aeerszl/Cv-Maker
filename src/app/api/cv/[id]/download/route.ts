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

    // Generate HTML for the CV
    const htmlContent = generateCVHTML(cv);

    // Launch Puppeteer with Vercel-compatible config
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();

    // Set content and wait for load
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

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

    // Return PDF as response
    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${cv.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`,
      },
    });

  } catch (error) {
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

  return `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${cv.title}</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                background: white;
            }

            .header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #2563eb;
            }

            .name {
                font-size: 28px;
                font-weight: bold;
                color: #1f2937;
                margin-bottom: 5px;
            }

            .title {
                font-size: 18px;
                color: #2563eb;
                margin-bottom: 10px;
            }

            .contact {
                font-size: 14px;
                color: #6b7280;
                margin-bottom: 15px;
            }

            .contact-item {
                display: inline-block;
                margin-right: 20px;
            }

            .section {
                margin-bottom: 25px;
            }

            .section-title {
                font-size: 20px;
                font-weight: bold;
                color: #1f2937;
                margin-bottom: 15px;
                padding-bottom: 5px;
                border-bottom: 1px solid #e5e7eb;
            }

            .summary {
                font-size: 14px;
                line-height: 1.7;
                color: #4b5563;
            }

            .experience-item, .education-item {
                margin-bottom: 20px;
            }

            .item-title {
                font-weight: bold;
                font-size: 16px;
                color: #1f2937;
                margin-bottom: 5px;
            }

            .item-subtitle {
                font-style: italic;
                color: #2563eb;
                margin-bottom: 5px;
            }

            .item-date {
                font-size: 12px;
                color: #6b7280;
                margin-bottom: 10px;
            }

            .item-description {
                font-size: 14px;
                line-height: 1.6;
                color: #4b5563;
            }

            .skills-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 10px;
            }

            .skill-item {
                background: #f3f4f6;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 14px;
                display: flex;
                justify-content: space-between;
            }

            .languages-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 10px;
            }

            .language-item {
                background: #f3f4f6;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 14px;
                display: flex;
                justify-content: space-between;
            }

            .level-indicator {
                font-size: 12px;
                color: #6b7280;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="name">${fullName}</div>
            ${title ? `<div class="title">${title}</div>` : ''}
            <div class="contact">
                ${email ? `<span class="contact-item">📧 ${email}</span>` : ''}
                ${phone ? `<span class="contact-item">📱 ${phone}</span>` : ''}
                ${location ? `<span class="contact-item">📍 ${location}</span>` : ''}
                ${linkedin ? `<span class="contact-item">💼 ${linkedin}</span>` : ''}
            </div>
        </div>

        ${summary ? `
        <div class="section">
            <div class="section-title">Özet</div>
            <div class="summary">${summary}</div>
        </div>
        ` : ''}

        ${cv.workExperience && cv.workExperience.length > 0 ? `
        <div class="section">
            <div class="section-title">İş Deneyimi</div>
            ${cv.workExperience?.map((exp) => `
                <div class="experience-item">
                    <div class="item-title">${exp.position || ''} ${exp.company ? `at ${exp.company}` : ''}</div>
                    <div class="item-date">${exp.startDate || ''} - ${exp.endDate || (exp.current ? 'Devam Ediyor' : '')}</div>
                    ${exp.description ? `<div class="item-description">${exp.description}</div>` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}

        ${cv.education && cv.education.length > 0 ? `
        <div class="section">
            <div class="section-title">Eğitim</div>
            ${cv.education?.map((edu) => `
                <div class="education-item">
                    <div class="item-title">${edu.degree || ''} ${edu.field ? `in ${edu.field}` : ''}</div>
                    <div class="item-subtitle">${edu.school || ''}</div>
                    <div class="item-date">${edu.startDate || ''} - ${edu.endDate || (edu.current ? 'Devam Ediyor' : '')}</div>
                </div>
            `).join('')}
        </div>
        ` : ''}

        ${cv.skills && cv.skills.length > 0 ? `
        <div class="section">
            <div class="section-title">Yetenekler</div>
            <div class="skills-grid">
                ${cv.skills?.map((skill) => `
                    <div class="skill-item">
                        <span>${skill.name || ''}</span>
                        <span class="level-indicator">${getLevelText(skill.level)}</span>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}

        ${cv.languages && cv.languages.length > 0 ? `
        <div class="section">
            <div class="section-title">Dil Bilgileri</div>
            <div class="languages-grid">
                ${cv.languages?.map((lang) => `
                    <div class="language-item">
                        <span>${lang.name || ''}</span>
                        <span class="level-indicator">${getLanguageLevelText(lang.level)}</span>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
    </body>
    </html>
  `;
}

function getLevelText(level: string): string {
  const levels: { [key: string]: string } = {
    'beginner': 'Başlangıç',
    'intermediate': 'Orta',
    'advanced': 'İleri',
    'expert': 'Uzman'
  };
  return levels[level] || level;
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