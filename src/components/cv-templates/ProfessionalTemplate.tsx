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
      {/* Header with Green Accent */}
      <div className="bg-white border-b-4 border-green-600 px-8 py-5">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        {personalInfo.title && (
          <p className="text-lg text-green-700 font-semibold mb-3">{personalInfo.title}</p>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-700">
          {personalInfo.email && <span>📧 {personalInfo.email}</span>}
          {personalInfo.phone && <span>📱 {personalInfo.phone}</span>}
          {personalInfo.city && <span>📍 {personalInfo.city}</span>}
          {personalInfo.linkedIn && (
            <a 
              href={personalInfo.linkedIn.startsWith('http') ? personalInfo.linkedIn : `https://linkedin.com/in/${personalInfo.linkedIn}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              💼 LinkedIn
            </a>
          )}
          {personalInfo.github && (
            <a 
              href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://github.com/${personalInfo.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              🔗 GitHub
            </a>
          )}
          {personalInfo.website && <span>🌐 {personalInfo.website}</span>}
        </div>
      </div>

      <div className="px-6 py-4">
        {/* Professional Summary */}
        {summary && (
          <section className="mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-8 bg-green-600"></div>
              <h2 className="text-lg font-bold text-gray-900">EXECUTIVE SUMMARY</h2>
            </div>
            <p className="text-gray-700 leading-relaxed ml-5">{summary}</p>
          </section>
        )}

        {/* Work Experience */}
        {experience.length > 0 && (
          <section className="mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-8 bg-green-600"></div>
              <h2 className="text-lg font-bold text-gray-900">PROFESSIONAL EXPERIENCE</h2>
            </div>
            <div className="ml-5 space-y-3">
              {experience.map((exp) => (
                <div key={exp.id} className="break-inside-avoid">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                      <p className="text-green-700 font-semibold text-lg">{exp.company}</p>
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

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section className="mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-8 bg-green-600"></div>
              <h2 className="text-lg font-bold text-gray-900">PROJECTS</h2>
            </div>
            <div className="ml-5 space-y-3">
              {projects.map((project) => (
                <div key={project.id} className="break-inside-avoid">
                  <h3 className="text-lg font-bold text-gray-900">{project.title}</h3>
                  {project.link && (
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-green-600 text-sm hover:underline"
                    >
                      {project.link.includes('github') ? '→ GitHub' : '→ Project Link'}
                    </a>
                  )}
                  <p className="text-gray-700 mt-1">{project.description}</p>
                  {(project.startDate || project.endDate) && (
                    <p className="text-sm text-gray-600 mt-1">
                      {project.startDate} {project.endDate && `- ${project.endDate}`}
                    </p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {project.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-8 bg-green-600"></div>
              <h2 className="text-lg font-bold text-gray-900">EDUCATION</h2>
            </div>
            <div className="ml-5 space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="break-inside-avoid">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                      <p className="text-green-700 font-semibold">{edu.school}</p>
                      {edu.field && <p className="text-gray-600">{edu.field}</p>}
                      {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                    </div>
                    <p className="text-gray-700 font-medium">
                      {edu.startDate} - {edu.endDate || 'Present'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-8">
          {/* Skills */}
          {skills.length > 0 && (
            <section className="mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-8 bg-green-600"></div>
                <h2 className="text-lg font-bold text-gray-900">SKILLS</h2>
              </div>
              <div className="ml-5 grid grid-cols-1 gap-2">
                {skills.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="text-gray-800 font-medium">{skill.name}</span>
                    </div>
                    {skill.years && (
                      <span className="text-gray-600 text-sm">{skill.years} yıl</span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <section className="mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-8 bg-green-600"></div>
                <h2 className="text-lg font-bold text-gray-900">LANGUAGES</h2>
              </div>
              <div className="ml-5 space-y-2">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-gray-800 font-medium">{lang.name}</span>
                    <span className="text-gray-600">— {lang.level}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Certificates */}
        {certificates.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-8 bg-green-600"></div>
              <h2 className="text-lg font-bold text-gray-900">CERTIFICATIONS</h2>
            </div>
            <div className="ml-5 space-y-3">
              {certificates.map((cert) => (
                <div key={cert.id} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-1.5"></div>
                  <div>
                    <p className="font-bold text-gray-900">{cert.name}</p>
                    <p className="text-gray-700">{cert.issuer}</p>
                    {cert.date && <p className="text-gray-600 text-sm">{cert.date}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
