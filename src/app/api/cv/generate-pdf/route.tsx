/**
 * CV PDF Generation API
 *
 * Generates PDF from HTML content with clickable links and selectable text
 *
 * @module app/api/cv/generate-pdf/route
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      );
    }

    const { html, filename } = await req.json();

    if (!html) {
      return NextResponse.json(
        { error: 'HTML içeriği gerekli' },
        { status: 400 }
      );
    }

    // Launch browser
    const browser = process.env.NODE_ENV === 'production' 
      ? await puppeteer.launch({
          args: chromium.args,
          defaultViewport: chromium.defaultViewport,
          executablePath: await chromium.executablePath(),
          headless: chromium.headless,
        })
      : await puppeteer.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

    const page = await browser.newPage();

    // Set content with proper styling
    const styledHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              margin: 0;
              padding: 20px;
              line-height: 1.6;
              color: #333;
            }
            * {
              box-sizing: border-box;
            }
            .cv-container {
              max-width: 800px;
              margin: 0 auto;
            }
            @media print {
              body { margin: 0; }
              .cv-container { width: 100%; }
            }
          </style>
        </head>
        <body>
          <div class="cv-container">
            ${html}
          </div>
        </body>
      </html>
    `;

    await page.setContent(styledHtml, { waitUntil: 'networkidle0' });

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
    const fileName = filename || 'cv.pdf';
    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'PDF oluşturulurken bir hata oluştu', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
