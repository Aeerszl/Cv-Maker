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
import CV from '@/models/CV';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { rateLimit, RATE_LIMITS } from '@/lib/rateLimit';
import { handleError } from '@/lib/errorHandler';
import { generateCVHTML } from '@/utils/cvHtmlGenerator';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  console.log('📥 Download request received:', req.method, req.url);
  
  // ✅ RATE LIMIT: PDF download spam önleme
  const rateLimitResult = rateLimit(req, RATE_LIMITS.CV_OPERATIONS);
  if (rateLimitResult) return rateLimitResult;
  
  try {
    console.log('🔐 Checking session...');
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      console.error('❌ No session found');
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      );
    }

    console.log('✅ Session valid:', session.user.id);
    await connectDB();

    const { id } = await params;
    console.log('🔍 Looking for CV:', id);
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

    // Launch Puppeteer with better error handling
    console.log('Chromium path:', await chromium.executablePath());
    console.log('Starting Puppeteer...');

    let browser;
    try {
      const isVercel = !!process.env.VERCEL;
      browser = await puppeteer.launch({
        args: isVercel ? chromium.args : [],
        executablePath: isVercel ? await chromium.executablePath() : undefined,
        headless: true,
      });

      const page = await browser.newPage();

      // Set viewport
      await page.setViewport({ width: 1200, height: 800 });

      // Set content and wait for load
      await page.setContent(htmlContent, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });

      // Wait a bit more for rendering
      await new Promise(resolve => setTimeout(resolve, 2000));

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
        preferCSSPageSize: true,
      });

      await browser.close();

      console.log('PDF generated successfully, size:', pdfBuffer.length);

      // Return PDF as response
      return new NextResponse(Buffer.from(pdfBuffer), {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${cv.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`,
          'Content-Length': pdfBuffer.length.toString(),
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });

    } catch (browserError) {
      console.error('Browser launch error:', browserError);
      if (browser) {
        await browser.close().catch(() => {});
      }
      throw browserError;
    }

  } catch (error) {
    console.error('PDF generation error:', error);
    return handleError(error, 'PDF generation');
  }
}