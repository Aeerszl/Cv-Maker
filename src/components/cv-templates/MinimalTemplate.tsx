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
  const { personalInfo, summary, experience, education, skills, languages, certificates, projects } = data;

  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-gray-900 shadow-lg mx-auto p-8">
      {/* Simple Header */}
      <header className="mb-8 pb-6 border-b border-gray-200">
        <h1 className="text-4xl font-light text-gray-900 mb-2">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        {personalInfo.title && (
          <p className="text-base text-gray-600 font-light tracking-wide mb-4">
            {personalInfo.title}
          </p>
        )}
        
        {/* Contact Info - Compact 2 Lines for ATS */}
        <div className="text-xs text-gray-600 font-light space-y-1">
          {/* Line 1: Email | Phone | Location */}
          <div className="flex items-center gap-6">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {(personalInfo.city || personalInfo.country) && (
              <span>
                {personalInfo.city}{personalInfo.city && personalInfo.country && '/'}{personalInfo.country}
              </span>
            )}
          </div>
          
          {/* Line 2: LinkedIn | GitHub | Website */}
          <div className="flex items-center gap-6">
            {personalInfo.linkedIn && (
              <a 
                href={personalInfo.linkedIn.startsWith('http') ? personalInfo.linkedIn : `https://linkedin.com/in/${personalInfo.linkedIn}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900 hover:underline"
              >
                LinkedIn
              </a>
            )}
            <a 
              href={personalInfo.github ? (personalInfo.github.startsWith('http') ? personalInfo.github : `https://github.com/${personalInfo.github}`) : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900 hover:underline"
            >
              GitHub
            </a>
            {personalInfo.website && (
              <a 
                href={personalInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900 hover:underline"
              >
                {personalInfo.website.replace('https://', '').replace('http://', '').replace('www.', '')}
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Professional Summary */}
      {summary && (
        <section className="mb-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-300 pb-2">
            About
          </h2>
          <p className="text-gray-700 leading-loose font-light">{summary}</p>
        </section>
      )}

      {/* Work Experience */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 border-b border-gray-300 pb-2">
            Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="break-inside-avoid">
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
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

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-300 pb-2">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.flatMap((skill) => 
              skill.name.split('/').map((name, idx) => ({
                id: `${skill.id}-${idx}`,
                name: name.trim(),
                years: skill.years
              }))
            ).map((skill) => (
              <span
                key={skill.id}
                className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium"
              >
                {skill.name}{skill.years ? `-${skill.years}y` : ''}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-300 pb-2">
            Projects
          </h2>
          <div className="space-y-2">
            {projects.map((project) => (
              <div key={project.id} className="break-inside-avoid">
                <div className="flex items-baseline gap-3">
                  <h3 className="text-sm font-semibold text-gray-900">{project.title}</h3>
                  {(project.link || project.github) && (
                    <div className="flex items-center gap-3 text-[10px]">
                      {project.link && (
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-gray-900 hover:underline"
                        >
                          Website
                        </a>
                      )}
                      {project.github && (
                        <a 
                          href={project.github.startsWith('http') ? project.github : `https://github.com/${project.github}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-gray-900 hover:underline"
                        >
                          GitHub
                        </a>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-gray-700 font-light text-xs leading-tight mt-1">{project.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Certificates | Languages - Side by Side */}
      <div className="grid grid-cols-3 gap-6">
        {/* Education */}
        {education.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-300 pb-2">
              Education
            </h2>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id} className="break-inside-avoid">
                  <h3 className="text-sm font-semibold text-gray-900">{edu.degree}</h3>
                  <p className="text-gray-600 font-light text-xs">{edu.school}</p>
                  <p className="text-gray-500 font-light text-[10px]">
                    {edu.startDate} — {edu.endDate || 'Present'}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certificates */}
        {certificates.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-300 pb-2">
              Certifications
            </h2>
            <div className="space-y-1.5">
              {certificates.map((cert) => (
                <div key={cert.id}>
                  <p className="text-gray-900 font-medium text-xs">{cert.name}</p>
                  <p className="text-gray-600 font-light text-[10px]">
                    {cert.issuer} • {cert.date}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-300 pb-2">
              Languages
            </h2>
            <div className="space-y-1.5">
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between text-gray-700 font-light text-sm">
                  <span className="font-medium">{lang.name}</span>
                  <span className="text-gray-500 capitalize text-xs">{lang.level}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

