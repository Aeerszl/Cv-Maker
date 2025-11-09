import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectDB from '@/lib/mongodb';
import CV from '@/models/CV';
import UserActivity from '@/models/UserActivity';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { logger } from '@/lib/logger';
import { rateLimit, RATE_LIMITS } from '@/lib/rateLimit';
import { sanitizeObject } from '@/lib/sanitize';
import { handleError, validationError } from '@/lib/errorHandler';

// GET /api/cv - Kullanıcının CV'lerini listele
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      );
    }

    await connectDB();

    const cvs = await CV.find({ userId: session.user.id })
      .sort({ updatedAt: -1 })
      .select('title template status createdAt updatedAt viewCount');

    return NextResponse.json({ cvs });
  } catch (error) {
    return handleError(error, 'CV list');
  }
}

// POST /api/cv - Yeni CV oluştur
export async function POST(req: NextRequest) {
  // ✅ RATE LIMIT: CV spam oluşturmayı önle
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

    const cvData = await req.json();

    // ✅ SANITIZE: XSS ve NoSQL injection koruması
    const sanitizedData = sanitizeObject(cvData);

    // Validate required fields
    if (!sanitizedData.title || !sanitizedData.personalInfo?.fullName) {
      return NextResponse.json(
        validationError('CV başlığı ve kişisel bilgiler gereklidir'),
        { status: 400 }
      );
    }

    await connectDB();

    // Yeni CV oluştur - sanitize edilmiş verilerle
    const cv = await CV.create({
      userId: session.user.id,
      title: sanitizedData.title,
      template: sanitizedData.template || 'modern',
      status: sanitizedData.status || 'draft',
      personalInfo: sanitizedData.personalInfo,
      summary: sanitizedData.summary,
      workExperience: sanitizedData.workExperience || [],
      education: sanitizedData.education || [],
      skills: sanitizedData.skills || [],
      languages: sanitizedData.languages || [],
      certifications: sanitizedData.certifications || [],
      projects: sanitizedData.projects || [],
    });

    logger.info('CV created', { cvId: cv._id, title: cv.title });

    // Activity log
    await UserActivity.create({
      userId: session.user.id,
      activityType: 'cv_create',
      activityDetails: { cvId: cv._id, title: cv.title },
    });

    return NextResponse.json(
      {
        message: 'CV başarıyla oluşturuldu',
        cv: {
          id: cv._id,
          title: cv.title,
          template: cv.template,
          status: cv.status,
          createdAt: cv.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, 'CV create');
  }
}