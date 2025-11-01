/**
 * Analytics Models
 * 
 * Track page views, link clicks, and system metrics
 * 
 * @module models/Analytics
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

// ==================== PAGE VIEW ====================

export interface IPageView extends Document {
  page: string; // URL path
  ip: string;
  userAgent: string;
  referrer?: string;
  timestamp: Date;
}

const PageViewSchema = new Schema<IPageView>({
  page: { type: String, required: true, index: true },
  ip: { type: String, required: true },
  userAgent: { type: String, required: true },
  referrer: { type: String },
  timestamp: { type: Date, default: Date.now, index: true },
});

// Index for analytics queries
PageViewSchema.index({ page: 1, timestamp: -1 });
PageViewSchema.index({ ip: 1, timestamp: -1 });

export const PageView: Model<IPageView> =
  mongoose.models.PageView || mongoose.model<IPageView>('PageView', PageViewSchema);

// ==================== LINK CLICK ====================

export interface ILinkClick extends Document {
  linkUrl: string; // External link clicked
  page: string; // Page where link was clicked
  ip: string;
  timestamp: Date;
}

const LinkClickSchema = new Schema<ILinkClick>({
  linkUrl: { type: String, required: true, index: true },
  page: { type: String, required: true },
  ip: { type: String, required: true },
  timestamp: { type: Date, default: Date.now, index: true },
});

LinkClickSchema.index({ linkUrl: 1, timestamp: -1 });

export const LinkClick: Model<ILinkClick> =
  mongoose.models.LinkClick || mongoose.model<ILinkClick>('LinkClick', LinkClickSchema);

// ==================== EMAIL USAGE ====================

export interface IEmailUsage extends Document {
  month: string; // YYYY-MM format
  emailsSent: number;
  lastEmailSentAt?: Date;
}

const EmailUsageSchema = new Schema<IEmailUsage>({
  month: { type: String, required: true, unique: true, index: true },
  emailsSent: { type: Number, default: 0 },
  lastEmailSentAt: { type: Date },
});

export const EmailUsage: Model<IEmailUsage> =
  mongoose.models.EmailUsage || mongoose.model<IEmailUsage>('EmailUsage', EmailUsageSchema);
