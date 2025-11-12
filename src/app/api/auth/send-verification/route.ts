/**
 * Send Verification Code API Route
 * 
 * POST /api/auth/send-verification
 * 
 * Sends a verification code to user's email
 * 
 * @module app/api/auth/send-verification
 */

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import PendingUser from '@/models/PendingUser';
import VerificationCode from '@/models/VerificationCode';
import { generateVerificationCode, sendVerificationEmail } from '@/lib/email';
import { rateLimit, RATE_LIMITS } from '@/lib/rateLimit';
import { handleError } from '@/lib/errorHandler';

export async function POST(request: NextRequest) {
  console.log('📨 [send-verification] API endpoint called');
  
  // ✅ RATE LIMIT: Email spam önleme
  const rateLimitResult = rateLimit(request, RATE_LIMITS.EMAIL_SEND);
  if (rateLimitResult) {
    console.log('⚠️ [send-verification] Rate limited');
    return rateLimitResult;
  }
  
  try {
    const { email, language = 'tr' } = await request.json();
    console.log('📨 [send-verification] Request payload:', { email, language });

    // Validate email
    if (!email || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      console.log('❌ [send-verification] Invalid email format:', email);
      return NextResponse.json(
        { error: 'Geçerli bir email adresi giriniz / Please enter a valid email' },
        { status: 400 }
      );
    }

    console.log('🔄 [send-verification] Connecting to database...');
    await dbConnect();
    console.log('✅ [send-verification] Database connected');

    // Check if user exists (pending or verified)
    const user = await User.findOne({ email: email.toLowerCase() });
    const pendingUser = await PendingUser.findOne({ email: email.toLowerCase() });
    
    console.log('🔍 [send-verification] User lookup:', {
      userExists: !!user,
      pendingUserExists: !!pendingUser,
      emailVerified: user?.emailVerified
    });
    
    if (!user && !pendingUser) {
      console.log('❌ [send-verification] User not found');
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı / User not found' },
        { status: 404 }
      );
    }

    // Check if user is already verified
    if (user && user.emailVerified) {
      console.log('⚠️ [send-verification] Email already verified');
      return NextResponse.json(
        { error: 'Email zaten doğrulanmış / Email already verified' },
        { status: 400 }
      );
    }

    // Check for recent verification code (rate limiting)
    const recentCode = await VerificationCode.findOne({
      email: email.toLowerCase(),
      createdAt: { $gte: new Date(Date.now() - 60 * 1000) }, // Last minute
    });

    if (recentCode) {
      const waitTime = 60 - Math.floor((Date.now() - recentCode.createdAt.getTime()) / 1000);
      console.log('⏳ [send-verification] Rate limited - recent code exists:', { waitTime });
      return NextResponse.json(
        {
          error: 'Lütfen 60 saniye bekleyin / Please wait 60 seconds',
          waitTime,
        },
        { status: 429 }
      );
    }

    // Generate verification code
    const code = generateVerificationCode();
    console.log('🔑 [send-verification] Generated code:', code);

    // Save verification code to database
    await VerificationCode.create({
      email: email.toLowerCase(),
      code,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });
    console.log('💾 [send-verification] Code saved to database');

    // Send verification email
    console.log('📧 [send-verification] Attempting to send email...');
    const emailSent = await sendVerificationEmail(email, code, language);
    console.log('📧 [send-verification] Email send result:', { emailSent });

    return NextResponse.json(
      {
        message: 'Doğrulama kodu gönderildi / Verification code sent',
        expiresIn: 300, // 5 minutes in seconds
        // In development mode, return code if email wasn't sent
        ...(process.env.NODE_ENV === 'development' && !emailSent && { devCode: code }),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ [send-verification] Error:', error);
    return handleError(error, 'Send verification code');
  }
}
