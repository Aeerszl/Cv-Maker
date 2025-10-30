import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import UserActivity from '@/models/UserActivity';

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

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          throw new Error('Hatalı şifre');
        }

        // Login aktivitesini kaydet
        await UserActivity.create({
          userId: user._id,
          activityType: 'login',
          ipAddress: '', // TODO: IP adresini al
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role;
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
