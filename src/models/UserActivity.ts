import mongoose, { Schema, Document, Model } from 'mongoose';

export type ActivityType =
  | 'login'
  | 'logout'
  | 'cv_create'
  | 'cv_edit'
  | 'cv_delete'
  | 'cv_view'
  | 'profile_update'
  | 'user_register';

export interface IUserActivity extends Document {
  userId: mongoose.Types.ObjectId;
  activityType: ActivityType;
  ipAddress?: string;
  activityDetails?: Record<string, unknown>; // JSON
  timestamp: Date;
}

const UserActivitySchema: Schema<IUserActivity> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    activityType: {
      type: String,
      enum: ['login', 'logout', 'cv_create', 'cv_edit', 'cv_delete', 'cv_view', 'profile_update', 'user_register'],
      required: true,
    },
    ipAddress: {
      type: String,
    },
    activityDetails: {
      type: Schema.Types.Mixed, // JSON için
    },
  },
  {
    timestamps: {
      createdAt: 'timestamp',
      updatedAt: false,
    },
  }
);

// İndeksler
UserActivitySchema.index({ userId: 1 });
UserActivitySchema.index({ timestamp: -1 });
UserActivitySchema.index({ activityType: 1 });

const UserActivity: Model<IUserActivity> =
  mongoose.models.UserActivity || mongoose.model<IUserActivity>('UserActivity', UserActivitySchema);

export default UserActivity;