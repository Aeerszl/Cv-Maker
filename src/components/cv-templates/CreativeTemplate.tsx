/**
 * Creative CV Template
 * 
 * ATS-friendly creative design with sidebar
 * 
 * @module components/cv-templates/CreativeTemplate
 */

import React from 'react';
import type { CVData } from '@/types/cv-builder';

interface CreativeTemplateProps {
  data: CVData;
}

export function CreativeTemplate({ data }: CreativeTemplateProps) {
  const { personalInfo, summary, experience, education, skills, languages, certificates, projects } = data;

  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-gray-900 shadow-lg mx-auto flex">
      {/* Left Sidebar */}
      <div className="w-1/3 bg-linear-to-br from-purple-600 to-purple-800 text-white p-6">
        {/* Profile */}
        <div className="mb-5">
          <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold">
            {personalInfo.firstName.charAt(0)}{personalInfo.lastName.charAt(0)}
          </div>
          <h1 className="text-xl font-bold text-center mb-2">
            {personalInfo.firstName}<br/>{personalInfo.lastName}
          </h1>
          {personalInfo.title && (
            <p className="text-purple-100 text-center text-sm">{personalInfo.title}</p>
          )}
        </div>

        {/* Contact */}
        <div className="mb-3">
          <h2 className="text-base font-bold mb-3 pb-2 border-b border-white/30">
            İLETİŞİM
          </h2>
          <div className="space-y-1.5 text-xs">
            {personalInfo.email && (
              <div>
                <p className="text-purple-200 text-xs">Email</p>
                <p className="break-words">{personalInfo.email}</p>
              </div>
            )}
            {personalInfo.phone && (
              <div>
                <p className="text-purple-200 text-xs">Telefon</p>
                <p>{personalInfo.phone}</p>
              </div>
            )}
            {personalInfo.city && (
              <div>
                <p className="text-purple-200 text-xs">Konum</p>
                <p>{personalInfo.city}</p>
              </div>
            )}
            {personalInfo.linkedIn && (
              <div>
                <p className="text-purple-200 text-xs">LinkedIn</p>
                <a 
                  href={personalInfo.linkedIn.startsWith('http') ? personalInfo.linkedIn : `https://linkedin.com/in/${personalInfo.linkedIn}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-xs hover:underline break-all block"
                >
                  LinkedIn
                </a>
              </div>
            )}
            {personalInfo.github && (
              <div>
                <p className="text-purple-200 text-xs">GitHub</p>
                <a 
                  href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://github.com/${personalInfo.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-xs hover:underline break-all block"
                >
                  GitHub
                </a>
              </div>
            )}
            {personalInfo.website && (
              <div>
                <p className="text-purple-200 text-xs">Website</p>
                <p className="break-words text-xs">{personalInfo.website}</p>
              </div>
            )}
          </div>
        </div>

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-3">
            <h2 className="text-base font-bold mb-3 pb-2 border-b border-white/30">
              EĞİTİM
            </h2>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id} className="break-inside-avoid">
                  <p className="text-sm font-bold">{edu.degree}</p>
                  <p className="text-purple-200 text-xs">{edu.school}</p>
                  <p className="text-purple-300 text-xs">
                    {edu.startDate} - {edu.endDate || 'Devam'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div className="mb-3">
            <h2 className="text-base font-bold mb-3 pb-2 border-b border-white/30">
              DİLLER
            </h2>
            <div className="space-y-1.5 text-xs">
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between">
                  <span>{lang.name}</span>
                  <span className="text-purple-200 capitalize text-xs">{lang.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <div>
            <h2 className="text-base font-bold mb-3 pb-2 border-b border-white/30">
              PROJELER
            </h2>
            <div className="space-y-2">
              {projects.map((project) => (
                <div key={project.id} className="break-inside-avoid">
                  <p className="text-sm font-bold">{project.title}</p>
                  {project.link && (
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-200 text-xs hover:underline block"
                    >
                      {project.link.includes('github') ? '→ GitHub' : '→ Project Link'}
                    </a>
                  )}
                  <p className="text-xs text-purple-100 mt-1 leading-tight">{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] text-purple-200"
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
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        {/* Professional Summary */}
        {summary && (
          <section className="mb-3">
            <h2 className="text-xl font-bold text-purple-700 mb-3 relative">
              <span className="relative z-10">ÖZET</span>
              <div className="absolute bottom-0 left-0 w-20 h-3 bg-purple-200 z-0"></div>
            </h2>
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          </section>
        )}

        {/* Work Experience */}
        {experience.length > 0 && (
          <section className="mb-3">
            <h2 className="text-xl font-bold text-purple-700 mb-3 relative">
              <span className="relative z-10">DENEYIM</span>
              <div className="absolute bottom-0 left-0 w-20 h-3 bg-purple-200 z-0"></div>
            </h2>
            <div className="space-y-3">
              {experience.map((exp) => (
                <div key={exp.id} className="relative pl-6 border-l-2 border-purple-300 break-inside-avoid">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-purple-600"></div>
                  <div className="mb-1">
                    <h3 className="text-base font-bold text-gray-900">{exp.position}</h3>
                    <p className="text-purple-600 font-semibold">{exp.company}</p>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {exp.startDate} - {exp.endDate || 'Devam Ediyor'}
                    {exp.location && ` • ${exp.location}`}
                  </p>
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

        {/* Skills */}
        {skills.length > 0 && (
          <section className="mb-3">
            <h2 className="text-xl font-bold text-purple-700 mb-3 relative">
              <span className="relative z-10">YETENEKLER</span>
              <div className="absolute bottom-0 left-0 w-20 h-3 bg-purple-200 z-0"></div>
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {skills.map((skill) => (
                <div key={skill.id} className="flex justify-between items-center bg-purple-50 px-3 py-2 rounded">
                  <span className="text-gray-800 font-medium">{skill.name}</span>
                  <span className="text-purple-600 text-sm font-semibold">
                    {skill.years ? `${skill.years} yıl` : '1 yıl'}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certificates */}
        {certificates.length > 0 && (
          <section className="mb-3">
            <h2 className="text-xl font-bold text-purple-700 mb-3 relative">
              <span className="relative z-10">SERTİFİKALAR</span>
              <div className="absolute bottom-0 left-0 w-20 h-3 bg-purple-200 z-0"></div>
            </h2>
            <div className="space-y-2">
              {certificates.map((cert) => (
                <div key={cert.id} className="break-inside-avoid bg-purple-50 p-3 rounded">
                  <p className="font-bold text-gray-900">{cert.name}</p>
                  <p className="text-purple-600 text-sm">{cert.issuer}</p>
                  {cert.date && <p className="text-gray-600 text-sm">{cert.date}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
