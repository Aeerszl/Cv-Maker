/**
 * Minimal CV Template
 * 
 * ATS-friendly minimalist design with maximum whitespace
 * 
 * @module components/cv-templates/MinimalTemplate
 */

import React from 'react';
import type { CVData } from '@/types/cv-builder';

interface MinimalTemplateProps {
  data: CVData;
}

export function MinimalTemplate({ data }: MinimalTemplateProps) {
  const { personalInfo, summary, experience, education, skills, languages, certificates } = data;

  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-gray-900 shadow-lg mx-auto p-16">
      {/* Simple Header */}
      <header className="mb-12">
        <h1 className="text-5xl font-light text-gray-900 mb-2">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        {personalInfo.title && (
          <p className="text-lg text-gray-600 font-light tracking-wide mb-6">
            {personalInfo.title}
          </p>
        )}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 font-light">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.city && <span>{personalInfo.city}</span>}
        </div>
        {(personalInfo.linkedIn || personalInfo.website) && (
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 font-light mt-1">
            {personalInfo.linkedIn && <span>{personalInfo.linkedIn}</span>}
            {personalInfo.website && <span>{personalInfo.website}</span>}
          </div>
        )}
      </header>

      {/* Professional Summary */}
      {summary.text && (
        <section className="mb-12">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
            About
          </h2>
          <p className="text-gray-700 leading-loose font-light">{summary.text}</p>
        </section>
      )}

      {/* Work Experience */}
      {experience.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-6">
            Experience
          </h2>
          <div className="space-y-8">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-xl font-light text-gray-900">{exp.position}</h3>
                  <span className="text-sm text-gray-500 font-light whitespace-nowrap ml-4">
                    {exp.startDate} — {exp.endDate || 'Present'}
                  </span>
                </div>
                <p className="text-gray-600 mb-3 font-light">
                  {exp.company} {exp.location && `/ ${exp.location}`}
                </p>
                {exp.description && (
                  <div className="text-gray-700 font-light leading-loose space-y-1">
                    {exp.description.split('\n').map((item, idx) => (
                      item.trim() && <p key={idx}>• {item.trim()}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-6">
            Education
          </h2>
          <div className="space-y-6">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-xl font-light text-gray-900">{edu.degree}</h3>
                  <span className="text-sm text-gray-500 font-light whitespace-nowrap ml-4">
                    {edu.startDate} — {edu.endDate || 'Present'}
                  </span>
                </div>
                <p className="text-gray-600 font-light">
                  {edu.school} {edu.location && `/ ${edu.location}`}
                </p>
                {edu.field && <p className="text-gray-600 font-light">{edu.field}</p>}
                {edu.gpa && <p className="text-gray-600 font-light">GPA: {edu.gpa}</p>}
                {edu.description && <p className="text-gray-700 mt-2 font-light">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills & Languages Grid */}
      <div className="grid grid-cols-2 gap-12 mb-12">
        {/* Skills */}
        {skills.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
              Skills
            </h2>
            <div className="space-y-2">
              {skills.map((skill) => (
                <p key={skill.id} className="text-gray-700 font-light">
                  {skill.name}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
              Languages
            </h2>
            <div className="space-y-2">
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between text-gray-700 font-light">
                  <span>{lang.name}</span>
                  <span className="text-gray-500 capitalize">{lang.level}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Certificates */}
      {certificates.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
            Certifications
          </h2>
          <div className="space-y-3">
            {certificates.map((cert) => (
              <div key={cert.id}>
                <p className="text-gray-900 font-light">{cert.name}</p>
                <p className="text-gray-600 font-light text-sm">
                  {cert.issuer} {cert.date && `/ ${cert.date}`}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
