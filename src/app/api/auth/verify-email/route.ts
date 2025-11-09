/**
 * Verify Email Code API Route
 * 
 * POST /api/auth/verify-email
 * 
 * Verifies the code sent to user's email
 * 
 * @module app/api/auth/verify-email
 */

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import PendingUser from '@/models/PendingUser';
import VerificationCode from '@/models/VerificationCode';
import { sendWelcomeEmail } from '@/lib/email';
import { rateLimit, RATE_LIMITS } from '@/lib/rateLimit';
import { handleError } from '@/lib/errorHandler';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  // ✅ RATE LIMIT: Brute force code denemelerini önle
  const rateLimitResult = rateLimit(request, RATE_LIMITS.AUTH_STRICT);
  if (rateLimitResult) return rateLimitResult;
  
  try {
    const { email, code, language = 'tr' } = await request.json();

    // Validate input
    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email ve kod gereklidir / Email and code are required' },
        { status: 400 }
      );
    }

    // Validate code format (6 digits)
    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: 'Geçersiz kod formatı / Invalid code format' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find pending user first (not yet verified)
    const pendingUser = await PendingUser.findOne({ email: email.toLowerCase() });
    if (!pendingUser) {
      // Maybe already verified? Check main User collection
      const user = await User.findOne({ email: email.toLowerCase() });
      if (user && user.emailVerified) {
        return NextResponse.json(
          { error: 'Email zaten doğrulanmış / Email already verified' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı / User not found' },
        { status: 404 }
      );
    }

    // Find verification code
    const verificationCode = await VerificationCode.findOne({
      email: email.toLowerCase(),
      code,
      isUsed: false,
    }).sort({ createdAt: -1 }); // Get latest code

    if (!verificationCode) {
      return NextResponse.json(
        { error: 'Geçersiz kod / Invalid code' },
        { status: 400 }
      );
    }

    // Check if code is expired
    if (verificationCode.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Kod süresi dolmuş / Code has expired' },
        { status: 400 }
      );
    }

    // Mark code as used
    await verificationCode.markAsUsed();

    // Create actual User from PendingUser
    const newUser = await User.create({
      fullName: pendingUser.fullName,
      email: pendingUser.email,
      passwordHash: pendingUser.passwordHash,
      phone: pendingUser.phone || '',
      role: 'user',
      isActive: true,
      emailVerified: true, // Verified!
    });

    // Delete pending user
    await PendingUser.deleteOne({ _id: pendingUser._id });
    logger.info('User created and pending user deleted', { email: newUser.email });

    // Send welcome email
    try {
      await sendWelcomeEmail(newUser.email, newUser.fullName, language);
    } catch (emailError) {
      logger.warn('Welcome email error (non-critical)', { error: String(emailError) });
      // Don't fail the verification if welcome email fails
    }

    // Delete all unused codes for this email
    await VerificationCode.deleteMany({
      email: email.toLowerCase(),
      isUsed: false,
    });

    return NextResponse.json(
      {
        message: 'Email başarıyla doğrulandı / Email verified successfully',
        verified: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, 'Email verification');
  }
}
