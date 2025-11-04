/**
 * Modern CV Template
 * 
 * ATS-optimized modern design with two-column layout
 * %90 ATS compatibility
 * 
 * @module components/cv-templates/ModernTemplate
 */

import React from 'react';
import type { CVData } from '@/types/cv-builder';

interface ModernTemplateProps {
  data: CVData;
}

export function ModernTemplate({ data }: ModernTemplateProps) {
  const { personalInfo, summary, experience, education, skills, languages, certificates, projects, cvLanguage } = data;
  
  // Language-based labels
  const labels = cvLanguage === 'en' ? {
    summary: 'SUMMARY',
    experience: 'WORK EXPERIENCE',
    projects: 'PROJECTS',
    education: 'EDUCATION',
    skills: 'SKILLS',
    languages: 'LANGUAGES',
    certificates: 'CERTIFICATES',
    present: 'Present',
    years: 'yrs'
  } : {
    summary: 'ÖZET',
    experience: 'DENEYIM',
    projects: 'PROJELER',
    education: 'EĞİTİM',
    skills: 'YETENEKLER',
    languages: 'DİLLER',
    certificates: 'SERTİFİKALAR',
    present: 'Devam Ediyor',
    years: 'yıl'
  };

  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-gray-900 shadow-lg mx-auto p-0">
      {/* Header Section */}
      <div className="bg-gray-800 text-white px-8 py-6">
        <h1 className="text-3xl font-bold mb-1">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        {personalInfo.title && (
          <p className="text-lg text-gray-300">{personalInfo.title}</p>
        )}
      </div>

      {/* Contact Info Bar */}
      <div className="bg-gray-100 px-8 py-3 border-b-2 border-gray-300">
        <div className="flex flex-wrap gap-6 text-xs text-gray-700">
          {personalInfo.email && <div>{personalInfo.email}</div>}
          {personalInfo.phone && <div>{personalInfo.phone}</div>}
          {(personalInfo.city || personalInfo.country) && (
            <div>
              {personalInfo.city}{personalInfo.city && personalInfo.country && '/'}{personalInfo.country}
            </div>
          )}
          {personalInfo.linkedIn && (
            <a 
              href={personalInfo.linkedIn.startsWith('http') ? personalInfo.linkedIn : `https://linkedin.com/in/${personalInfo.linkedIn}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              LinkedIn
            </a>
          )}
          <a 
            href={personalInfo.github ? (personalInfo.github.startsWith('http') ? personalInfo.github : `https://github.com/${personalInfo.github}`) : '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            GitHub
          </a>
          {personalInfo.website && (
            <a 
              href={personalInfo.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {personalInfo.website.replace('https://', '').replace('http://', '').replace('www.', '')}
            </a>
          )}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="flex gap-6">
        {/* Left Column - Main Content (Summary + Experience + Projects) */}
        <div className="flex-1 px-8 py-6">
          {/* Professional Summary */}
          {summary && (
            <section className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3 pb-2 border-b-2 border-gray-300">
                {labels.summary}
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed">{summary}</p>
            </section>
          )}

          {/* Work Experience */}
          {experience.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3 pb-2 border-b-2 border-gray-300">
                {labels.experience}
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="break-inside-avoid">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="text-base font-bold text-gray-900">{exp.position}</h3>
                        <p className="text-gray-600 font-semibold text-sm">{exp.company}</p>
                      </div>
                      <div className="text-right text-xs text-gray-600">
                        <div>{exp.startDate} - {exp.endDate || labels.present}</div>
                        {exp.location && <p className="text-gray-500 text-[10px]">{exp.location}</p>}
                      </div>
                    </div>
                    {exp.description && (
                      <ul className="list-disc list-inside text-gray-700 text-xs space-y-0.5 leading-tight">
                        {exp.description.split('\n').slice(0, 3).map((item, idx) => (
                          item.trim() && <li key={idx}>{item.trim()}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3 pb-2 border-b-2 border-gray-300">
                {labels.projects}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {projects.map((project) => (
                  <div key={project.id} className="break-inside-avoid">
                    <h3 className="text-sm font-bold text-gray-900">{project.title}</h3>
                    <div className="flex gap-3 text-xs">
                      <a 
                        href={project.link || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Website
                      </a>
                      <a 
                        href={project.github || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        GitHub
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column - Sidebar (Skills + Languages + Education & Certificates) */}
        <div className="w-[280px] bg-gray-50 px-6 py-6 border-l-4 border-gray-800">
          {/* Skills */}
          {skills.length > 0 && (
            <section className="mb-5">
              <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-1 h-5 bg-gray-800"></div>
                {labels.skills}
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.flatMap((skill) =>
                  skill.name.split('/').map((name, index) => (
                    <span
                      key={`${skill.id}-${index}`}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-800 border border-gray-300 rounded"
                    >
                      {name.trim()}{skill.years ? `-${skill.years}${labels.years}` : ''}
                    </span>
                  ))
                )}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <section className="mb-5">
              <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-1 h-5 bg-gray-800"></div>
                {labels.languages}
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {languages.map((lang) => (
                  <div key={lang.id} className="text-center">
                    <div className="font-medium text-gray-800 text-xs">{lang.name}</div>
                    <div className="text-[10px] text-gray-600 capitalize">{lang.level}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education & Certificates */}
          {(education.length > 0 || certificates.length > 0) && (
            <section>
              <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-1 h-5 bg-gray-800"></div>
                {labels.education} & {labels.certificates}
              </h2>
              
              {/* Education */}
              {education.length > 0 && (
                <div className="space-y-3 mb-4">
                  {education.map((edu) => (
                    <div key={edu.id} className="break-inside-avoid">
                      <h3 className="text-sm font-bold text-gray-900">{edu.degree}</h3>
                      <p className="text-gray-600 font-semibold text-xs">{edu.school}</p>
                      {edu.field && <p className="text-gray-600 text-[10px]">{edu.field}</p>}
                      <p className="text-[10px] text-gray-500">
                        {edu.startDate} - {edu.endDate || labels.present}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Certificates */}
              {certificates.length > 0 && (
                <div className="space-y-2 border-t border-gray-300 pt-3">
                  {certificates.map((cert) => (
                    <div key={cert.id}>
                      <p className="font-medium text-gray-800 text-xs leading-tight">{cert.name}</p>
                      <p className="text-[10px] text-gray-600">{cert.issuer}</p>
                      {cert.date && <p className="text-[9px] text-gray-500">{cert.date}</p>}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
