/**
 * Executive CV Template
 * 
 * Professional executive-level CV with photo support (optional)
 * Compact 1-page design
 * 
 * @module components/cv-templates/ExecutiveTemplate
 */

import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';
import type { CVData } from '@/types/cv-builder';
import Image from 'next/image';

interface ExecutiveTemplateProps {
  data: CVData;
}

export function ExecutiveTemplate({ data }: ExecutiveTemplateProps) {
  const { personalInfo, summary, experience, education, skills, languages, certificates, projects } = data;

  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-gray-900 shadow-lg mx-auto p-8">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4 pb-3 border-b-2 border-gray-800">
        {personalInfo.photo && (
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-gray-800 shrink-0">
            <Image src={personalInfo.photo} alt="Profile" width={80} height={80} className="object-cover" />
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          {personalInfo.title && (
            <p className="text-base text-gray-600 mb-2">{personalInfo.title}</p>
          )}
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600">
            {personalInfo.email && (
              <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{personalInfo.email}</span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{personalInfo.phone}</span>
            )}
            {personalInfo.city && (
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{personalInfo.city}</span>
            )}
            {personalInfo.linkedIn && (
              <a 
                href={personalInfo.linkedIn.startsWith('http') ? personalInfo.linkedIn : `https://linkedin.com/in/${personalInfo.linkedIn}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:underline"
              >
                <Linkedin className="w-3 h-3" />LinkedIn
              </a>
            )}
            {personalInfo.github && (
              <a 
                href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://github.com/${personalInfo.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:underline"
              >
                <Globe className="w-3 h-3" />GitHub
              </a>
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
        {/* Left - Experience & Education */}
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
                    <h3 className="font-bold text-gray-900">{project.title}</h3>
                    {project.link && (
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 text-[9px] hover:underline flex items-center gap-1"
                      >
                        <Globe className="w-2 h-2" />
                        {project.link.includes('github') ? 'GitHub' : 'Link'}
                      </a>
                    )}
                    <p className="text-gray-600 leading-tight text-[10px] mt-0.5">{project.description}</p>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {project.technologies.map((tech, idx) => (
                          <span
                            key={idx}
                            className="text-[8px] text-gray-600"
                          >
                            {tech}
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
              <h2 className="text-xs font-bold uppercase tracking-wide text-gray-800 mb-2 border-b border-gray-300 pb-1">
                Education
              </h2>
              <div className="space-y-1.5">
                {education.map((edu) => (
                  <div key={edu.id} className="text-xs break-inside-avoid">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                      <span className="text-gray-500 text-[9px]">{edu.startDate} - {edu.current ? 'Present' : edu.endDate}</span>
                    </div>
                    <p className="text-gray-700 text-[10px]">{edu.school} • {edu.field}</p>
                  </div>
                ))}
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
              <div className="space-y-0.5">
                {skills.map((skill) => (
                  <div key={skill.id} className="text-[10px] flex justify-between items-center">
                    <span className="text-gray-800">{skill.name}</span>
                    <span className="text-gray-600 text-[9px] font-semibold">
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
              <h2 className="text-sm font-bold uppercase tracking-wide text-gray-800 mb-3 border-b border-gray-300">
                Languages
              </h2>
              <div className="space-y-1">
                {languages.map((lang) => (
                  <div key={lang.id} className="text-sm flex justify-between">
                    <span className="text-gray-800">{lang.name}</span>
                    <span className="text-gray-600 text-[10px]">{lang.level}</span>
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
