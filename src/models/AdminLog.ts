import mongoose, { Schema, Document, Model } from 'mongoose';

export type AdminActionType =
  | 'user_manage'
  | 'user_delete'
  | 'user_suspend'
  | 'cv_delete'
  | 'template_add'
  | 'template_edit'
  | 'template_delete'
  | 'stats_view';

export interface IAdminLog extends Document {
  adminId: mongoose.Types.ObjectId;
  actionType: AdminActionType;
  targetEntity: string; // "user", "cv", "template"
  targetId: string; // Hedef kaydın ID'si
  actionDetails?: Record<string, unknown>; // JSON
  timestamp: Date;
}

const AdminLogSchema: Schema<IAdminLog> = new Schema(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
    actionType: {
      type: String,
      enum: ['user_manage', 'user_delete', 'user_suspend', 'cv_delete', 'template_add', 'template_edit', 'template_delete', 'stats_view'],
      required: true,
    },
    targetEntity: {
      type: String,
      required: true,
    },
    targetId: {
      type: String,
      required: true,
    },
    actionDetails: {
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
AdminLogSchema.index({ adminId: 1 });
AdminLogSchema.index({ timestamp: -1 });
AdminLogSchema.index({ actionType: 1 });

const AdminLog: Model<IAdminLog> =
  mongoose.models.AdminLog || mongoose.model<IAdminLog>('AdminLog', AdminLogSchema);

export default AdminLog;