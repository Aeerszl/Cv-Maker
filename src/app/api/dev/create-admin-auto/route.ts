/**
 * Dev: Auto-Create Admin User
 * 
 * DEVELOPMENT ONLY - Automatically creates admin user
 * DELETE THIS FILE IN PRODUCTION!
 * 
 * GET /api/dev/create-admin-auto
 */

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Not available in production' },
        { status: 403 }
      );
    }

    await dbConnect();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      email: 'aliee.developer@gmail.com'
    });

    if (existingAdmin) {
      return NextResponse.json({
        success: false,
        message: 'Admin already exists!',
        admin: {
          email: existingAdmin.email,
          fullName: existingAdmin.fullName,
          role: existingAdmin.role,
          emailVerified: existingAdmin.emailVerified
        }
      });
    }

    // Create admin user with pre-hashed password
    const adminUser = await User.create({
      fullName: 'Aliee',
      email: 'aliee.developer@gmail.com',
      passwordHash: '$2b$12$YCOZ5ACtK.4yXqBGvhgH8OBhXd0U0sWinWX0Mu2cNswiDjuwZljm2',
      phone: '',
      role: 'admin',
      isActive: true,
      emailVerified: true,
      createdAt: new Date('2025-11-01T13:23:47.960Z'),
      updatedAt: new Date('2025-11-01T13:23:47.960Z')
    });

    console.log('✅ Admin user created successfully!');

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully!',
      admin: {
        id: adminUser._id,
        email: adminUser.email,
        fullName: adminUser.fullName,
        role: adminUser.role,
        emailVerified: adminUser.emailVerified
      },
      credentials: {
        email: 'aliee.developer@gmail.com',
        password: 'Aliee123+',
        note: 'Save these credentials in your password manager!'
      }
    });

  } catch (error) {
    console.error('❌ Error creating admin:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create admin', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
