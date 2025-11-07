/**
 * Executive CV Template
 * 
 * Professional executive-level CV
 * Compact 1-page design, ATS-optimized
 * 
 * @module components/cv-templates/ExecutiveTemplate
 */

import React from 'react';
import type { CVData } from '@/types/cv-builder';

interface ExecutiveTemplateProps {
  data: CVData;
}

export function ExecutiveTemplate({ data }: ExecutiveTemplateProps) {
  const { personalInfo, summary, experience, education, skills, languages, certificates, projects } = data;

  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-gray-900 shadow-lg mx-auto p-8">
      {/* Header */}
      <div className="mb-4 pb-3 border-b-2 border-gray-800">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        {personalInfo.title && (
          <p className="text-base text-gray-600 mb-2">{personalInfo.title}</p>
        )}
        
        {/* Contact Info - 2 Columns */}
        <div className="flex gap-8 text-xs text-gray-600">
          {/* Left Column: Email, Phone, Location */}
          <div className="space-y-0.5">
            {personalInfo.email && <div>{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {(personalInfo.city || personalInfo.country) && (
              <div>
                {personalInfo.city}{personalInfo.city && personalInfo.country && '/'}{personalInfo.country}
              </div>
            )}
          </div>
          
          {/* Right Column: LinkedIn, GitHub, Website */}
          <div className="space-y-0.5">
              {personalInfo.linkedIn && (
                <div>
                  <a 
                    href={personalInfo.linkedIn.startsWith('http') ? personalInfo.linkedIn : `https://linkedin.com/in/${personalInfo.linkedIn}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    LinkedIn
                  </a>
                </div>
              )}
              <div>
                <a 
                  href={personalInfo.github ? (personalInfo.github.startsWith('http') ? personalInfo.github : `https://github.com/${personalInfo.github}`) : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  GitHub
                </a>
              </div>
            {personalInfo.website && (
              <div>
                <a 
                  href={personalInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {personalInfo.website.replace('https://', '').replace('http://', '').replace('www.', '')}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-3">
          <p className="text-xs text-gray-700 leading-relaxed italic border-l-4 border-gray-800 pl-3">{summary}</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {/* Left - Experience & Projects */}
        <div className="col-span-2 space-y-2">
          {/* Experience */}
          {experience.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wide text-gray-800 mb-2 border-b border-gray-300 pb-1">
                Professional Experience
              </h2>
              <div className="space-y-2">
                {experience.map((exp) => (
                  <div key={exp.id} className="text-xs break-inside-avoid">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className="font-bold text-gray-900">{exp.position}</h3>
                      <span className="text-gray-500 text-[9px]">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                    </div>
                    <p className="text-gray-700 font-semibold mb-0.5 text-[10px]">{exp.company} • {exp.location}</p>
                    {exp.description && (
                      <p className="text-gray-600 leading-tight text-[10px]">{exp.description.split('\n')[0]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wide text-gray-800 mb-2 border-b border-gray-300 pb-1">
                Projects
              </h2>
              <div className="space-y-2">
                {projects.map((project) => (
                  <div key={project.id} className="text-xs break-inside-avoid">
                    <div className="flex items-baseline gap-2">
                      <h3 className="font-bold text-gray-900">{project.title}</h3>
                      {(project.link || project.github) && (
                        <div className="flex items-center gap-2 text-[9px]">
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
                      <p className="text-gray-600 text-[10px] leading-tight mt-1">{project.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education & Certifications */}
          {(education.length > 0 || certificates.length > 0) && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wide text-gray-800 mb-2 border-b border-gray-300 pb-1">
                Education & Certifications
              </h2>
              <div className="space-y-2">
                {/* Education */}
                {education.length > 0 && (
                  <div className="space-y-1.5">
                    {education.map((edu) => (
                      <div key={edu.id} className="text-xs break-inside-avoid">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                          <span className="text-gray-500 text-[9px]">{edu.startDate} - {edu.current ? 'Present' : edu.endDate}</span>
                        </div>
                        <p className="text-gray-700 text-[10px]">{edu.school} {edu.field && `• ${edu.field}`}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Certifications */}
                {certificates.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-gray-200">
                    {certificates.map((cert) => (
                      <div key={cert.id} className="text-xs break-inside-avoid">
                        <h3 className="font-bold text-gray-900">{cert.name}</h3>
                        <p className="text-gray-700 text-[10px]">{cert.issuer} {cert.date && `• ${cert.date}`}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right - Skills & Languages */}
        <div className="space-y-2">
          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wide text-gray-800 mb-2 border-b border-gray-300 pb-1">
                Skills
              </h2>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                {skills.flatMap((skill) => 
                  skill.name.split('/').map((name, idx) => ({
                    id: `${skill.id}-${idx}`,
                    name: name.trim(),
                    years: skill.years
                  }))
                ).map((skill) => (
                  <div key={skill.id} className="text-[10px]">
                    <span className="text-gray-800">{skill.name}</span>
                    {skill.years && (
                      <span className="text-gray-600 text-[9px] font-semibold"> - {skill.years}y</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wide text-gray-800 mb-2 border-b border-gray-300 pb-1">
                Languages
              </h2>
              <div className="space-y-0.5">
                {languages.map((lang) => (
                  <div key={lang.id} className="text-[10px] flex justify-between">
                    <span className="text-gray-800">{lang.name}</span>
                    <span className="text-gray-600 text-[9px] capitalize">{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
