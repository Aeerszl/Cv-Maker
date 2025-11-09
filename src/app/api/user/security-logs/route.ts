import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import UserActivity from '@/models/UserActivity';
import { handleError } from '@/lib/errorHandler';

// GET - Güvenlik geçmişini getir
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

    // Son 50 aktiviteyi getir
    const activities = await UserActivity.find({ userId: user._id })
      .sort({ timestamp: -1 })
      .limit(50)
      .select('activityType timestamp ipAddress activityDetails');

    return NextResponse.json({
      activities: activities.map((activity) => ({
        _id: String(activity._id),
        activityType: activity.activityType,
        timestamp: activity.timestamp,
        ipAddress: activity.ipAddress,
        details: activity.activityDetails,
      })),
    });
  } catch (error) {
    return handleError(error, 'Get security logs');
  }
}
