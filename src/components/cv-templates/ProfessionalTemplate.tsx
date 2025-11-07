/**
 * Professional CV Template
 * 
 * ATS-friendly corporate design with clean sections
 * 
 * @module components/cv-templates/ProfessionalTemplate
 */

import React from 'react';
import type { CVData } from '@/types/cv-builder';

interface ProfessionalTemplateProps {
  data: CVData;
}

export function ProfessionalTemplate({ data }: ProfessionalTemplateProps) {
  const { personalInfo, summary, experience, education, skills, languages, certificates, projects } = data;

  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-gray-900 shadow-lg mx-auto p-0">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-800 px-8 py-5">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        {personalInfo.title && (
          <p className="text-lg text-gray-700 font-semibold mb-3">{personalInfo.title}</p>
        )}
        
        {/* Contact Info - 2 Lines */}
        <div className="text-xs text-gray-700 space-y-1">
          {/* Line 1: Email | Phone | Location */}
          <div className="flex items-center gap-4">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {(personalInfo.city || personalInfo.country) && (
              <span>
                {personalInfo.city}{personalInfo.city && personalInfo.country && '/'}{personalInfo.country}
              </span>
            )}
          </div>
          
          {/* Line 2: LinkedIn | GitHub | Website */}
          <div className="flex items-center gap-4">
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
      </div>

      <div className="px-6 py-4">
        {/* Professional Summary */}
        {summary && (
          <section className="mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-8 bg-gray-800"></div>
              <h2 className="text-lg font-bold text-gray-900">EXECUTIVE SUMMARY</h2>
            </div>
            <p className="text-gray-700 leading-relaxed ml-5">{summary}</p>
          </section>
        )}

        {/* Work Experience */}
        {experience.length > 0 && (
          <section className="mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-8 bg-gray-800"></div>
              <h2 className="text-lg font-bold text-gray-900">PROFESSIONAL EXPERIENCE</h2>
            </div>
            <div className="ml-5 space-y-3">
              {experience.map((exp) => (
                <div key={exp.id} className="break-inside-avoid">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                      <p className="text-gray-700 font-semibold text-lg">{exp.company}</p>
                      {exp.location && <p className="text-gray-600">{exp.location}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-gray-700 font-medium">
                        {exp.startDate} - {exp.endDate || 'Present'}
                      </p>
                    </div>
                  </div>
                  {exp.description && (
                    <ul className="list-disc list-outside text-gray-700 space-y-1 ml-5">
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

        {/* Skills & Projects - Side by Side */}
        <div className="grid grid-cols-2 gap-6 mb-4">
          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-6 bg-gray-800"></div>
                <h2 className="text-base font-bold text-gray-900">SKILLS</h2>
              </div>
              <div className="ml-5 flex flex-wrap gap-2">
                {skills.flatMap((skill) => 
                  skill.name.split('/').map((name, idx) => ({
                    id: `${skill.id}-${idx}`,
                    name: name.trim(),
                    years: skill.years
                  }))
                ).map((skill) => (
                  <span
                    key={skill.id}
                    className="px-2.5 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium"
                  >
                    {skill.name}{skill.years ? `-${skill.years}y` : ''}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-6 bg-gray-800"></div>
                <h2 className="text-base font-bold text-gray-900">PROJECTS</h2>
              </div>
              <div className="ml-5 space-y-2">
                {projects.map((project) => (
                  <div key={project.id} className="break-inside-avoid">
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-sm font-bold text-gray-900">{project.title}</h3>
                      {(project.link || project.github) && (
                        <div className="flex items-center gap-2 text-[10px]">
                          {project.link && (
                            <a 
                              href={project.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Website
                            </a>
                          )}
                          {project.github && (
                            <a 
                              href={project.github.startsWith('http') ? project.github : `https://github.com/${project.github}`}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              GitHub
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    {project.description && (
                      <p className="text-gray-700 text-xs leading-tight mt-1">{project.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Education & Certificates | Languages - Side by Side */}
        <div className="grid grid-cols-3 gap-6">
          {/* Education */}
          {education.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-6 bg-gray-800"></div>
                <h2 className="text-base font-bold text-gray-900">EDUCATION</h2>
              </div>
              <div className="ml-5 space-y-2">
                {education.map((edu) => (
                  <div key={edu.id} className="break-inside-avoid">
                    <h3 className="text-sm font-bold text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-700 font-semibold text-xs">{edu.school}</p>
                    <p className="text-gray-600 text-[10px]">
                      {edu.startDate} - {edu.endDate || 'Present'}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certificates */}
          {certificates.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-6 bg-gray-800"></div>
                <h2 className="text-base font-bold text-gray-900">CERTIFICATIONS</h2>
              </div>
              <div className="ml-5 space-y-1.5">
                {certificates.map((cert) => (
                  <div key={cert.id} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-800 rounded-full mt-1"></div>
                    <div>
                      <p className="font-semibold text-gray-900 text-xs">{cert.name}</p>
                      <p className="text-gray-600 text-[10px]">{cert.issuer} • {cert.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-6 bg-gray-800"></div>
                <h2 className="text-base font-bold text-gray-900">LANGUAGES</h2>
              </div>
              <div className="ml-5 space-y-1.5">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-800 rounded-full"></div>
                    <span className="text-gray-800 font-medium text-sm">{lang.name}</span>
                    <span className="text-gray-600 text-xs capitalize">— {lang.level}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
