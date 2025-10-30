/**
 * CV Builder Type Definitions
 * 
 * TypeScript interfaces for CV creation form
 * 
 * @module types/cv-builder
 */

/**
 * Personal Information - Updated to match backend schema
 */
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  title: string; // Job title
  linkedIn?: string;
  github?: string;
  instagram?: string;
  website?: string;
  photo?: string;
}

/**
 * Professional Summary
 */
export interface Summary {
  text: string;
}

/**
 * Work Experience Entry
 */
export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

/**
 * Education Entry
 */
export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa?: string;
}

/**
 * Skill Entry
 */
export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

/**
 * Language Entry
 */
export interface Language {
  id: string;
  name: string;
  level: 'basic' | 'intermediate' | 'fluent' | 'native';
}

/**
 * Certificate Entry
 */
export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

/**
 * Complete CV Data
 */
export interface CVData {
  personalInfo: PersonalInfo;
  summary: Summary;
  experience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  certificates: Certificate[];
  template: 'modern' | 'classic' | 'creative' | 'professional' | 'minimal';
}

/**
 * Form Steps
 */
export type FormStep = 
  | 'personal'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'template'
  | 'preview';

/**
 * Step Configuration
 */
export interface StepConfig {
  id: FormStep;
  title: string;
  description: string;
  icon: string;
}
