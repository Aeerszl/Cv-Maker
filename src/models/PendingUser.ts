/**
 * PendingUser Model
 * 
 * Temporary storage for users awaiting email verification
 * Users are moved to the main User collection after verification
 * 
 * @module models/PendingUser
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPendingUser extends Document {
  fullName: string;
  email: string;
  passwordHash: string;
  phone?: string;
  createdAt: Date;
  expiresAt: Date; // Auto-delete after 24 hours
}

const PendingUserSchema = new Schema<IPendingUser>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      index: { expires: 0 }, // TTL index - auto-delete when expiresAt is reached
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in development
const PendingUser: Model<IPendingUser> = 
  mongoose.models.PendingUser || mongoose.model<IPendingUser>('PendingUser', PendingUserSchema);

export default PendingUser;
