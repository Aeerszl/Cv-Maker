import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import UserActivity from '@/models/UserActivity';
import { handleError } from '@/lib/errorHandler';

// GET - Aktif oturumları getir
// Not: NextAuth varsayılan olarak session bilgilerini veritabanında saklamaz
// Bu endpoint şimdilik sadece mevcut oturumu döndürür
// Gelecekte session database storage eklenirse tüm oturumlar listelenebilir
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

    // Son login aktivitelerini al
    const loginActivities = await UserActivity.find({
      userId: user._id,
      activityType: 'login',
    })
      .sort({ timestamp: -1 })
      .limit(5)
      .select('timestamp ipAddress');

    // Basit session listesi oluştur
    const sessions = loginActivities.map((activity, index) => ({
      _id: String(activity._id),
      device: 'Browser', // Gerçek device detection eklenebilir
      location: activity.ipAddress || 'Unknown',
      lastActive: activity.timestamp,
      current: index === 0, // En son login'i current olarak işaretle
    }));

    return NextResponse.json({
      sessions,
    });
  } catch (error) {
    return handleError(error, 'Get user sessions');
  }
}
