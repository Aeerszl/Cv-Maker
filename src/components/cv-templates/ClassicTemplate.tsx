/**
 * Classic CV Template
 * 
 * ATS-friendly traditional single-column layout
 * 
 * @module components/cv-templates/ClassicTemplate
 */

import React from 'react';
import type { CVData } from '@/types/cv-builder';

interface ClassicTemplateProps {
  data: CVData;
}

export function ClassicTemplate({ data }: ClassicTemplateProps) {
  const { personalInfo, summary, experience, education, skills, languages, certificates } = data;

  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-gray-900 shadow-lg mx-auto p-12">
      {/* Header */}
      <header className="text-center border-b-2 border-gray-800 pb-6 mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        {personalInfo.title && (
          <p className="text-xl text-gray-600 mb-4">{personalInfo.title}</p>
        )}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-700">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>•</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.city && <span>•</span>}
          {personalInfo.city && <span>{personalInfo.city}</span>}
        </div>
        {(personalInfo.linkedIn || personalInfo.website) && (
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 mt-2">
            {personalInfo.linkedIn && <span>{personalInfo.linkedIn}</span>}
            {personalInfo.website && <span>•</span>}
            {personalInfo.website && <span>{personalInfo.website}</span>}
          </div>
        )}
      </header>

      {/* Professional Summary */}
      {summary && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide border-b border-gray-300 pb-1">
            Profesyonel Özet
          </h2>
          <p className="text-gray-700 leading-relaxed text-justify">{summary}</p>
        </section>
      )}

      {/* Work Experience */}
      {experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide border-b border-gray-300 pb-1">
            İş Deneyimi
          </h2>
          <div className="space-y-5">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                  <span className="text-sm text-gray-600">
                    {exp.startDate} - {exp.endDate || 'Günümüz'}
                  </span>
                </div>
                <p className="text-gray-700 font-semibold mb-1">
                  {exp.company} {exp.location && `• ${exp.location}`}
                </p>
                {exp.description && (
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                    {exp.description.split('\n').map((item, idx) => (
                      item.trim() && <li key={idx} className="leading-relaxed">{item.trim()}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide border-b border-gray-300 pb-1">
            Eğitim
          </h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                  <span className="text-sm text-gray-600">
                    {edu.startDate} - {edu.endDate || 'Günümüz'}
                  </span>
                </div>
                <p className="text-gray-700 font-semibold">
                  {edu.school} {edu.location && `• ${edu.location}`}
                </p>
                {edu.field && <p className="text-gray-600">{edu.field}</p>}
                {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide border-b border-gray-300 pb-1">
            Yetenekler
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm font-medium"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide border-b border-gray-300 pb-1">
            Diller
          </h2>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {languages.map((lang) => (
              <div key={lang.id} className="flex items-center gap-2">
                <span className="font-semibold text-gray-800">{lang.name}</span>
                <span className="text-gray-600">—</span>
                <span className="text-gray-600 capitalize">{lang.level}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certificates */}
      {certificates.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide border-b border-gray-300 pb-1">
            Sertifikalar
          </h2>
          <div className="space-y-2">
            {certificates.map((cert) => (
              <div key={cert.id}>
                <p className="font-semibold text-gray-800">{cert.name}</p>
                <p className="text-gray-600 text-sm">
                  {cert.issuer} {cert.date && `• ${cert.date}`}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
