/**
 * CV PDF Generation API
 *
 * Generates PDF from CV data with clickable links and selectable text
 *
 * @module app/api/cv/generate-pdf/route
 */


import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { generateCVHTML } from '@/utils/cvHtmlGenerator';

export async function POST(req: NextRequest) {
  let browser;
  try {
    const { cv, filename } = await req.json();
    if (!cv) {
      return NextResponse.json({ error: 'CV data is required' }, { status: 400 });
    }
    // Data mapping for compatibility
    if (cv.personalInfo && cv.personalInfo.firstName && cv.personalInfo.lastName && !cv.personalInfo.fullName) {
      cv.personalInfo.fullName = `${cv.personalInfo.firstName} ${cv.personalInfo.lastName}`;
    }
    if (!cv.experience && cv.workExperience) {
      cv.experience = cv.workExperience;
    }
    if (!cv.workExperience && cv.experience) {
      cv.workExperience = cv.experience;
    }
    if (cv.summary && typeof cv.summary === 'object' && cv.summary.text) {
      cv.summary = cv.summary.text;
    }
    if (!cv.personalInfo || !cv.personalInfo.fullName) {
      return NextResponse.json({ error: 'Personal information is required' }, { status: 400 });
    }
    const html = generateCVHTML(cv);
    const isVercel = !!process.env.VERCEL;
    browser = await puppeteer.launch({
      args: isVercel ? chromium.args : [],
      executablePath: isVercel ? await chromium.executablePath() : undefined,
      headless: true,
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 2000));
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
    const fileName = filename || `${cv.personalInfo.fullName.replace(/\s+/g, '_')}_CV.pdf`;
    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    if (browser) {
      try { await browser.close(); } catch {}
    }
    return NextResponse.json(
      { error: 'PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}
