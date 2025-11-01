/**
 * Compact Modern CV Template
 * 
 * Super compact design that fits everything in 1 page
 * Photo optional, dense layout
 * 
 * @module components/cv-templates/CompactTemplate
 */

import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import type { CVData } from '@/types/cv-builder';
import Image from 'next/image';

interface CompactTemplateProps {
  data: CVData;
}

export function CompactTemplate({ data }: CompactTemplateProps) {
  const { personalInfo, summary, experience, education, skills, languages, certificates } = data;

  return (
    <div className="w-[210mm] h-[297mm] bg-white text-gray-900 shadow-lg mx-auto p-6 overflow-hidden">
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-blue-600">
        <div className="flex items-center gap-3">
          {personalInfo.photo && (
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-blue-600 shrink-0">
              <Image src={personalInfo.photo} alt="Profile" width={56} height={56} className="object-cover" />
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            {personalInfo.title && <p className="text-xs text-blue-600 font-semibold">{personalInfo.title}</p>}
          </div>
        </div>
        <div className="text-right text-[10px] text-gray-600">
          {personalInfo.email && <div className="flex items-center justify-end gap-1"><Mail className="w-3 h-3" />{personalInfo.email}</div>}
          {personalInfo.phone && <div className="flex items-center justify-end gap-1"><Phone className="w-3 h-3" />{personalInfo.phone}</div>}
          {personalInfo.city && <div className="flex items-center justify-end gap-1"><MapPin className="w-3 h-3" />{personalInfo.city}</div>}
        </div>
      </div>

      {/* Summary - Compact */}
      {summary && (
        <div className="mb-3">
          <p className="text-[10px] text-gray-700 leading-tight">{summary}</p>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        {/* Main - 3 columns */}
        <div className="col-span-3 space-y-3">
          {/* Experience - Compact */}
          {experience.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-blue-600 mb-1 border-b border-gray-200">EXPERIENCE</h2>
              <div className="space-y-2">
                {experience.slice(0, 4).map((exp) => (
                  <div key={exp.id} className="text-[10px]">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-gray-900">{exp.position}</h3>
                      <span className="text-gray-500 text-[9px]">{exp.startDate} - {exp.current ? 'Now' : exp.endDate}</span>
                    </div>
                    <p className="text-blue-600 font-semibold">{exp.company}</p>
                    {exp.description && (
                      <p className="text-gray-600 leading-tight mt-0.5">{exp.description.split('\n')[0].substring(0, 100)}...</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education - Compact */}
          {education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-blue-600 mb-1 border-b border-gray-200">EDUCATION</h2>
              <div className="space-y-1.5">
                {education.slice(0, 2).map((edu) => (
                  <div key={edu.id} className="text-[10px]">
                    <div className="flex justify-between">
                      <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                      <span className="text-gray-500 text-[9px]">{edu.endDate}</span>
                    </div>
                    <p className="text-gray-700">{edu.school} • {edu.field}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certificates - If any */}
          {certificates.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-blue-600 mb-1 border-b border-gray-200">CERTIFICATES</h2>
              <div className="grid grid-cols-2 gap-1">
                {certificates.slice(0, 4).map((cert) => (
                  <p key={cert.id} className="text-[9px] text-gray-700">• {cert.name}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - 1 column */}
        <div className="bg-gray-50 -mr-6 -mb-6 p-3 space-y-3">
          {/* Skills - Compact */}
          {skills.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold text-gray-800 mb-1 pb-0.5 border-b border-blue-600">SKILLS</h2>
              <div className="space-y-0.5">
                {skills.slice(0, 12).map((skill) => (
                  <div key={skill.id} className="flex justify-between items-center text-[9px]">
                    <span className="text-gray-700">{skill.name}</span>
                    <span className="text-blue-600 font-bold">
                      {skill.years ? `${skill.years}y` : '1y'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages - Compact */}
          {languages.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold text-gray-800 mb-1 pb-0.5 border-b border-blue-600">LANGUAGES</h2>
              <div className="space-y-0.5">
                {languages.map((lang) => (
                  <div key={lang.id} className="text-[9px] text-gray-700">{lang.name}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
