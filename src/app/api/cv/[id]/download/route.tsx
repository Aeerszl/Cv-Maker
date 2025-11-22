/**
 * CV PDF Download API
 *
 * Generates and downloads PDF version of a CV
 *
 * @module app/api/cv/[id]/download/route
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from '@react-pdf/renderer';
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

    // Generate PDF using @react-pdf/renderer
    console.log('Starting PDF generation for CV:', id);
    const pdfBuffer = await renderToBuffer(generateCVDocument(cv));

    console.log('PDF generated successfully, size:', pdfBuffer.length);

    // Return PDF as response
    const blob = new Blob([new Uint8Array(pdfBuffer)], { type: 'application/pdf' });
    return new NextResponse(blob, {
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

function generateCVDocument(cv: ICV) {
  const styles = StyleSheet.create({
    page: {
      padding: 40,
      fontFamily: 'Helvetica',
    },
    header: {
      marginBottom: 20,
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    title: {
      fontSize: 16,
      marginBottom: 10,
      opacity: 0.9,
    },
    contact: {
      fontSize: 10,
      marginBottom: 10,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    contactItem: {
      marginRight: 15,
      marginBottom: 5,
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#2563eb',
    },
    summary: {
      fontSize: 12,
      lineHeight: 1.5,
    },
    experienceItem: {
      marginBottom: 15,
    },
    experienceTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 2,
    },
    experienceCompany: {
      fontSize: 12,
      color: '#2563eb',
      marginBottom: 2,
    },
    experienceDate: {
      fontSize: 10,
      color: '#666',
      marginBottom: 5,
    },
    experienceDesc: {
      fontSize: 11,
      lineHeight: 1.4,
    },
    educationItem: {
      marginBottom: 15,
    },
    educationTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 2,
    },
    educationSchool: {
      fontSize: 12,
      color: '#2563eb',
      marginBottom: 2,
    },
    educationDate: {
      fontSize: 10,
      color: '#666',
    },
    skillsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    skillItem: {
      width: '30%',
      marginRight: '3%',
      marginBottom: 10,
      padding: 8,
      backgroundColor: '#f3f4f6',
      borderRadius: 5,
    },
    skillName: {
      fontSize: 11,
      fontWeight: 'bold',
    },
    skillLevel: {
      fontSize: 9,
      color: '#666',
    },
  });

  const personalInfo = cv.personalInfo || {};
  const fullName = personalInfo.fullName || 'İsim Soyisim';
  const title = personalInfo.title || '';
  const email = personalInfo.email || '';
  const phone = personalInfo.phone || '';
  const location = personalInfo.location || '';
  const linkedin = personalInfo.linkedin || '';
  const summary = cv.summary || '';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{fullName}</Text>
          {title && <Text style={styles.title}>{title}</Text>}
          <View style={styles.contact}>
            {email && <Text style={styles.contactItem}>📧 {email}</Text>}
            {phone && <Text style={styles.contactItem}>📱 {phone}</Text>}
            {location && <Text style={styles.contactItem}>📍 {location}</Text>}
            {linkedin && <Text style={styles.contactItem}>💼 {linkedin}</Text>}
          </View>
        </View>

        {/* Summary */}
        {summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ÖZET</Text>
            <Text style={styles.summary}>{summary}</Text>
          </View>
        )}

        {/* Work Experience */}
        {cv.workExperience && cv.workExperience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>İŞ DENEYİMİ</Text>
            {cv.workExperience.map((exp, index) => (
              <View key={index} style={styles.experienceItem}>
                <Text style={styles.experienceTitle}>{exp.position || ''}</Text>
                <Text style={styles.experienceCompany}>{exp.company || ''}</Text>
                <Text style={styles.experienceDate}>
                  {exp.startDate || ''} - {exp.endDate || (exp.current ? 'Devam Ediyor' : '')}
                </Text>
                {exp.description && (
                  <Text style={styles.experienceDesc}>{exp.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {cv.education && cv.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EĞİTİM</Text>
            {cv.education.map((edu, index) => (
              <View key={index} style={styles.educationItem}>
                <Text style={styles.educationTitle}>
                  {edu.degree || ''} {edu.field ? `in ${edu.field}` : ''}
                </Text>
                <Text style={styles.educationSchool}>{edu.school || ''}</Text>
                <Text style={styles.educationDate}>
                  {edu.startDate || ''} - {edu.endDate || (edu.current ? 'Devam Ediyor' : '')}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {cv.skills && cv.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>YETENEKLER</Text>
            <View style={styles.skillsGrid}>
              {cv.skills.map((skill, index) => (
                <View key={index} style={styles.skillItem}>
                  <Text style={styles.skillName}>{skill.name || ''}</Text>
                  <Text style={styles.skillLevel}>({getLevelText(skill.level)})</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Languages */}
        {cv.languages && cv.languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>DİL BİLGİLERİ</Text>
            <View style={styles.skillsGrid}>
              {cv.languages.map((lang, index) => (
                <View key={index} style={styles.skillItem}>
                  <Text style={styles.skillName}>{lang.name || ''}</Text>
                  <Text style={styles.skillLevel}>({getLanguageLevelText(lang.level)})</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
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
