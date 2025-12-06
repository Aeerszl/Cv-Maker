/**
 * CV PDF Generation API
 *
 * Generates PDF from CV data with clickable links and selectable text
 *
 * @module app/api/cv/generate-pdf/route
 */


import { NextRequest, NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';

export async function POST(req: NextRequest) {
  try {
    const { cv, filename } = await req.json();
    if (!cv) {
      return NextResponse.json({ error: 'CV data is required' }, { status: 400 });
    }

    // Data mapping for compatibility
    if (cv.personalInfo && cv.personalInfo.firstName && cv.personalInfo.lastName && !cv.personalInfo.fullName) {
      cv.personalInfo.fullName = `${cv.personalInfo.firstName} ${cv.personalInfo.lastName}`;
    }
    // Map workExperience to experience
    const experience = cv.experience || cv.workExperience || [];
    
    if (cv.summary && typeof cv.summary === 'object' && cv.summary.text) {
      cv.summary = cv.summary.text;
    }
    if (!cv.personalInfo || !cv.personalInfo.fullName) {
      return NextResponse.json({ error: 'Personal information is required' }, { status: 400 });
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
      const summaryText = typeof cv.summary === 'string' ? cv.summary : cv.summary.text || '';
      const splitSummary = doc.splitTextToSize(summaryText, 170);
      doc.text(splitSummary, 20, yPos);
      yPos += splitSummary.length * 5 + 5;
    }

    // Experience
    if (experience && experience.length > 0) {
      doc.setFontSize(14);
      doc.text('Experience', 20, yPos);
      yPos += 7;
      
      experience.forEach((exp: { position?: string; company?: string; startDate?: string; endDate?: string; description?: string }) => {
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
      
      cv.education.forEach((edu: { degree?: string; school?: string; startDate?: string; endDate?: string }) => {
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
      const skillsText = cv.skills.map((s: { name?: string } | string) => typeof s === 'string' ? s : (s.name || '')).join(', ');
      const splitSkills = doc.splitTextToSize(skillsText, 170);
      doc.text(splitSkills, 20, yPos);
      yPos += splitSkills.length * 5;
    }

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    const fileName = filename || `${cv.personalInfo.fullName.replace(/\s+/g, '_')}_CV.pdf`;

    return new NextResponse(pdfBuffer, {
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
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}
