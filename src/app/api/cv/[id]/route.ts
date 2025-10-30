import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectDB from '@/lib/mongodb';
import CV from '@/models/CV';
import UserActivity from '@/models/UserActivity';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

interface RouteParams {
  params: {
    id: string;
  };
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
    console.error('CV getirme hatası:', error);
    return NextResponse.json(
      { error: 'CV yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// PUT /api/cv/[id] - CV'yi güncelle
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      );
    }

    const updateData = await req.json();

    await connectDB();

    const { id } = await params;
    // CV'yi güncelle
    const cv = await CV.findOneAndUpdate(
      {
        _id: id,
        userId: session.user.id, // Sadece kendi CV'sini güncelleyebilir
      },
      {
        ...updateData,
        lastModified: new Date(),
      },
      { new: true }
    );

    if (!cv) {
      return NextResponse.json(
        { error: 'CV bulunamadı' },
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
    console.error('CV güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'CV güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// DELETE /api/cv/[id] - CV'yi sil
export async function DELETE(req: NextRequest, { params }: RouteParams) {
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
    console.error('CV silme hatası:', error);
    return NextResponse.json(
      { error: 'CV silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
}