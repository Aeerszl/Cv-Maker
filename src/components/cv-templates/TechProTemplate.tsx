/**
 * Tech Pro CV Template
 * 
 * Modern tech-focused CV with clean lines
 * Compact 1-page design, photo optional
 * 
 * @module components/cv-templates/TechProTemplate
 */

import React from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Globe } from 'lucide-react';
import type { CVData } from '@/types/cv-builder';
import Image from 'next/image';

interface TechProTemplateProps {
  data: CVData;
}

export function TechProTemplate({ data }: TechProTemplateProps) {
  const { personalInfo, summary, experience, education, skills, languages, certificates, projects } = data;

  return (
    <div className="w-[210mm] h-[297mm] bg-white shadow-lg mx-auto overflow-hidden">
      {/* Header with accent color */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white">
        <div className="flex items-center gap-6">
          {personalInfo.photo && (
            <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-white shrink-0">
              <Image src={personalInfo.photo} alt="Profile" width={80} height={80} className="object-cover" />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            {personalInfo.title && <p className="text-indigo-100 text-sm">{personalInfo.title}</p>}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-indigo-100">
          {personalInfo.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{personalInfo.email}</span>}
          {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{personalInfo.phone}</span>}
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
                <h2 className="text-sm font-bold text-indigo-600 mb-2 flex items-center gap-2">
                  <div className="w-1 h-4 bg-indigo-600"></div>
                  EXPERIENCE
                </h2>
                <div className="space-y-3">
                  {experience.map((exp) => (
                    <div key={exp.id} className="text-xs break-inside-avoid">
                      <div className="flex justify-between mb-0.5">
                        <h3 className="font-bold text-gray-900">{exp.position}</h3>
                        <span className="text-gray-500 text-[10px]">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                      </div>
                      <p className="text-indigo-600 font-semibold mb-1">{exp.company}</p>
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
                <h2 className="text-sm font-bold text-indigo-600 mb-2 flex items-center gap-2">
                  <div className="w-1 h-4 bg-indigo-600"></div>
                  PROJECTS
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
                          className="text-indigo-600 text-[10px] hover:underline"
                        >
                          {project.link.includes('github') ? '→ GitHub' : '→ Project Link'}
                        </a>
                      )}
                      <p className="text-gray-600 leading-tight mt-0.5">{project.description}</p>
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {project.technologies.map((tech, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] px-1 py-0.5 bg-indigo-100 text-indigo-700 rounded"
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
                <h2 className="text-sm font-bold text-indigo-600 mb-2 flex items-center gap-2">
                  <div className="w-1 h-4 bg-indigo-600"></div>
                  EDUCATION
                </h2>
                <div className="space-y-2">
                  {education.map((edu) => (
                    <div key={edu.id} className="text-xs break-inside-avoid">
                      <div className="flex justify-between">
                        <h3 className="font-bold text-gray-900">{edu.degree} in {edu.field}</h3>
                        <span className="text-gray-500 text-[10px]">{edu.endDate}</span>
                      </div>
                      <p className="text-gray-700">{edu.school}</p>
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
                <h2 className="text-xs font-bold text-gray-800 mb-2 pb-1 border-b-2 border-indigo-600">
                  SKILLS
                </h2>
                <div className="space-y-1.5">
                  {skills.slice(0, 10).map((skill) => (
                    <div key={skill.id}>
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-[10px] text-gray-800">{skill.name}</span>
                        <span className="text-[9px] text-indigo-600 font-semibold">
                          {skill.years ? `${skill.years} yıl` : '1 yıl'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div
                          className="bg-indigo-600 h-1 rounded-full"
                          style={{
                            width: skill.years 
                              ? `${Math.min((skill.years / 10) * 100, 100)}%`
                              : '10%'
                          }}
                        />
                      </div>
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
