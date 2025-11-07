/**
 * Elegant CV Template
 * 
 * Simple elegant design with serif fonts
 * Compact 1-page, photo optional
 * 
 * @module components/cv-templates/ElegantTemplate
 */

import React from 'react';
import type { CVData } from '@/types/cv-builder';
import Image from 'next/image';

interface ElegantTemplateProps {
  data: CVData;
}

export function ElegantTemplate({ data }: ElegantTemplateProps) {
  const { personalInfo, summary, experience, education, skills, languages, certificates, projects } = data;

  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-gray-900 shadow-lg mx-auto p-10 overflow-hidden">
      {/* Header */}
      <div className="text-center mb-6 pb-4 border-b border-gray-300">
        {personalInfo.photo && (
          <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 border-2 border-gray-300">
            <Image src={personalInfo.photo} alt="Profile" width={80} height={80} className="object-cover" />
          </div>
        )}
        <h1 className="text-3xl font-bold text-gray-900 mb-1 tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        {personalInfo.title && (
          <p className="text-sm text-gray-600 italic mb-2">{personalInfo.title}</p>
        )}
        
        {/* Contact Info - 2 Lines */}
        <div className="text-xs text-gray-600 space-y-1">
          {/* Line 1: Email | Phone | Location */}
          <div className="flex justify-center items-center gap-4">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {(personalInfo.city || personalInfo.country) && (
              <span>
                {personalInfo.city}{personalInfo.city && personalInfo.country && '/'}{personalInfo.country}
              </span>
            )}
          </div>
          
          {/* Line 2: LinkedIn | GitHub | Website */}
          <div className="flex justify-center items-center gap-4">
            {personalInfo.linkedIn && (
              <a
                href={personalInfo.linkedIn.startsWith('http') ? personalInfo.linkedIn : `https://linkedin.com/in/${personalInfo.linkedIn}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                LinkedIn
              </a>
            )}
            <a
              href={personalInfo.github ? (personalInfo.github.startsWith('http') ? personalInfo.github : `https://github.com/${personalInfo.github}`) : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              GitHub
            </a>
            {personalInfo.website && (
              <a
                href={personalInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {personalInfo.website.replace('https://', '').replace('http://', '').replace('www.', '')}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-5 text-center">
          <p className="text-xs text-gray-700 leading-relaxed italic">{summary}</p>
        </div>
      )}

      {/* Experience - 2 Columns */}
      {experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase text-gray-800 mb-3 pb-1 border-b border-gray-300">
            Experience
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {experience.map((exp) => (
              <div key={exp.id} className="text-xs break-inside-avoid">
                <h3 className="font-bold text-gray-900">{exp.position}</h3>
                <p className="text-gray-600 italic mb-1">{exp.company} • {exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                {exp.description && (
                  <p className="text-gray-700 leading-tight">{exp.description.split('\n').slice(0, 2).join(' ')}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills - 6-8 items per row */}
      {skills.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase text-gray-800 mb-3 pb-1 border-b border-gray-300">
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
                className="px-2.5 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium"
              >
                {skill.name}{skill.years ? `-${skill.years}y` : ''}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase text-gray-800 mb-3 pb-1 border-b border-gray-300">
            Projects
          </h2>
          <div className="space-y-2">
            {projects.map((project) => (
              <div key={project.id} className="text-xs break-inside-avoid">
                <div className="flex items-baseline gap-2">
                  <h3 className="font-bold text-gray-900">{project.title}</h3>
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
                  <p className="text-gray-700 text-[10px] leading-tight mt-1">{project.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education & Certifications - Same Row */}
      <div className="mb-5">
        <div className="grid grid-cols-2 gap-6">
          {/* Education */}
          {education.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase text-gray-800 mb-3 pb-1 border-b border-gray-300">
                Education
              </h2>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id} className="text-xs break-inside-avoid">
                    <h3 className="font-bold text-gray-900 leading-tight">{edu.degree}</h3>
                    <p className="text-gray-600 italic">{edu.school}</p>
                    <p className="text-gray-500 text-[10px]">{edu.startDate} - {edu.endDate || 'Present'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certificates.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase text-gray-800 mb-3 pb-1 border-b border-gray-300">
                Certifications
              </h2>
              <div className="space-y-1.5">
                {certificates.map((cert) => (
                  <div key={cert.id} className="text-xs break-inside-avoid">
                    <p className="font-bold text-gray-900 leading-tight">{cert.name}</p>
                    <p className="text-gray-600 italic text-[10px]">{cert.issuer} • {cert.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Languages - 5 per row */}
      {languages.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase text-gray-800 mb-3 pb-1 border-b border-gray-300">
            Languages
          </h2>
          <div className="grid grid-cols-5 gap-3">
            {languages.map((lang) => (
              <div key={lang.id} className="text-xs text-center">
                <p className="font-bold text-gray-900">{lang.name}</p>
                <p className="text-gray-600 italic text-[10px] capitalize">{lang.level}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
