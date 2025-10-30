import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectDB from '@/lib/mongodb';
import CV from '@/models/CV';
import UserActivity from '@/models/UserActivity';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

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
    console.error('CV listeleme hatası:', error);
    return NextResponse.json(
      { error: 'CV\'ler yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// POST /api/cv - Yeni CV oluştur
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      );
    }

    const cvData = await req.json();
    console.log('Received CV data:', JSON.stringify(cvData, null, 2));

    // Validate required fields
    if (!cvData.title || !cvData.personalInfo?.fullName) {
      console.log('Validation failed - missing title or fullName:', { title: cvData.title, fullName: cvData.personalInfo?.fullName });
      return NextResponse.json(
        { error: 'CV başlığı ve kişisel bilgiler gereklidir' },
        { status: 400 }
      );
    }

    await connectDB();

    // Yeni CV oluştur - tüm verileri kabul et
    const cv = await CV.create({
      userId: session.user.id,
      title: cvData.title,
      template: cvData.template || 'modern',
      status: cvData.status || 'draft',
      personalInfo: cvData.personalInfo,
      summary: cvData.summary,
      workExperience: cvData.workExperience || [],
      education: cvData.education || [],
      skills: cvData.skills || [],
      languages: cvData.languages || [],
      certifications: cvData.certifications || [],
      projects: cvData.projects || [],
    });

    console.log('CV created successfully:', cv._id);

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
    console.error('CV oluşturma hatası:', error);
    return NextResponse.json(
      { error: 'CV oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
}