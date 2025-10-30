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
      _id: (cv as any)._id.toString(),
      title: cv.title,
      template: cv.template,
      status: cv.status,
      personalInfo: cv.personalInfo,
      summary: { text: cv.summary || '' },
      workExperience: cv.workExperience || [],
      education: cv.education || [],
      skills: cv.skills || [],
      languages: cv.languages || [],
      certifications: cv.certifications || [],
      projects: cv.projects || [],
      createdAt: cv.createdAt,
      updatedAt: cv.updatedAt,
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