/**
 * CV PDF Download API
 *
 * Generates and downloads PDF version of a CV
 *
 * @module app/api/cv/[id]/download/route
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { jsPDF } from 'jspdf';
import connectDB from '@/lib/mongodb';
import CV from '@/models/CV';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { rateLimit, RATE_LIMITS } from '@/lib/rateLimit';
import { handleError } from '@/lib/errorHandler';

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

    // Create PDF with jsPDF
    const doc = new jsPDF();
    let yPos = 20;

    // Personal Info
    doc.setFontSize(20);
    doc.text(cv.personalInfo.fullName, 20, yPos);
    yPos += 10;

    doc.setFontSize(12);
    if (cv.personalInfo.email) {
      doc.text(cv.personalInfo.email, 20, yPos);
      yPos += 7;
    }
    if (cv.personalInfo.phone) {
      doc.text(cv.personalInfo.phone, 20, yPos);
      yPos += 7;
    }
    if (cv.personalInfo.location) {
      doc.text(cv.personalInfo.location, 20, yPos);
      yPos += 7;
    }

    yPos += 5;

    // Summary
    if (cv.summary) {
      doc.setFontSize(14);
      doc.text('Summary', 20, yPos);
      yPos += 7;
      doc.setFontSize(11);
      const summaryText = typeof cv.summary === 'string' ? cv.summary : '';
      const splitSummary = doc.splitTextToSize(summaryText, 170);
      doc.text(splitSummary, 20, yPos);
      yPos += splitSummary.length * 5 + 5;
    }

    // Experience
    if (cv.workExperience && cv.workExperience.length > 0) {
      doc.setFontSize(14);
      doc.text('Experience', 20, yPos);
      yPos += 7;
      
      cv.workExperience.forEach((exp) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.setFontSize(12);
        doc.text(exp.position || '', 20, yPos);
        yPos += 6;
        doc.setFontSize(11);
        doc.text(`${exp.company || ''} | ${exp.startDate || ''} - ${exp.endDate || 'Present'}`, 20, yPos);
        yPos += 6;
        if (exp.description) {
          const splitDesc = doc.splitTextToSize(exp.description, 170);
          doc.text(splitDesc, 20, yPos);
          yPos += splitDesc.length * 5 + 3;
        }
        yPos += 3;
      });
    }

    // Education
    if (cv.education && cv.education.length > 0) {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFontSize(14);
      doc.text('Education', 20, yPos);
      yPos += 7;
      
      cv.education.forEach((edu) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.setFontSize(12);
        doc.text(edu.degree || '', 20, yPos);
        yPos += 6;
        doc.setFontSize(11);
        doc.text(`${edu.school || ''} | ${edu.startDate || ''} - ${edu.endDate || 'Present'}`, 20, yPos);
        yPos += 8;
      });
    }

    // Skills
    if (cv.skills && cv.skills.length > 0) {
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFontSize(14);
      doc.text('Skills', 20, yPos);
      yPos += 7;
      doc.setFontSize(11);
      const skillsText = cv.skills.map((s) => s.name).join(', ');
      const splitSkills = doc.splitTextToSize(skillsText, 170);
      doc.text(splitSkills, 20, yPos);
    }

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    console.log('PDF generated successfully, size:', pdfBuffer.length);

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${cv.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return handleError(error, 'PDF generation');
  }
}