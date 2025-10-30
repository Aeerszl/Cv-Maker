import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStatistics extends Document {
  statDate: Date;
  totalUsers: number;
  activeUsers: number;
  totalCvsCreated: number;
  dailyVisitors: number;
  monthlyVisitors: number;
  templateUsage: Record<string, number>; // JSON: {"template_1": 45, "template_2": 78}
  popularFeatures: Record<string, number>; // JSON: {"pdf_download": 120, "color_change": 89}
  lastUpdated: Date;
}

const StatisticsSchema: Schema<IStatistics> = new Schema(
  {
    statDate: {
      type: Date,
      required: true,
      unique: true,
    },
    totalUsers: {
      type: Number,
      default: 0,
    },
    activeUsers: {
      type: Number,
      default: 0,
    },
    totalCvsCreated: {
      type: Number,
      default: 0,
    },
    dailyVisitors: {
      type: Number,
      default: 0,
    },
    monthlyVisitors: {
      type: Number,
      default: 0,
    },
    templateUsage: {
      type: Map,
      of: Number,
      default: {},
    },
    popularFeatures: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  {
    timestamps: {
      createdAt: false,
      updatedAt: 'lastUpdated',
    },
  }
);

// İndeksler
StatisticsSchema.index({ statDate: 1 }, { unique: true });

const Statistics: Model<IStatistics> =
  mongoose.models.Statistics || mongoose.model<IStatistics>('Statistics', StatisticsSchema);

export default Statistics;