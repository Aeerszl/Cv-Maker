import mongoose, { Schema, Document, Model } from 'mongoose';

// CV Şablonu tipleri
export type CVTemplate = 'modern' | 'classic' | 'creative' | 'professional' | 'minimal' | 'executive' | 'techpro' | 'elegant' | 'bold';

// Kişisel Bilgiler
export interface IPersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  photo?: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
  website?: string;
  summary: string;
}

// İş Deneyimi
export interface IWorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  location?: string;
}

// Eğitim
export interface IEducation {
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  gpa?: string;
}

// Yetenek
export interface ISkill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

// Dil
export interface ILanguage {
  name: string;
  level: 'basic' | 'intermediate' | 'fluent' | 'native';
}

// Sertifika
export interface ICertification {
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

// Proje
export interface IProject {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  startDate?: string;
  endDate?: string;
}

export interface ICV extends Document {
  userId: mongoose.Types.ObjectId;
  templateId?: mongoose.Types.ObjectId; // FK to Templates
  title: string;
  template: CVTemplate;
  cvLanguage?: 'tr' | 'en'; // CV Language
  colorPalette?: string; // JSON string of hex colors
  status: 'draft' | 'completed' | 'published';
  personalInfo: IPersonalInfo;
  summary?: string; // Özet alanı ayrı
  workExperience: IWorkExperience[];
  education: IEducation[];
  skills: ISkill[];
  languages: ILanguage[];
  certifications: ICertification[];
  projects: IProject[];
  viewCount: number;
  lastModified: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CVSchema: Schema<ICV> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    templateId: {
      type: Schema.Types.ObjectId,
      ref: 'Template',
    },
    title: {
      type: String,
      required: [true, 'CV başlığı gereklidir'],
      trim: true,
    },
    template: {
      type: String,
      enum: ['modern', 'classic', 'creative', 'professional', 'minimal', 'executive', 'techpro', 'elegant', 'bold'],
      default: 'modern',
    },
    cvLanguage: {
      type: String,
      enum: ['tr', 'en'],
      default: 'tr',
    },
    colorPalette: {
      type: String, // JSON string
    },
    status: {
      type: String,
      enum: ['draft', 'completed', 'published'],
      default: 'draft',
    },
    personalInfo: {
      fullName: { type: String, required: true },
      title: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      location: { type: String, required: true },
      photo: { type: String },
      linkedin: { type: String },
      github: { type: String },
      instagram: { type: String },
      website: { type: String },
      summary: { type: String, required: true },
    },
    summary: {
      type: String,
    },
    workExperience: [
      {
        company: { type: String, required: true },
        position: { type: String, required: true },
        startDate: { type: String, required: true },
        endDate: { type: String },
        current: { type: Boolean, default: false },
        description: { type: String }, // Optional yapıldı
        location: { type: String },
        _id: false, // Subdocument _id'sini kaldır
      },
    ],
    education: [
      {
        school: { type: String, required: true },
        degree: { type: String, required: true },
        field: { type: String, required: true },
        startDate: { type: String, required: true },
        endDate: { type: String },
        current: { type: Boolean, default: false },
        gpa: { type: String },
        _id: false,
      },
    ],
    skills: [
      {
        name: { type: String, required: true },
        level: {
          type: String,
          enum: ['beginner', 'intermediate', 'advanced', 'expert'],
          default: 'intermediate',
        },
        _id: false,
      },
    ],
    languages: [
      {
        name: { type: String, required: true },
        level: {
          type: String,
          enum: ['basic', 'intermediate', 'fluent', 'native'],
          default: 'intermediate',
        },
        _id: false,
      },
    ],
    certifications: [
      {
        name: { type: String, required: true },
        issuer: { type: String, required: true },
        date: { type: String, required: true },
        url: { type: String },
        _id: false,
      },
    ],
    projects: [
      {
        name: { type: String, required: true },
        description: { type: String, required: true },
        technologies: [{ type: String }],
        url: { type: String },
        startDate: { type: String },
        endDate: { type: String },
        _id: false,
      },
    ],
    viewCount: {
      type: Number,
      default: 0,
    },
    lastModified: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index oluştur - daha hızlı sorgu için
CVSchema.index({ userId: 1, createdAt: -1 });
CVSchema.index({ templateId: 1 });
CVSchema.index({ status: 1 });

const CV: Model<ICV> = mongoose.models.CV || mongoose.model<ICV>('CV', CVSchema);

export default CV;
