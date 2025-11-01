/**
 * Minimal CV Template
 * 
 * ATS-friendly minimalist design with maximum whitespace
 * 
 * @module components/cv-templates/MinimalTemplate
 */

import React from 'react';
import type { CVData } from '@/types/cv-builder';

interface MinimalTemplateProps {
  data: CVData;
}

export function MinimalTemplate({ data }: MinimalTemplateProps) {
  const { personalInfo, summary, experience, education, skills, languages, certificates, projects } = data;

  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-gray-900 shadow-lg mx-auto p-8">
      {/* Simple Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-light text-gray-900 mb-2">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        {personalInfo.title && (
          <p className="text-base text-gray-600 font-light tracking-wide mb-4">
            {personalInfo.title}
          </p>
        )}
        <div className="flex flex-wrap gap-3 text-xs text-gray-600 font-light">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.city && <span>{personalInfo.city}</span>}
        </div>
        {(personalInfo.linkedIn || personalInfo.github || personalInfo.website) && (
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 font-light mt-1">
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
            {personalInfo.github && (
              <a 
                href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://github.com/${personalInfo.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                GitHub
              </a>
            )}
            {personalInfo.website && <span>{personalInfo.website}</span>}
          </div>
        )}
      </header>

      {/* Professional Summary */}
      {summary && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
            About
          </h2>
          <p className="text-gray-700 leading-loose font-light">{summary}</p>
        </section>
      )}

      {/* Work Experience */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-6">
            Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="break-inside-avoid">
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-xl font-light text-gray-900">{exp.position}</h3>
                  <span className="text-sm text-gray-500 font-light whitespace-nowrap ml-4">
                    {exp.startDate} — {exp.endDate || 'Present'}
                  </span>
                </div>
                <p className="text-gray-600 mb-3 font-light">
                  {exp.company} {exp.location && `/ ${exp.location}`}
                </p>
                {exp.description && (
                  <div className="text-gray-700 font-light leading-loose space-y-1">
                    {exp.description.split('\n').map((item, idx) => (
                      item.trim() && <p key={idx}>• {item.trim()}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-6">
            Projects
          </h2>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="break-inside-avoid">
                <h3 className="text-xl font-light text-gray-900 mb-1">{project.title}</h3>
                {project.link && (
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 text-sm hover:underline break-all font-light"
                  >
                    {project.link}
                  </a>
                )}
                <p className="text-gray-700 font-light mt-2">{project.description}</p>
                {(project.startDate || project.endDate) && (
                  <p className="text-sm text-gray-500 font-light mt-1">
                    {project.startDate} {project.endDate && `— ${project.endDate}`}
                  </p>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-xs text-gray-600 font-light"
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
        <section className="mb-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-6">
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="break-inside-avoid">
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-xl font-light text-gray-900">{edu.degree}</h3>
                  <span className="text-sm text-gray-500 font-light whitespace-nowrap ml-4">
                    {edu.startDate} — {edu.endDate || 'Present'}
                  </span>
                </div>
                <p className="text-gray-600 font-light">
                  {edu.school} {edu.location && `/ ${edu.location}`}
                </p>
                {edu.field && <p className="text-gray-600 font-light">{edu.field}</p>}
                {edu.gpa && <p className="text-gray-600 font-light">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills & Languages Grid */}
      <div className="grid grid-cols-2 gap-12 mb-6">
        {/* Skills */}
        {skills.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
              Skills
            </h2>
            <div className="space-y-2">
              {skills.map((skill) => (
                <div key={skill.id} className="flex justify-between text-gray-700 font-light">
                  <span>{skill.name}</span>
                  {skill.years && (
                    <span className="text-gray-500">{skill.years} yıl</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
              Languages
            </h2>
            <div className="space-y-2">
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between text-gray-700 font-light">
                  <span>{lang.name}</span>
                  <span className="text-gray-500 capitalize">{lang.level}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Certificates */}
      {certificates.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
            Certifications
          </h2>
          <div className="space-y-3">
            {certificates.map((cert) => (
              <div key={cert.id}>
                <p className="text-gray-900 font-light">{cert.name}</p>
                <p className="text-gray-600 font-light text-sm">
                  {cert.issuer} {cert.date && `/ ${cert.date}`}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

