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
  const { personalInfo, summary, experience, education, skills, languages, certificates } = data;

  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-gray-900 shadow-lg mx-auto flex">
      {/* Left Sidebar */}
      <div className="w-1/3 bg-linear-to-br from-purple-600 to-purple-800 text-white p-8">
        {/* Profile */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-5xl font-bold">
            {personalInfo.firstName.charAt(0)}{personalInfo.lastName.charAt(0)}
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">
            {personalInfo.firstName}<br/>{personalInfo.lastName}
          </h1>
          {personalInfo.title && (
            <p className="text-purple-100 text-center text-sm">{personalInfo.title}</p>
          )}
        </div>

        {/* Contact */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-3 pb-2 border-b border-white/30">
            İLETİŞİM
          </h2>
          <div className="space-y-2 text-sm">
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
                <p className="break-words text-xs">{personalInfo.linkedIn}</p>
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

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-3 pb-2 border-b border-white/30">
              YETENEKLER
            </h2>
            <div className="space-y-3">
              {skills.map((skill) => (
                <div key={skill.id} className="flex justify-between items-center">
                  <span className="text-sm">{skill.name}</span>
                  <span className="text-purple-200 text-xs">
                    {skill.years ? `${skill.years}y` : 
                     skill.level === 'expert' ? 'Uzman' :
                     skill.level === 'advanced' ? 'İleri' :
                     skill.level === 'intermediate' ? 'Orta' : 'Başlangıç'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-3 pb-2 border-b border-white/30">
              DİLLER
            </h2>
            <div className="space-y-2 text-sm">
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between">
                  <span>{lang.name}</span>
                  <span className="text-purple-200 capitalize text-xs">{lang.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certificates */}
        {certificates.length > 0 && (
          <div>
            <h2 className="text-lg font-bold mb-3 pb-2 border-b border-white/30">
              SERTİFİKALAR
            </h2>
            <div className="space-y-3 text-sm">
              {certificates.map((cert) => (
                <div key={cert.id}>
                  <p className="font-semibold">{cert.name}</p>
                  <p className="text-purple-200 text-xs">{cert.issuer}</p>
                  {cert.date && <p className="text-purple-300 text-xs">{cert.date}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        {/* Professional Summary */}
        {summary.text && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-purple-700 mb-3 relative">
              <span className="relative z-10">ÖZET</span>
              <div className="absolute bottom-0 left-0 w-20 h-3 bg-purple-200 -z-0"></div>
            </h2>
            <p className="text-gray-700 leading-relaxed">{summary.text}</p>
          </section>
        )}

        {/* Work Experience */}
        {experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-purple-700 mb-3 relative">
              <span className="relative z-10">DENEYIM</span>
              <div className="absolute bottom-0 left-0 w-20 h-3 bg-purple-200 -z-0"></div>
            </h2>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id} className="relative pl-6 border-l-2 border-purple-300">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-purple-600"></div>
                  <div className="mb-1">
                    <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
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

        {/* Education */}
        {education.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-purple-700 mb-3 relative">
              <span className="relative z-10">EĞİTİM</span>
              <div className="absolute bottom-0 left-0 w-20 h-3 bg-purple-200 -z-0"></div>
            </h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="relative pl-6 border-l-2 border-purple-300">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-purple-600"></div>
                  <div className="mb-1">
                    <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                    <p className="text-purple-600 font-semibold">{edu.school}</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    {edu.startDate} - {edu.endDate || 'Devam Ediyor'}
                    {edu.location && ` • ${edu.location}`}
                  </p>
                  {edu.field && <p className="text-gray-700">{edu.field}</p>}
                  {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                  {edu.description && <p className="text-gray-700 mt-1">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
