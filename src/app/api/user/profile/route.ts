import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import CV from '@/models/CV';
import UserActivity from '@/models/UserActivity';
import { logger } from '@/lib/logger';
import { rateLimit, RATE_LIMITS } from '@/lib/rateLimit';
import { handleError, validationError, notFoundError } from '@/lib/errorHandler';
import { sanitizeString, sanitizeEmail, preventNoSQLInjection } from '@/lib/sanitize';

// GET - Kullanıcı profil bilgilerini getir
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

    const user = await User.findOne({ email: session.user.email }).select('-passwordHash');
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    });
  } catch (error) {
    logger.error('Profile GET error', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Kullanıcı profil bilgilerini güncelle
export async function PUT(req: NextRequest) {
  // ✅ RATE LIMIT: Profil güncelleme spam önleme
  const rateLimitResult = rateLimit(req, RATE_LIMITS.PROFILE_UPDATE);
  if (rateLimitResult) return rateLimitResult;
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    
    // ✅ INPUT SANITIZATION: XSS ve injection önleme
    const fullName = sanitizeString(body.fullName, { maxLength: 100, minLength: 2 });
    const email = sanitizeEmail(body.email);
    
    // ✅ NoSQL Injection önleme
    preventNoSQLInjection({ fullName, email });

    logger.debug('Profile update request', { fullName, email, currentEmail: session.user.email });

    await dbConnect();

    // Email değişiyorsa, yeni email'in kullanılmadığını kontrol et
    if (email !== session.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 400 }
        );
      }
    }

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { fullName, email },
      { new: true }
    ).select('-passwordHash');

    logger.debug('User updated in DB', { 
      found: !!user, 
      newFullName: user?.fullName, 
      newEmail: user?.email 
    });

    if (!user) {
      throw notFoundError('User');
    }

    // Aktivite kaydı
    await UserActivity.create({
      userId: user._id,
      activityType: 'profile_update',
      ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
    });

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    // ✅ SECURE ERROR HANDLING
    return handleError(error, 'Profile update failed');
  }
}

// DELETE - Kullanıcı hesabını sil
export async function DELETE() {
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

    // Kullanıcının tüm CV'lerini sil
    await CV.deleteMany({ userId: user._id });

    // Kullanıcının aktivite kayıtlarını sil
    await UserActivity.deleteMany({ userId: user._id });

    // Kullanıcıyı sil
    await User.deleteOne({ _id: user._id });

    return NextResponse.json({
      message: 'Account deleted successfully',
    });
  } catch (error) {
    logger.error('Profile DELETE error', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
