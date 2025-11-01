import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import PendingUser from '@/models/PendingUser';
import VerificationCode from '@/models/VerificationCode';
import { generateVerificationCode, sendVerificationEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, password, phone, language = 'tr' } = body;

    // Validasyon
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: 'Ad, email ve şifre zorunludur' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Şifre en az 6 karakter olmalıdır' },
        { status: 400 }
      );
    }

    // Email formatı kontrolü
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Geçerli bir email adresi giriniz' },
        { status: 400 }
      );
    }

    await connectDB();

    // Kullanıcı zaten doğrulanmış mı kontrol et
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu email adresi zaten kayıtlı ve doğrulanmış' },
        { status: 400 }
      );
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Pending user kontrol et (daha önce kayıt olmuş ama doğrulamamış olabilir)
    const existingPendingUser = await PendingUser.findOne({ email: email.toLowerCase() });
    
    if (existingPendingUser) {
      // Pending user varsa güncelle (yeniden kayıt oluyor)
      existingPendingUser.fullName = fullName;
      existingPendingUser.passwordHash = hashedPassword;
      existingPendingUser.phone = phone || '';
      existingPendingUser.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 saat daha
      await existingPendingUser.save();
      console.log('✅ Pending user updated:', email);
    } else {
      // Yeni pending user oluştur (email doğrulanana kadar geçici)
      await PendingUser.create({
        fullName,
        email: email.toLowerCase(),
        passwordHash: hashedPassword,
        phone: phone || '',
      });
      console.log('✅ Pending user created:', email);
    }

    // Doğrulama kodu oluştur ve gönder
    let devCode: string | undefined;
    try {
      const verificationCode = generateVerificationCode();
      
      // Kodu veritabanına kaydet
      await VerificationCode.create({
        email: email.toLowerCase(),
        code: verificationCode,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 dakika
      });

      // Email gönder
      const emailSent = await sendVerificationEmail(email.toLowerCase(), verificationCode, language);
      
      // Development mode: Return code if email wasn't sent
      if (process.env.NODE_ENV === 'development' && !emailSent) {
        devCode = verificationCode;
      }
      
      console.log('✅ Verification code prepared for:', email.toLowerCase());
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
      // Email gönderilemese bile kayıt başarılı
      // Kullanıcı daha sonra yeniden kod isteyebilir
    }

    return NextResponse.json(
      {
        message: 'Kayıt başarılı! Email adresinizi doğrulayın / Registration successful! Verify your email',
        requiresVerification: true,
        user: {
          fullName,
          email: email.toLowerCase(),
          emailVerified: false,
        },
        // Development mode: Include code if email wasn't sent
        ...(devCode && { devCode }),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      {
        error: 'Kayıt sırasında bir hata oluştu',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
