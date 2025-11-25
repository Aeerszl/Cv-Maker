/**
 * CV Edit Page
 *
 * Server-side page for editing existing CVs
 *
 * @module app/cv/edit/[id]/page
 */

import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import CVBuilderClient from '@/app/cv/create/CVBuilderClient';
import connectToDatabase from '@/lib/mongodb';
import CV from '@/models/CV';
import type { CVData } from '@/types/cv-builder';

interface EditPageProps {
  params: {
    id: string;
  };
}

export default async function EditPage({ params }: EditPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const userName = session.user.name || session.user.email || 'User';
  const userEmail = session.user.email || undefined;
  let cvData: Partial<CVData> | null = null;
  let cvId: string | null = null;

  try {
    await connectToDatabase();

    // Await params first (Next.js 15 requirement)
    const resolvedParams = await params;
    const { id } = resolvedParams;
    cvId = id;
    
    const cv = await CV.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!cv) {
      redirect('/cvs');
    }

    // Transform CV data for the builder
    cvData = {
      personalInfo: {
        firstName: cv.personalInfo.fullName?.split(' ')[0] || '',
        lastName: cv.personalInfo.fullName?.split(' ').slice(1).join(' ') || '',
        email: cv.personalInfo.email || '',
        phone: cv.personalInfo.phone || '',
        address: cv.personalInfo.location || '',
        city: cv.personalInfo.location || '',
        country: '',
        postalCode: '',
        title: cv.personalInfo.title || '',
        linkedIn: cv.personalInfo.linkedin || '',
        github: cv.personalInfo.github || '',
        instagram: cv.personalInfo.instagram || '',
        website: cv.personalInfo.website || '',
        photo: cv.personalInfo.photo || '',
      },
      summary: cv.summary || '',
      experience: cv.workExperience?.map((exp, index) => ({
        id: `exp-${index}`,
        company: exp.company || '',
        position: exp.position || '',
        location: exp.location || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        current: exp.current || false,
        description: exp.description || '',
      })) || [],
      education: cv.education?.map((edu, index) => ({
        id: `edu-${index}`,
        school: edu.school || '',
        degree: (edu.degree as 'high-school' | 'associate' | 'bachelor' | 'master' | 'phd' | 'other') || 'bachelor',
        field: edu.field || '',
        location: '',
        startDate: edu.startDate || '',
        endDate: edu.endDate || '',
        current: edu.current || false,
        gpa: edu.gpa || '',
      })) || [],
      skills: cv.skills?.map((skill, index) => ({
        id: `skill-${index}`,
        name: skill.name || '',
        level: (skill.level as 'beginner' | 'intermediate' | 'advanced' | 'expert') || 'intermediate',
        years: skill.years,
      })) || [],
      languages: cv.languages?.map((lang, index) => ({
        id: `lang-${index}`,
        name: lang.name || '',
        level: (lang.level as 'basic' | 'intermediate' | 'fluent' | 'native') || 'intermediate',
      })) || [],
      certificates: cv.certifications?.map((cert, index) => ({
        id: `cert-${index}`,
        name: cert.name || '',
        issuer: cert.issuer || '',
        date: cert.date || '',
        url: cert.url || '',
      })) || [],
      projects: cv.projects?.map((project, index) => ({
        id: `project-${index}`,
        title: project.name || '', // Backend has 'name', frontend has 'title'
        description: project.description || '',
        link: project.url || '', // Backend has 'url', frontend has 'link'
        technologies: project.technologies || [],
      })) || [],
      cvLanguage: cv.cvLanguage || 'tr', // Get from backend or default to 'tr'
      template: cv.template || 'modern',
    };
    
    // Store the CV ID for the client component to use when updating
    const cvWithId = cvData as Partial<CVData> & { _id?: string };
    cvWithId._id = cvId;
  } catch (error) {
    console.error('Error loading CV for edit:', error);
    redirect('/cvs');
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            CV&apos;yi Düzenle
          </h1>
          <p className="text-muted-foreground">
            CV&apos;nizi güncelleyin ve kaydedin
          </p>
        </div>

        <CVBuilderClient
          userName={userName}
          userEmail={userEmail}
          initialData={cvData || undefined}
          isEdit={true}
        />
      </div>
    </div>
  );
}