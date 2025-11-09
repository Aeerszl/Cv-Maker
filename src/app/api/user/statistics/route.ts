import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import CV from '@/models/CV';
import UserActivity from '@/models/UserActivity';
import { handleError } from '@/lib/errorHandler';

// GET - Kullanıcı istatistiklerini getir
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Toplam CV sayısı
    const totalCVs = await CV.countDocuments({ userId: user._id });

    // En çok kullanılan şablon
    const templateStats = await CV.aggregate([
      { $match: { userId: user._id } },
      { $group: { _id: '$template', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    const mostUsedTemplate = templateStats.length > 0 ? templateStats[0]._id : null;

    // Son aktivite
    const lastActivity = await UserActivity.findOne({ userId: user._id })
      .sort({ timestamp: -1 })
      .select('timestamp');

    return NextResponse.json({
      totalCVs,
      mostUsedTemplate,
      createdAt: user.createdAt,
      lastActivity: lastActivity?.timestamp || null,
    });
  } catch (error) {
    return handleError(error, 'Get user statistics');
  }
}
