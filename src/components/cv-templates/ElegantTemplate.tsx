/**
 * Elegant CV Template
 * 
 * Simple elegant design with serif fonts
 * Compact 1-page, photo optional
 * 
 * @module components/cv-templates/ElegantTemplate
 */

import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Github } from 'lucide-react';
import type { CVData } from '@/types/cv-builder';
import Image from 'next/image';

interface ElegantTemplateProps {
  data: CVData;
}

export function ElegantTemplate({ data }: ElegantTemplateProps) {
  const { personalInfo, summary, experience, education, skills, languages, certificates, projects } = data;

  return (
    <div className="w-[210mm] h-[297mm] bg-white text-gray-900 shadow-lg mx-auto p-10 overflow-hidden font-serif">
      {/* Header */}
      <div className="text-center mb-6 pb-4 border-b border-gray-300">
        {personalInfo.photo && (
          <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 border-2 border-gray-300">
            <Image src={personalInfo.photo} alt="Profile" width={80} height={80} className="object-cover" />
          </div>
        )}
        <h1 className="text-3xl font-bold text-gray-900 mb-1 tracking-wide">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        {personalInfo.title && (
          <p className="text-sm text-gray-600 italic mb-2">{personalInfo.title}</p>
        )}
        <div className="flex justify-center gap-3 text-xs text-gray-600">
          {personalInfo.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{personalInfo.email}</span>}
          {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{personalInfo.phone}</span>}
          {personalInfo.city && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{personalInfo.city}</span>}
          {personalInfo.linkedIn && (
            <a
              href={personalInfo.linkedIn.startsWith('http') ? personalInfo.linkedIn : `https://linkedin.com/in/${personalInfo.linkedIn}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:underline"
            >
              <Linkedin className="w-3 h-3" />LinkedIn
            </a>
          )}
          {personalInfo.github && (
            <a
              href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://github.com/${personalInfo.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:underline"
            >
              <Github className="w-3 h-3" />GitHub
            </a>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-5 text-center">
          <p className="text-xs text-gray-700 leading-relaxed italic">{summary}</p>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="col-span-2 space-y-4">
          {/* Experience */}
          {experience.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase text-gray-800 mb-2 pb-1 border-b border-gray-300">
                Experience
              </h2>
              <div className="space-y-3">
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

          {/* Projects */}
          {projects && projects.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase text-gray-800 mb-2 pb-1 border-b border-gray-300">
                Projects
              </h2>
              <div className="space-y-3">
                {projects.map((project) => (
                  <div key={project.id} className="text-xs break-inside-avoid">
                    <h3 className="font-bold text-gray-900">{project.title}</h3>
                    {project.link && (
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 text-[10px] hover:underline"
                      >
                        {project.link.includes('github') ? '→ GitHub' : '→ Project Link'}
                      </a>
                    )}
                    <p className="text-gray-700 leading-tight mt-0.5">{project.description}</p>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.technologies.map((tech, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] text-gray-600"
                          >
                            • {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase text-gray-800 mb-2 pb-1 border-b border-gray-300">
                Education
              </h2>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id} className="text-xs break-inside-avoid">
                    <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-600 italic">{edu.school} • {edu.field}</p>
                    <p className="text-gray-500 text-[10px]">{edu.startDate} - {edu.current ? 'Present' : edu.endDate}</p>
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
              <h2 className="text-xs font-bold uppercase text-gray-800 mb-2 pb-1 border-b border-gray-300">
                Skills
              </h2>
              <div className="space-y-1">
                {skills.slice(0, 8).map((skill) => (
                  <div key={skill.id} className="flex justify-between items-center text-[10px]">
                    <span className="text-gray-700">• {skill.name}</span>
                    <span className="text-gray-600 font-semibold">
                      {skill.years ? `${skill.years} yıl` : '1 yıl'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase text-gray-800 mb-2 pb-1 border-b border-gray-300">
                Languages
              </h2>
              <div className="space-y-1">
                {languages.map((lang) => (
                  <p key={lang.id} className="text-[10px] text-gray-700">{lang.name} - <span className="italic">{lang.level}</span></p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
