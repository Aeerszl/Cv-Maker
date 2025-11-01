/**
 * Bold Impact CV Template
 * 
 * Bold and impactful design with strong typography
 * Compact 1-page, photo optional
 * 
 * @module components/cv-templates/BoldTemplate
 */

import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Github } from 'lucide-react';
import type { CVData } from '@/types/cv-builder';
import Image from 'next/image';

interface BoldTemplateProps {
  data: CVData;
}

export function BoldTemplate({ data }: BoldTemplateProps) {
  const { personalInfo, summary, experience, education, skills, languages, certificates, projects } = data;

  return (
    <div className="w-[210mm] h-[297mm] bg-white shadow-lg mx-auto overflow-hidden">
      {/* Bold Header */}
      <div className="bg-gray-900 text-white px-8 py-5">
        <div className="flex items-center gap-4">
          {personalInfo.photo && (
            <div className="w-16 h-16 rounded-sm overflow-hidden border-2 border-yellow-400 shrink-0">
              <Image src={personalInfo.photo} alt="Profile" width={64} height={64} className="object-cover" />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-black uppercase tracking-tight mb-1">
              {personalInfo.firstName} <span className="text-yellow-400">{personalInfo.lastName}</span>
            </h1>
            {personalInfo.title && <p className="text-sm text-gray-300 font-semibold">{personalInfo.title}</p>}
          </div>
        </div>
      </div>

      {/* Contact Bar */}
      <div className="bg-yellow-400 px-8 py-2">
        <div className="flex flex-wrap gap-4 text-xs text-gray-900 font-semibold">
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

      <div className="px-8 py-6">
        {/* Summary */}
        {summary && (
          <div className="mb-5 bg-gray-50 p-3 border-l-4 border-yellow-400">
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
                    <div key={exp.id} className="text-xs border-l-2 border-yellow-400 pl-3 break-inside-avoid">
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
                    <div key={project.id} className="text-xs border-l-2 border-yellow-400 pl-3 break-inside-avoid">
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
                              className="text-[9px] px-1 py-0.5 bg-yellow-100 text-gray-900 font-bold"
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
                <h2 className="text-sm font-black uppercase bg-gray-900 text-white px-2 py-1 mb-3">
                  Education
                </h2>
                <div className="space-y-2">
                  {education.map((edu) => (
                    <div key={edu.id} className="text-xs border-l-2 border-yellow-400 pl-3 break-inside-avoid">
                      <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                      <p className="text-gray-700">{edu.school} • {edu.field}</p>
                      <p className="text-gray-500 text-[10px]">{edu.endDate}</p>
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
                <div className="space-y-1">
                  {skills.slice(0, 10).map((skill) => (
                    <div key={skill.id} className="flex justify-between items-center text-[10px] bg-gray-50 px-2 py-1">
                      <span className="font-semibold text-gray-800">{skill.name}</span>
                      <span className="text-yellow-600 font-bold">
                        {skill.years ? `${skill.years} YIL` : '1 YIL'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
