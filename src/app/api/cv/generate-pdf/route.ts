/**
 * CV PDF Generation API
 *
 * Generates PDF from HTML content with clickable links and selectable text
 *
 * @module app/api/cv/generate-pdf/route
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

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

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      args: [
        ...chromium.args,
        '--hide-scrollbars',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ],
      executablePath: chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();

    // Set viewport to A4 size
    await page.setViewport({
      width: 794, // A4 width in pixels at 96 DPI
      height: 1123, // A4 height in pixels at 96 DPI
    });

    // Set content with full HTML document including Tailwind CSS
    const fullHTML = `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  'gray': {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                  },
                  'blue': {
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                  }
                }
              }
            }
          }
        </script>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          a {
            color: #2563eb !important;
            text-decoration: none !important;
          }
          a:hover {
            text-decoration: underline !important;
          }
          @page {
            margin: 0;
            size: A4;
          }
        </style>
      </head>
      <body>
        ${html}
      </body>
      </html>
    `;

    await page.setContent(fullHTML, { 
      waitUntil: 'networkidle0',
      timeout: 60000 
    });

    // Wait for Tailwind CSS to load and apply styles
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate PDF with settings for clickable links
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: false,
      displayHeaderFooter: false,
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
      // This is crucial for clickable links and selectable text
      tagged: true,
      outline: false,
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
