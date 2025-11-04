/**
 * Tech Pro CV Template
 * 
 * ATS-optimized tech-focused CV with clean lines
 * Compact 1-page design, %90 ATS compatibility
 * 
 * @module components/cv-templates/TechProTemplate
 */

import React from 'react';
import type { CVData } from '@/types/cv-builder';

interface TechProTemplateProps {
  data: CVData;
}

export function TechProTemplate({ data }: TechProTemplateProps) {
  const { personalInfo, summary, experience, education, skills, languages, certificates, projects } = data;

  return (
    <div className="w-[210mm] min-h-[297mm] bg-white shadow-lg mx-auto overflow-hidden">
      {/* Header with accent color */}
      <div className="bg-gray-800 px-8 py-6 text-white">
        <div>
          <h1 className="text-2xl font-bold mb-1">
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          {personalInfo.title && <p className="text-gray-300 text-sm">{personalInfo.title}</p>}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-300">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {(personalInfo.city || personalInfo.country) && (
            <span>
              {personalInfo.city}{personalInfo.city && personalInfo.country && '/'}{personalInfo.country}
            </span>
          )}
          {personalInfo.linkedIn && (
            <a
              href={personalInfo.linkedIn.startsWith('http') ? personalInfo.linkedIn : `https://linkedin.com/in/${personalInfo.linkedIn}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              LinkedIn
            </a>
          )}
          <a
            href={personalInfo.github ? (personalInfo.github.startsWith('http') ? personalInfo.github : `https://github.com/${personalInfo.github}`) : '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            GitHub
          </a>
          {personalInfo.website && (
            <a
              href={personalInfo.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              {personalInfo.website.replace('https://', '').replace('http://', '').replace('www.', '')}
            </a>
          )}
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Summary */}
        {summary && (
          <div className="mb-5">
            <p className="text-xs text-gray-700 leading-relaxed">{summary}</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2 space-y-4">
            {/* Experience */}
            {experience.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <div className="w-1 h-4 bg-gray-800"></div>
                  EXPERIENCE
                </h2>
                <div className="space-y-3">
                  {experience.map((exp) => (
                    <div key={exp.id} className="text-xs break-inside-avoid">
                      <div className="flex justify-between mb-0.5">
                        <h3 className="font-bold text-gray-900">{exp.position}</h3>
                        <span className="text-gray-500 text-[10px]">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                      </div>
                      <p className="text-gray-600 font-semibold mb-1">{exp.company}</p>
                      {exp.description && (
                        <ul className="list-disc list-inside text-gray-600 space-y-0.5 leading-tight">
                          {exp.description.split('\n').slice(0, 2).map((item, idx) => (
                            item.trim() && <li key={idx}>{item.trim()}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {projects && projects.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <div className="w-1 h-4 bg-gray-800"></div>
                  PROJECTS
                </h2>
                <div className="space-y-2">
                  {projects.map((project) => (
                    <div key={project.id} className="text-xs break-inside-avoid">
                      <h3 className="font-bold text-gray-900">{project.title}</h3>
                      <div className="flex gap-3 text-[10px]">
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
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="bg-gray-50 -mr-8 -mb-6 p-4 space-y-4">
            {/* Skills */}
            {skills.length > 0 && (
              <div>
                <h2 className="text-xs font-bold text-gray-800 mb-2 pb-1 border-b-2 border-gray-800">
                  SKILLS
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {skills.flatMap((skill) =>
                    skill.name.split('/').map((name, index) => (
                      <span
                        key={`${skill.id}-${index}`}
                        className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-800 border border-gray-300 rounded"
                      >
                        {name.trim()}{skill.years ? `-${skill.years}y` : ''}
                      </span>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <div>
                <h2 className="text-xs font-bold text-gray-800 mb-2 pb-1 border-b-2 border-gray-800">
                  LANGUAGES
                </h2>
                <div className="space-y-1">
                  {languages.map((lang) => (
                    <div key={lang.id} className="flex justify-between items-center text-[10px]">
                      <span className="text-gray-800">{lang.name}</span>
                      <span className="text-gray-600 capitalize">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education & Certifications */}
            {(education.length > 0 || certificates.length > 0) && (
              <div>
                <h2 className="text-xs font-bold text-gray-800 mb-2 pb-1 border-b-2 border-gray-800">
                  EDUCATION & CERTS
                </h2>
                
                {/* Education */}
                {education.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {education.map((edu) => (
                      <div key={edu.id} className="text-[9px] break-inside-avoid">
                        <h3 className="font-bold text-gray-900 leading-tight">{edu.degree}</h3>
                        <p className="text-gray-700">{edu.school}</p>
                        <p className="text-gray-500">{edu.endDate}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Certifications */}
                {certificates.length > 0 && (
                  <div className="space-y-1.5 border-t border-gray-300 pt-2">
                    {certificates.map((cert) => (
                      <div key={cert.id} className="text-[9px] break-inside-avoid">
                        <p className="font-bold text-gray-900 leading-tight">{cert.name}</p>
                        <p className="text-gray-600">{cert.issuer}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
