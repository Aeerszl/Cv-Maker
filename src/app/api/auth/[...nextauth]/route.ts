import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import UserActivity from '@/models/UserActivity';
import { logger } from '@/lib/logger';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email ve şifre gereklidir');
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error('Kullanıcı bulunamadı');
        }

        if (!user.isActive) {
          throw new Error('Hesabınız askıya alınmış');
        }

        // Email doğrulaması kontrolü
        if (!user.emailVerified) {
          throw new Error('Lütfen önce email adresinizi doğrulayın');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          throw new Error('Hatalı şifre');
        }

        // Login aktivitesini kaydet
        // Note: IP address not available in authorize callback
        // IP tracking is handled via middleware for page views
        await UserActivity.create({
          userId: user._id,
          activityType: 'login',
          ipAddress: 'N/A', // IP tracked separately via middleware
        });

        // lastLogin güncelle
        await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

        return {
          id: (user._id as mongoose.Types.ObjectId).toString(),
          email: user.email,
          name: user.fullName,
          image: user.profilePhoto,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 gün
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
      }
      
      // Profile güncellemesi sonrası veya session refresh
      if (trigger === 'update' && session) {
        token.name = session.name;
        token.email = session.email;
      }
      
      // Her session check'inde DB'den güncel bilgiyi çek
      if (token.email && !user) {
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: token.email }).select('fullName email role');
          if (dbUser) {
            token.name = dbUser.fullName;
            token.email = dbUser.email;
            token.role = dbUser.role;
          }
        } catch (error) {
          logger.error('Error fetching user in JWT callback', error);
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  events: {
    async signOut({ token }) {
      // Logout aktivitesini kaydet
      if (token?.id) {
        await connectDB();
        await UserActivity.create({
          userId: token.id as string,
          activityType: 'logout',
          ipAddress: '',
        });
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
