import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITemplateStructure {
  sections: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  layout: 'single' | 'two-column';
}

export interface ITemplate extends Document {
  name: string;
  previewUrl?: string;
  description: string;
  structure: ITemplateStructure;
  isActive: boolean;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const TemplateSchema: Schema<ITemplate> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Şablon adı gereklidir'],
      trim: true,
      unique: true,
    },
    previewUrl: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Şablon açıklaması gereklidir'],
    },
    structure: {
      type: Schema.Types.Mixed, // JSON için
      required: [true, 'Şablon yapısı gereklidir'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// İndeksler
TemplateSchema.index({ isActive: 1 });
TemplateSchema.index({ usageCount: -1 });

const Template: Model<ITemplate> =
  mongoose.models.Template || mongoose.model<ITemplate>('Template', TemplateSchema);

export default Template;