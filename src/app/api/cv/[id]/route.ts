import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectDB from '@/lib/mongodb';
import CV from '@/models/CV';
import UserActivity from '@/models/UserActivity';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { rateLimit, RATE_LIMITS } from '@/lib/rateLimit';
import { sanitizeObject } from '@/lib/sanitize';
import { handleError, notFoundError } from '@/lib/errorHandler';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/cv/[id] - CV detaylarını getir
export async function GET(req: NextRequest, { params }: RouteParams) {
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
      userId: session.user.id, // Sadece kendi CV'sini görebilir
    });

    if (!cv) {
      return NextResponse.json(
        { error: 'CV bulunamadı' },
        { status: 404 }
      );
    }

    // View count'u artır
    await CV.findByIdAndUpdate(id, {
      $inc: { viewCount: 1 },
      lastModified: new Date(),
    });

    // Activity log
    await UserActivity.create({
      userId: session.user.id,
      activityType: 'cv_view',
      activityDetails: { cvId: id, title: cv.title },
    });

    return NextResponse.json({ cv });
  } catch (error) {
    return handleError(error, 'CV get');
  }
}

// PUT /api/cv/[id] - CV'yi güncelle
export async function PUT(req: NextRequest, { params }: RouteParams) {
  // ✅ RATE LIMIT: CV spam güncellemeyi önle
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

    const updateData = await req.json();

    // ✅ SANITIZE: XSS ve NoSQL injection koruması
    const sanitizedData = sanitizeObject(updateData);

    await connectDB();

    const { id } = await params;
    // CV'yi güncelle - sanitize edilmiş verilerle
    const cv = await CV.findOneAndUpdate(
      {
        _id: id,
        userId: session.user.id, // Sadece kendi CV'sini güncelleyebilir
      },
      {
        ...sanitizedData,
        lastModified: new Date(),
      },
      { new: true }
    );

    if (!cv) {
      return NextResponse.json(
        notFoundError('CV bulunamadı'),
        { status: 404 }
      );
    }

    // Activity log
    await UserActivity.create({
      userId: session.user.id,
      activityType: 'cv_edit',
      activityDetails: { cvId: id, title: cv.title },
    });

    return NextResponse.json({
      message: 'CV başarıyla güncellendi',
      cv,
    });
  } catch (error) {
    return handleError(error, 'CV update');
  }
}

// DELETE /api/cv/[id] - CV'yi sil
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  // ✅ RATE LIMIT: CV spam silmeyi önle
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
    const cv = await CV.findOneAndDelete({
      _id: id,
      userId: session.user.id, // Sadece kendi CV'sini silebilir
    });

    if (!cv) {
      return NextResponse.json(
        { error: 'CV bulunamadı' },
        { status: 404 }
      );
    }

    // Activity log
    await UserActivity.create({
      userId: session.user.id,
      activityType: 'cv_delete',
      activityDetails: { cvId: id, title: cv.title },
    });

    return NextResponse.json({
      message: 'CV başarıyla silindi',
    });
  } catch (error) {
    return handleError(error, 'CV delete');
  }
}