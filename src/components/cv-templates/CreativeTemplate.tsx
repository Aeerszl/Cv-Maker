/**
 * Creative CV Template
 * 
 * ATS-optimized creative design with sidebar
 * %90 ATS compatibility
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
    <div className="w-[210mm] min-h-[297mm] bg-white text-gray-900 shadow-lg mx-auto flex overflow-hidden">
      {/* Left Sidebar - 30% width */}
      <div className="w-[30%] bg-gray-800 text-white p-4">
        {/* Profile */}
        <div className="mb-3">
          <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold">
            {personalInfo.firstName.charAt(0)}{personalInfo.lastName.charAt(0)}
          </div>
          <h1 className="text-base font-bold text-center leading-tight mb-1">
            {personalInfo.firstName}<br/>{personalInfo.lastName}
          </h1>
          {personalInfo.title && (
            <p className="text-gray-300 text-center text-[10px]">{personalInfo.title}</p>
          )}
        </div>

        {/* Contact */}
        <div className="mb-3">
          <h2 className="text-xs font-bold mb-2 pb-1 border-b border-white/30">
            İLETİŞİM
          </h2>
          <div className="space-y-1 text-[9px]">
            {personalInfo.email && (
              <div>
                <p className="text-gray-400 text-[8px]">Email</p>
                <p className="break-words leading-tight">{personalInfo.email}</p>
              </div>
            )}
            {personalInfo.phone && (
              <div>
                <p className="text-gray-400 text-[8px]">Telefon</p>
                <p className="leading-tight">{personalInfo.phone}</p>
              </div>
            )}
            {(personalInfo.city || personalInfo.country) && (
              <div>
                <p className="text-gray-400 text-[8px]">Konum</p>
                <p className="leading-tight">
                  {personalInfo.city}{personalInfo.city && personalInfo.country && '/'}{personalInfo.country}
                </p>
              </div>
            )}
            {personalInfo.linkedIn && (
              <div>
                <p className="text-gray-400 text-[8px]">LinkedIn</p>
                <a 
                  href={personalInfo.linkedIn.startsWith('http') ? personalInfo.linkedIn : `https://linkedin.com/in/${personalInfo.linkedIn}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 text-[9px] hover:underline truncate block"
                >
                  LinkedIn
                </a>
              </div>
            )}
            <div>
              <p className="text-gray-400 text-[8px]">GitHub</p>
              <a 
                href={personalInfo.github ? (personalInfo.github.startsWith('http') ? personalInfo.github : `https://github.com/${personalInfo.github}`) : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 text-[9px] hover:underline truncate block"
              >
                GitHub
              </a>
            </div>
            {personalInfo.website && (
              <div>
                <p className="text-gray-400 text-[8px]">Website</p>
                <a 
                  href={personalInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 text-[9px] hover:underline truncate block"
                >
                  {personalInfo.website.replace('https://', '').replace('http://', '').replace('www.', '')}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Education & Certificates */}
        {(education.length > 0 || certificates.length > 0) && (
          <div className="mb-3">
            <h2 className="text-xs font-bold mb-2 pb-1 border-b border-white/30">
              EĞİTİM & SERTİFİKA
            </h2>
            
            {/* Education */}
            {education.length > 0 && (
              <div className="space-y-1.5 mb-2">
                {education.map((edu) => (
                  <div key={edu.id} className="break-inside-avoid">
                    <p className="text-[10px] font-bold">{edu.degree}</p>
                    <p className="text-gray-300 text-[9px]">{edu.school}</p>
                    <p className="text-gray-400 text-[8px]">
                      {edu.startDate} - {edu.endDate || 'Devam'}
                    </p>
                  </div>
                ))}
              </div>
            )}
            
            {/* Certificates */}
            {certificates.length > 0 && (
              <div className="space-y-1 border-t border-white/20 pt-1.5">
                {certificates.map((cert) => (
                  <div key={cert.id} className="break-inside-avoid">
                    <p className="text-[9px] font-bold text-gray-200">{cert.name}</p>
                    <p className="text-gray-400 text-[8px]">{cert.issuer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div className="mb-3">
            <h2 className="text-xs font-bold mb-2 pb-1 border-b border-white/30">
              DİLLER
            </h2>
            <div className="space-y-1 text-[9px]">
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between">
                  <span>{lang.name}</span>
                  <span className="text-gray-400 capitalize text-[8px]">{lang.level}</span>
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
            <h2 className="text-lg font-bold text-gray-800 mb-2 relative">
              <span className="relative z-10">ÖZET</span>
              <div className="absolute bottom-0 left-0 w-16 h-2 bg-gray-300 z-0"></div>
            </h2>
            <p className="text-gray-700 text-xs leading-relaxed">{summary}</p>
          </section>
        )}

        {/* Work Experience */}
        {experience.length > 0 && (
          <section className="mb-3">
            <h2 className="text-lg font-bold text-gray-800 mb-2 relative">
              <span className="relative z-10">DENEYIM</span>
              <div className="absolute bottom-0 left-0 w-16 h-2 bg-gray-300 z-0"></div>
            </h2>
            <div className="space-y-2">
              {experience.map((exp) => (
                <div key={exp.id} className="relative pl-4 border-l-2 border-gray-400 break-inside-avoid">
                  <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-gray-800"></div>
                  <div className="mb-0.5">
                    <h3 className="text-sm font-bold text-gray-900">{exp.position}</h3>
                    <p className="text-gray-600 font-semibold text-xs">{exp.company}</p>
                  </div>
                  <p className="text-[10px] text-gray-600 mb-1">
                    {exp.startDate} - {exp.endDate || 'Devam'}
                    {exp.location && ` • ${exp.location}`}
                  </p>
                  {exp.description && (
                    <p className="text-[10px] text-gray-700 leading-tight line-clamp-2">
                      {exp.description.split('\n').join(' • ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section className="mb-3">
            <h2 className="text-lg font-bold text-gray-800 mb-2 relative">
              <span className="relative z-10">PROJELER</span>
              <div className="absolute bottom-0 left-0 w-16 h-2 bg-gray-300 z-0"></div>
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {projects.map((project) => (
                <div key={project.id} className="break-inside-avoid">
                  <h3 className="text-xs font-bold text-gray-900">{project.title}</h3>
                  {project.description && (
                    <p className="text-gray-700 text-[9px] leading-tight mt-0.5">{project.description}</p>
                  )}
                  {(project.link || project.github) && (
                    <div className="flex gap-2 mt-0.5 text-[9px]">
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
                          href={project.github} 
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
              ))}
            </div>
          </section>
        )}

        {/* Skills - 5 per row */}
        {skills.length > 0 && (
          <section className="mb-3">
            <h2 className="text-lg font-bold text-gray-800 mb-2 relative">
              <span className="relative z-10">YETENEKLER</span>
              <div className="absolute bottom-0 left-0 w-16 h-2 bg-gray-300 z-0"></div>
            </h2>
            <div className="grid grid-cols-5 gap-x-3 gap-y-1.5">
              {skills.flatMap((skill) => 
                skill.name.split('/').map((name, idx) => ({
                  id: `${skill.id}-${idx}`,
                  name: name.trim(),
                  years: skill.years
                }))
              ).map((skill) => (
                <div key={skill.id} className="text-[10px] text-gray-700">
                  {skill.name}{skill.years && <span className="text-gray-600">-{skill.years}y</span>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
