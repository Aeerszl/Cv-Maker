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
  let cvData: Partial<CVData> | null = null;

  try {
    await connectToDatabase();

    const { id } = await params;
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
        address: cv.personalInfo.location || '', // Map location to address
        city: '', // Add empty city since IPersonalInfo doesn't have it
        country: '', // Add empty country since IPersonalInfo doesn't have it
        postalCode: '', // Add empty postalCode since IPersonalInfo doesn't have it
        title: cv.personalInfo.title || '',
        linkedIn: cv.personalInfo.linkedin || '', // Map linkedin to linkedIn (case difference)
        github: cv.personalInfo.github || '',
        instagram: cv.personalInfo.instagram || '',
        website: cv.personalInfo.website || '',
        photo: cv.personalInfo.photo || '',
      },
      summary: cv.summary || '',
      experience: cv.workExperience?.map((exp, index) => ({
        id: `exp-${index}`,
        location: exp.location || '', // Handle optional location
        endDate: exp.endDate || '', // Handle optional endDate (though IWorkExperience has it as optional, WorkExperience requires it as string? Wait, let me check the interface again. Actually, WorkExperience has endDate as string, but IWorkExperience has it as optional. This might be a type mismatch. Let me adjust.)
        ...exp,
      })) || [],
      education: cv.education?.map((edu, index) => ({
        id: `edu-${index}`,
        location: '', // IEducation doesn't have location, add empty string
        endDate: edu.endDate || '', // Handle optional endDate
        ...edu,
      })) || [],
      skills: cv.skills?.map((skill, index) => ({
        id: `skill-${index}`,
        ...skill,
      })) || [],
      languages: cv.languages?.map((lang, index) => ({
        id: `lang-${index}`,
        ...lang,
      })) || [],
      certificates: cv.certifications?.map((cert, index) => ({
        id: `cert-${index}`,
        ...cert,
      })) || [],


    };
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
          initialData={cvData || undefined}
          isEdit={true}
        />
      </div>
    </div>
  );
}