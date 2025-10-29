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
  const { personalInfo, summary, experience, education, skills, languages, certificates } = data;

  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-gray-900 shadow-lg mx-auto p-0">
      {/* Header Section */}
      <div className="bg-linear-to-r from-blue-600 to-blue-700 text-white px-12 py-10">
        <h1 className="text-4xl font-bold mb-2">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        {personalInfo.title && (
          <p className="text-xl text-blue-100">{personalInfo.title}</p>
        )}
      </div>

      {/* Contact Info Bar */}
      <div className="bg-blue-50 px-12 py-4 border-b-2 border-blue-200">
        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
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
            <div className="flex items-center gap-1">
              <Linkedin className="w-4 h-4 text-blue-600" />
              <span>{personalInfo.linkedIn}</span>
            </div>
          )}
          {personalInfo.website && (
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
        <div className="flex-1 px-12 py-8">
          {/* Professional Summary */}
          {summary.text && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-700 mb-3 pb-2 border-b-2 border-blue-200">
                ÖZET
              </h2>
              <p className="text-gray-700 leading-relaxed">{summary.text}</p>
            </section>
          )}

          {/* Work Experience */}
          {experience.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-700 mb-3 pb-2 border-b-2 border-blue-200">
                DENEYIM
              </h2>
              <div className="space-y-6">
                {experience.map((exp) => (
                  <div key={exp.id}>
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

          {/* Education */}
          {education.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-700 mb-3 pb-2 border-b-2 border-blue-200">
                EĞİTİM
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id}>
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
                    {edu.description && (
                      <p className="text-gray-700 mt-2">{edu.description}</p>
                    )}
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
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-600"></div>
                YETENEKLER
              </h2>
              <div className="space-y-3">
                {skills.map((skill) => (
                  <div key={skill.id}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-gray-800">{skill.name}</span>
                      <span className="text-sm text-gray-600">{skill.level}</span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{
                          width: skill.level === 'expert' ? '100%' : 
                                 skill.level === 'advanced' ? '75%' : 
                                 skill.level === 'intermediate' ? '50%' : '25%'
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <section className="mb-8">
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
