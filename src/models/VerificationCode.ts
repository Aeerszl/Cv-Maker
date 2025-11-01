/**
 * Verification Code Model
 * 
 * Stores email verification codes with expiry time
 * 
 * @module models/VerificationCode
 */

import mongoose from 'mongoose';

export interface IVerificationCode extends mongoose.Document {
  email: string;
  code: string;
  createdAt: Date;
  expiresAt: Date;
  isUsed: boolean;
}

const VerificationCodeSchema = new mongoose.Schema<IVerificationCode>(
  {
    email: {
      type: String,
      required: [true, 'Email gereklidir / Email is required'],
      lowercase: true,
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Kod gereklidir / Code is required'],
      length: 6,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for automatic deletion of expired codes
VerificationCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for faster email lookups
VerificationCodeSchema.index({ email: 1, isUsed: 1 });

/**
 * Check if code is still valid
 */
VerificationCodeSchema.methods.isValid = function(): boolean {
  return !this.isUsed && this.expiresAt > new Date();
};

/**
 * Mark code as used
 */
VerificationCodeSchema.methods.markAsUsed = async function(): Promise<void> {
  this.isUsed = true;
  await this.save();
};

const VerificationCode = mongoose.models.VerificationCode || 
  mongoose.model<IVerificationCode>('VerificationCode', VerificationCodeSchema);

export default VerificationCode;
