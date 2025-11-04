/**
 * Bold Impact CV Template
 * 
 * ATS-optimized bold design with strong typography
 * Compact 1-page, %90 ATS compatibility
 * 
 * @module components/cv-templates/BoldTemplate
 */

import React from 'react';
import type { CVData } from '@/types/cv-builder';

interface BoldTemplateProps {
  data: CVData;
}

export function BoldTemplate({ data }: BoldTemplateProps) {
  const { personalInfo, summary, experience, education, skills, languages, certificates, projects } = data;

  return (
    <div className="w-[210mm] min-h-[297mm] bg-white shadow-lg mx-auto overflow-hidden">
      {/* Bold Header */}
      <div className="bg-gray-900 text-white px-8 py-5">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight mb-1">
            {personalInfo.firstName} <span className="text-gray-400">{personalInfo.lastName}</span>
          </h1>
          {personalInfo.title && <p className="text-sm text-gray-300 font-semibold">{personalInfo.title}</p>}
        </div>
      </div>

      {/* Contact Bar */}
      <div className="bg-gray-200 px-8 py-2">
        <div className="flex flex-wrap gap-4 text-xs text-gray-900 font-semibold">
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

      <div className="px-8 py-6">
        {/* Summary */}
        {summary && (
          <div className="mb-5 bg-gray-50 p-3 border-l-4 border-gray-800">
            <p className="text-xs text-gray-700 leading-relaxed font-medium">{summary}</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2 space-y-4">
            {/* Experience */}
            {experience.length > 0 && (
              <div>
                <h2 className="text-sm font-black uppercase bg-gray-900 text-white px-2 py-1 mb-3">
                  Professional Experience
                </h2>
                <div className="space-y-3">
                  {experience.map((exp) => (
                    <div key={exp.id} className="text-xs border-l-2 border-gray-800 pl-3 break-inside-avoid">
                      <h3 className="font-bold text-gray-900 text-sm">{exp.position}</h3>
                      <p className="text-gray-600 font-semibold mb-1">{exp.company} • {exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                      {exp.description && (
                        <p className="text-gray-700 leading-tight">{exp.description.split('\n')[0]}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {projects && projects.length > 0 && (
              <div>
                <h2 className="text-sm font-black uppercase bg-gray-900 text-white px-2 py-1 mb-3">
                  Projects
                </h2>
                <div className="space-y-3">
                  {projects.map((project) => (
                    <div key={project.id} className="text-xs border-l-2 border-gray-800 pl-3 break-inside-avoid">
                      <h3 className="font-bold text-gray-900">{project.title}</h3>
                      <div className="flex gap-3 text-[10px] mt-0.5">
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
          <div className="space-y-4">
            {/* Skills */}
            {skills.length > 0 && (
              <div>
                <h2 className="text-xs font-black uppercase bg-gray-900 text-white px-2 py-1 mb-2">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-1">
                  {skills.flatMap((skill) =>
                    skill.name.split('/').map((name, index) => (
                      <span
                        key={`${skill.id}-${index}`}
                        className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-800 border border-gray-300 font-semibold"
                      >
                        {name.trim()}{skill.years ? `-${skill.years}Y` : ''}
                      </span>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <div>
                <h2 className="text-xs font-black uppercase bg-gray-900 text-white px-2 py-1 mb-2">
                  Languages
                </h2>
                <div className="space-y-1">
                  {languages.map((lang) => (
                    <div key={lang.id} className="flex justify-between items-center text-[10px] bg-gray-50 px-2 py-1">
                      <span className="font-semibold text-gray-800">{lang.name}</span>
                      <span className="text-gray-600 font-bold uppercase">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education & Certifications */}
            {(education.length > 0 || certificates.length > 0) && (
              <div>
                <h2 className="text-xs font-black uppercase bg-gray-900 text-white px-2 py-1 mb-2">
                  Education & Certs
                </h2>
                
                {/* Education */}
                {education.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {education.map((edu) => (
                      <div key={edu.id} className="text-[9px] bg-gray-50 px-2 py-1 break-inside-avoid">
                        <h3 className="font-bold text-gray-900 leading-tight">{edu.degree}</h3>
                        <p className="text-gray-700">{edu.school}</p>
                        <p className="text-gray-500">{edu.endDate}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Certifications */}
                {certificates.length > 0 && (
                  <div className="space-y-1.5 border-t-2 border-gray-800 pt-2">
                    {certificates.map((cert) => (
                      <div key={cert.id} className="text-[9px] bg-gray-50 px-2 py-1 break-inside-avoid">
                        <p className="font-bold text-gray-900 leading-tight">{cert.name}</p>
                        <p className="text-gray-700">{cert.issuer}</p>
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
