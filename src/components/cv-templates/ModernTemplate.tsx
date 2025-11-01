/**
 * Modern CV Template
 * 
 * ATS-friendly modern design with two-column layout
 * 
 * @module components/cv-templates/ModernTemplate
 */

import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, Calendar, Award } from 'lucide-react';
import type { CVData } from '@/types/cv-builder';

interface ModernTemplateProps {
  data: CVData;
}

export function ModernTemplate({ data }: ModernTemplateProps) {
  const { personalInfo, summary, experience, education, skills, languages, certificates, projects } = data;

  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-gray-900 shadow-lg mx-auto p-0">
      {/* Header Section */}
      <div className="bg-linear-to-r from-blue-600 to-blue-700 text-white px-8 py-6">
        <h1 className="text-3xl font-bold mb-1">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        {personalInfo.title && (
          <p className="text-lg text-blue-100">{personalInfo.title}</p>
        )}
      </div>

      {/* Contact Info Bar */}
      <div className="bg-blue-50 px-8 py-3 border-b-2 border-blue-200">
        <div className="flex flex-wrap gap-3 text-xs text-gray-700">
          {personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4 text-blue-600" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4 text-blue-600" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.city && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>{personalInfo.city}</span>
            </div>
          )}
          {personalInfo.linkedIn && (
            <a 
              href={personalInfo.linkedIn.startsWith('http') ? personalInfo.linkedIn : `https://linkedin.com/in/${personalInfo.linkedIn}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:underline"
            >
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>
          )}
          {personalInfo.github && (
            <a 
              href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://github.com/${personalInfo.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:underline"
            >
              <Globe className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          )}
          {personalInfo.website && !personalInfo.github && (
            <div className="flex items-center gap-1">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>{personalInfo.website}</span>
            </div>
          )}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="flex">
        {/* Left Column - Main Content */}
        <div className="flex-1 px-8 py-8">
          {/* Professional Summary */}
          {summary && (
            <section className="mb-4">
              <h2 className="text-2xl font-bold text-blue-700 mb-3 pb-2 border-b-2 border-blue-200">
                ÖZET
              </h2>
              <p className="text-gray-700 leading-relaxed">{summary}</p>
            </section>
          )}

          {/* Work Experience */}
          {experience.length > 0 && (
            <section className="mb-4">
              <h2 className="text-2xl font-bold text-blue-700 mb-3 pb-2 border-b-2 border-blue-200">
                DENEYIM
              </h2>
              <div className="space-y-3">
                {experience.map((exp) => (
                  <div key={exp.id} className="break-inside-avoid">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                        <p className="text-blue-600 font-semibold">{exp.company}</p>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{exp.startDate} - {exp.endDate || 'Devam Ediyor'}</span>
                        </div>
                        {exp.location && <p className="text-gray-500">{exp.location}</p>}
                      </div>
                    </div>
                    {exp.description && (
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {exp.description.split('\n').map((item, idx) => (
                          item.trim() && <li key={idx}>{item.trim()}</li>
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
              <h2 className="text-2xl font-bold text-blue-700 mb-3 pb-2 border-b-2 border-blue-200">
                PROJELER
              </h2>
              <div className="space-y-3">
                {projects.map((project) => (
                  <div key={project.id} className="break-inside-avoid">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{project.title}</h3>
                        {project.link && (
                          <a 
                            href={project.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 text-sm hover:underline flex items-center gap-1"
                          >
                            <Globe className="w-3 h-3" />
                            {project.link.includes('github') ? 'GitHub' : 'Project Link'}
                          </a>
                        )}
                        <p className="text-gray-700 mt-1">{project.description}</p>
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {project.technologies.map((tech, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {(project.startDate || project.endDate) && (
                        <div className="text-sm text-gray-600 ml-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{project.startDate} {project.endDate && `- ${project.endDate}`}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section className="mb-4">
              <h2 className="text-2xl font-bold text-blue-700 mb-3 pb-2 border-b-2 border-blue-200">
                EĞİTİM
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="break-inside-avoid">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                        <p className="text-blue-600 font-semibold">{edu.school}</p>
                        {edu.field && <p className="text-gray-600">{edu.field}</p>}
                      </div>
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{edu.startDate} - {edu.endDate || 'Devam Ediyor'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="w-80 bg-gray-50 px-8 py-8 border-l-4 border-blue-600">
          {/* Skills */}
          {skills.length > 0 && (
            <section className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-600"></div>
                YETENEKLER
              </h2>
              <div className="space-y-3">
                {skills.map((skill) => (
                  <div key={skill.id}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-gray-800">{skill.name}</span>
                      <span className="text-sm text-gray-600 font-semibold">
                        {skill.years ? `${skill.years} yıl` : '1 yıl'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <section className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-600"></div>
                DİLLER
              </h2>
              <div className="space-y-3">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between items-center">
                    <span className="font-medium text-gray-800">{lang.name}</span>
                    <span className="text-sm text-gray-600 bg-blue-100 px-2 py-1 rounded">
                      {lang.level}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certificates */}
          {certificates.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-600"></div>
                SERTİFİKALAR
              </h2>
              <div className="space-y-3">
                {certificates.map((cert) => (
                  <div key={cert.id} className="flex items-start gap-2">
                    <Award className="w-4 h-4 text-blue-600 mt-1 shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800">{cert.name}</p>
                      <p className="text-sm text-gray-600">{cert.issuer}</p>
                      {cert.date && (
                        <p className="text-xs text-gray-500">{cert.date}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
