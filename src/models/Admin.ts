import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdmin extends Document {
  userId: mongoose.Types.ObjectId;
  permissionLevel: 'super' | 'moderator';
  createdAt: Date;
}

const AdminSchema: Schema<IAdmin> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    permissionLevel: {
      type: String,
      enum: ['super', 'moderator'],
      default: 'moderator',
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

// İndeksler
AdminSchema.index({ userId: 1 }, { unique: true });

const Admin: Model<IAdmin> =
  mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);

export default Admin;