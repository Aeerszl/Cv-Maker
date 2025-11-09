import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import UserActivity from '@/models/UserActivity';
import { rateLimit, RATE_LIMITS } from '@/lib/rateLimit';
import { handleError } from '@/lib/errorHandler';
import { sanitizeString } from '@/lib/sanitize';

// POST - Şifre değiştir
export async function POST(req: NextRequest) {
  // ✅ RATE LIMIT: Şifre değiştirme spam önleme
  const rateLimitResult = rateLimit(req, RATE_LIMITS.PASSWORD_CHANGE);
  if (rateLimitResult) return rateLimitResult;
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await req.json();

    // ✅ SANITIZE: Password'ler sanitize edilir (NoSQL injection önleme)
    const sanitizedCurrentPassword = sanitizeString(currentPassword || '');
    const sanitizedNewPassword = sanitizeString(newPassword || '');

    if (!sanitizedCurrentPassword || !sanitizedNewPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    if (sanitizedNewPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
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

    // Mevcut şifreyi kontrol et
    const isPasswordValid = await bcrypt.compare(sanitizedCurrentPassword, user.passwordHash);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Yeni şifreyi hashle
    const hashedPassword = await bcrypt.hash(sanitizedNewPassword, 10);

    // Şifreyi güncelle
    user.passwordHash = hashedPassword;
    await user.save();

    // Aktivite kaydı
    await UserActivity.create({
      userId: user._id,
      activityType: 'profile_update',
      ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
      activityDetails: { action: 'password_change' },
    });

    return NextResponse.json({
      message: 'Password changed successfully',
    });
  } catch (error) {
    return handleError(error, 'Change password');
  }
}
