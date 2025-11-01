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

export async function POST(request: NextRequest) {
  try {
    const { email, language = 'tr' } = await request.json();

    // Validate email
    if (!email || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return NextResponse.json(
        { error: 'Geçerli bir email adresi giriniz / Please enter a valid email' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user exists (pending or verified)
    const user = await User.findOne({ email: email.toLowerCase() });
    const pendingUser = await PendingUser.findOne({ email: email.toLowerCase() });
    
    if (!user && !pendingUser) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı / User not found' },
        { status: 404 }
      );
    }

    // Check if user is already verified
    if (user && user.emailVerified) {
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
      return NextResponse.json(
        {
          error: 'Lütfen 60 saniye bekleyin / Please wait 60 seconds',
          waitTime: 60 - Math.floor((Date.now() - recentCode.createdAt.getTime()) / 1000),
        },
        { status: 429 }
      );
    }

    // Generate verification code
    const code = generateVerificationCode();

    // Save verification code to database
    await VerificationCode.create({
      email: email.toLowerCase(),
      code,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });

    // Send verification email
    const emailSent = await sendVerificationEmail(email, code, language);

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
    console.error('❌ Send verification error:', error);
    return NextResponse.json(
      { error: 'Bir hata oluştu / An error occurred' },
      { status: 500 }
    );
  }
}
