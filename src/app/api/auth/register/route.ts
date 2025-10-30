import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import UserActivity from '@/models/UserActivity';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, password, phone } = body;

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

    // Kullanıcı zaten var mı kontrol et
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu email adresi zaten kayıtlı' },
        { status: 400 }
      );
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcı oluştur
    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      passwordHash: hashedPassword,
      phone: phone || '', // Optional phone
      role: 'user',
      isActive: true,
    });

    // Register aktivitesini kaydet (optional - hata olsa bile kayıt başarılı)
    try {
      await UserActivity.create({
        userId: user._id,
        activityType: 'user_register', // Şimdi enum'da var
        activityDetails: { action: 'register', email: user.email },
      });
    } catch (activityError) {
      console.error('Activity logging failed:', activityError);
      // Activity log hatası kayıt işlemini etkilemesin
    }

    return NextResponse.json(
      {
        message: 'Kayıt başarılı!',
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
        },
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
