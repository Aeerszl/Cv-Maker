/**
 * Dev: Check Users in MongoDB
 * 
 * DEVELOPMENT ONLY - Lists all users in database
 * DELETE THIS FILE IN PRODUCTION!
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

    // Get all users (without passwords for security)
    const users = await User.find({}).select('-password').lean();

    // Also check if admin exists
    const adminExists = await User.findOne({ 
      email: 'aliee.developer@gmail.com',
      role: 'admin' 
    }).select('-password').lean();

    return NextResponse.json({
      success: true,
      totalUsers: users.length,
      adminExists: !!adminExists,
      adminDetails: adminExists || null,
      allUsers: users.map(user => ({
        fullName: user.fullName,
        email: user.email,
        role: user.role || 'user',
        emailVerified: user.emailVerified,
        createdAt: user.createdAt
      }))
    });
  } catch (error) {
    console.error('❌ Error checking users:', error);
    return NextResponse.json(
      { error: 'Database error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
