// @ts-nocheck
/**
 * CV HTML Generation Utility
 *
 * Generates HTML for CV PDF generation
 *
 * @module utils/cvHtmlGenerator
 */

export function generateCVHTML(cv): string {
  const personalInfo = cv.personalInfo || {};

  // fullName oluşturma - firstName + lastName'den veya mevcut fullName'den
  const fullName = personalInfo.fullName ||
    (personalInfo.firstName && personalInfo.lastName
      ? `${personalInfo.firstName} ${personalInfo.lastName}`
      : 'İsim Soyisim');

  const title = personalInfo.title || '';
  const email = personalInfo.email || '';
  const phone = personalInfo.phone || '';
  const location = personalInfo.address 
    ? `${personalInfo.address}${personalInfo.city ? ', ' + personalInfo.city : ''}${personalInfo.country ? ', ' + personalInfo.country : ''}`
    : '';
  const linkedin = personalInfo.linkedIn || ''; // linkedIn - büyük I
  const github = personalInfo.github || '';
  const website = personalInfo.website || '';

  // summary kontrolü - object ise text al, string ise direkt kullan
  const summary = cv.summary?.text || cv.summary || '';

  // experience/workExperience uyumluluğu
  const experiences = cv.experience || cv.workExperience || [];

  // Language-based labels
  const cvLanguage = cv.cvLanguage || 'tr';
  const labels = cvLanguage === 'en' ? {
    summary: 'SUMMARY',
    experience: 'WORK EXPERIENCE',
    projects: 'PROJECTS',
    education: 'EDUCATION',
    skills: 'SKILLS',
    languages: 'LANGUAGES',
    certificates: 'CERTIFICATES',
    present: 'Present',
    years: 'yrs'
  } : {
    summary: 'ÖZET',
    experience: 'İŞ DENEYİMİ',
    projects: 'PROJELER',
    education: 'EĞİTİM',
    skills: 'YETENEKLER',
    languages: 'DİLLER',
    certificates: 'SERTİFİKALAR',
    present: 'Devam Ediyor',
    years: 'yıl'
  };

  return `
    <!DOCTYPE html>
    <html lang="${cvLanguage}">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${cv.title || 'CV'}</title>
        <style>
          /* Modern Template Styles for PDF */
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Arial', sans-serif; line-height: 1.5; color: #111827; background: white; }
          .cv-container { width: 210mm; min-height: 297mm; margin: 0 auto; position: relative; }

          /* Header */
          .header { background: #1f2937; color: white; padding: 2rem; }
          .header h1 { font-size: 1.875rem; font-weight: bold; margin-bottom: 0.25rem; }
          .header p { font-size: 1.125rem; color: #d1d5db; }

          /* Contact Bar */
          .contact-bar { background: #f3f4f6; padding: 0.75rem 2rem; border-bottom: 2px solid #d1d5db; }
          .contact-bar .contact-info { display: flex; flex-wrap: wrap; gap: 1.5rem; font-size: 0.75rem; color: #374151; }
          .contact-bar a { color: #2563eb; text-decoration: underline; }

          /* Two Column Layout */
          .two-column { display: flex; gap: 1.5rem; }

          /* Left Column */
          .left-column { flex: 1; padding: 1.5rem 2rem; }

          /* Right Column */
          .right-column { width: 280px; background: #f9fafb; padding: 1.5rem; border-left: 4px solid #1f2937; }

          /* Section Headers */
          .section-header { font-size: 1.25rem; font-weight: bold; color: #1f2937; margin-bottom: 0.75rem; padding-bottom: 0.5rem; border-bottom: 2px solid #d1d5db; }
          .sidebar-section-header { font-size: 1rem; font-weight: bold; color: #111827; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem; }
          .sidebar-section-header::before { content: ''; width: 4px; height: 20px; background: #1f2937; }

          /* Skills */
          .skills-container { display: flex; flex-wrap: wrap; gap: 0.5rem; }
          .skill-tag { font-size: 0.75rem; padding: 0.25rem 0.5rem; background: #f3f4f6; color: #1f2937; border: 1px solid #d1d5db; border-radius: 0.25rem; }

          /* Languages */
          .languages-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; }
          .language-item { text-align: center; }
          .language-name { font-weight: 500; color: #1f2937; font-size: 0.75rem; }
          .language-level { font-size: 0.625rem; color: #6b7280; text-transform: capitalize; }

          /* Experience */
          .experience-item { margin-bottom: 1rem; page-break-inside: avoid; }
          .experience-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.25rem; }
          .experience-title { font-size: 1rem; font-weight: bold; color: #111827; }
          .experience-company { color: #4b5563; font-weight: 600; font-size: 0.875rem; }
          .experience-date { text-align: right; font-size: 0.75rem; color: #6b7280; }
          .experience-description { margin-top: 0.5rem; }
          .experience-description ul { list-style: disc; list-style-position: inside; color: #374151; font-size: 0.75rem; line-height: 1.25; }
          .experience-description li { margin-bottom: 0.125rem; }

          /* Education */
          .education-item { margin-bottom: 0.75rem; page-break-inside: avoid; }
          .education-degree { font-size: 0.875rem; font-weight: bold; color: #111827; }
          .education-school { color: #4b5563; font-weight: 600; font-size: 0.75rem; }
          .education-field { color: #6b7280; font-size: 0.625rem; }
          .education-date { font-size: 0.625rem; color: #9ca3af; }

          /* Projects */
          .projects-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
          .project-item { page-break-inside: avoid; }
          .project-title { font-size: 0.875rem; font-weight: bold; color: #111827; }
          .project-description { color: #374151; font-size: 0.75rem; line-height: 1.25; margin-top: 0.25rem; }
          .project-links { display: flex; gap: 0.75rem; font-size: 0.75rem; margin-top: 0.25rem; }
          .project-links a { color: #2563eb; text-decoration: underline; }

          /* Summary */
          .summary { color: #374151; font-size: 0.875rem; line-height: 1.625; }

          /* Spacing */
          .mb-6 { margin-bottom: 1.5rem; }
          .mb-5 { margin-bottom: 1.25rem; }
          .mb-4 { margin-bottom: 1rem; }
          .mb-3 { margin-bottom: 0.75rem; }
          .mt-1 { margin-top: 0.25rem; }
          .space-y-3 > * + * { margin-top: 0.75rem; }
          .space-y-2 > * + * { margin-top: 0.5rem; }

          /* Text utilities */
          .text-xs { font-size: 0.75rem; }
          .text-sm { font-size: 0.875rem; }
          .text-base { font-size: 1rem; }
          .text-gray-600 { color: #4b5563; }
          .text-gray-500 { color: #6b7280; }
          .text-gray-700 { color: #374151; }
          .text-gray-800 { color: #1f2937; }
          .text-gray-900 { color: #111827; }
          .font-bold { font-weight: bold; }
          .font-semibold { font-weight: 600; }
          .font-medium { font-weight: 500; }
          .leading-relaxed { line-height: 1.625; }
          .leading-tight { line-height: 1.25; }
        </style>
    </head>
    <body>
        <div class="cv-container">
            <!-- Header Section -->
            <div class="header">
                <h1>${escapeHtml(fullName)}</h1>
                ${title ? `<p>${escapeHtml(title)}</p>` : ''}
            </div>

            <!-- Contact Info Bar -->
            <div class="contact-bar">
                <div class="contact-info">
                    ${email ? `<div>${escapeHtml(email)}</div>` : ''}
                    ${phone ? `<div>${escapeHtml(phone)}</div>` : ''}
                    ${location ? `<div>${escapeHtml(location)}</div>` : ''}
                    ${linkedin ? `<a href="${escapeHtml(linkedin.startsWith('http') ? linkedin : `https://linkedin.com/in/${linkedin}`)}" target="_blank">LinkedIn</a>` : ''}
                    ${github ? `<a href="${escapeHtml(github.startsWith('http') ? github : `https://github.com/${github}`)}" target="_blank">GitHub</a>` : ''}
                    ${website ? `<a href="${escapeHtml(website)}" target="_blank">${escapeHtml(website.replace('https://', '').replace('http://', '').replace('www.', ''))}</a>` : ''}
                </div>
            </div>

            <!-- Two Column Layout -->
            <div class="two-column">
                <!-- Left Column - Main Content -->
                <div class="left-column">
                    <!-- Professional Summary -->
                    ${summary ? `
                    <section class="mb-6">
                        <h2 class="section-header">${labels.summary}</h2>
                        <p class="summary">${escapeHtml(summary)}</p>
                    </section>
                    ` : ''}

                    <!-- Work Experience -->
                    ${experiences && experiences.length > 0 ? `
                    <section class="mb-6">
                        <h2 class="section-header">${labels.experience}</h2>
                        <div class="space-y-3">
                            ${experiences.map((exp) => `
                                <div class="experience-item">
                                    <div class="experience-header">
                                        <div>
                                            <h3 class="experience-title">${escapeHtml(exp.position || '')}</h3>
                                            <p class="experience-company">${escapeHtml(exp.company || '')}</p>
                                        </div>
                                        <div class="experience-date">
                                            <div>${escapeHtml(exp.startDate || '')} - ${escapeHtml(exp.endDate || (exp.current ? labels.present : ''))}</div>
                                            ${exp.location ? `<p class="text-gray-500">${escapeHtml(exp.location)}</p>` : ''}
                                        </div>
                                    </div>
                                    ${exp.description ? `
                                    <div class="experience-description">
                                        <ul>
                                            ${exp.description.split('\n').slice(0, 3).map((item) =>
                                                item.trim() ? `<li>${escapeHtml(item.trim())}</li>` : ''
                                            ).join('')}
                                        </ul>
                                    </div>
                                    ` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </section>
                    ` : ''}

                    <!-- Projects -->
                    ${cv.projects && cv.projects.length > 0 ? `
                    <section class="mb-6">
                        <h2 class="section-header">${labels.projects}</h2>
                        <div class="projects-grid">
                            ${cv.projects.map((project) => `
                                <div class="project-item">
                                    <h3 class="project-title">${escapeHtml(project.title || project.name || '')}</h3>
                                    ${project.description ? `<p class="project-description">${escapeHtml(project.description)}</p>` : ''}
                                    <div class="project-links">
                                        ${project.link || project.url ? `<a href="${escapeHtml(project.link || project.url)}" target="_blank">Website</a>` : ''}
                                        ${project.github ? `<a href="${escapeHtml(project.github)}" target="_blank">GitHub</a>` : ''}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </section>
                    ` : ''}
                </div>

                <!-- Right Column - Sidebar -->
                <div class="right-column">
                    <!-- Skills -->
                    ${cv.skills && cv.skills.length > 0 ? `
                    <section class="mb-5">
                        <h2 class="sidebar-section-header">${labels.skills}</h2>
                        <div class="skills-container">
                            ${cv.skills.flatMap((skill) =>
                                skill.name.split('/').map((name) =>
                                    `<span class="skill-tag">${escapeHtml(name.trim())}${skill.years ? `-${skill.years}${labels.years}` : ''}</span>`
                                )
                            ).join('')}
                        </div>
                    </section>
                    ` : ''}

                    <!-- Languages -->
                    ${cv.languages && cv.languages.length > 0 ? `
                    <section class="mb-5">
                        <h2 class="sidebar-section-header">${labels.languages}</h2>
                        <div class="languages-grid">
                            ${cv.languages.map((lang) => `
                                <div class="language-item">
                                    <div class="language-name">${escapeHtml(lang.name || '')}</div>
                                    <div class="language-level">${escapeHtml(getLanguageLevelText(lang.level))}</div>
                                </div>
                            `).join('')}
                        </div>
                    </section>
                    ` : ''}

                    <!-- Education & Certificates -->
                    ${(cv.education && cv.education.length > 0) || (cv.certifications && cv.certifications.length > 0) ? `
                    <section>
                        <h2 class="sidebar-section-header">${labels.education} & ${labels.certificates}</h2>

                        <!-- Education -->
                        ${cv.education && cv.education.length > 0 ? `
                        <div class="space-y-3 mb-4">
                            ${cv.education.map((edu) => `
                                <div class="education-item">
                                    <h3 class="education-degree">${escapeHtml(edu.degree || '')}</h3>
                                    <p class="education-school">${escapeHtml(edu.school || '')}</p>
                                    ${edu.field ? `<p class="education-field">${escapeHtml(edu.field)}</p>` : ''}
                                    <p class="education-date">${escapeHtml(edu.startDate || '')} - ${escapeHtml(edu.endDate || (edu.current ? labels.present : ''))}</p>
                                </div>
                            `).join('')}
                        </div>
                        ` : ''}

                        <!-- Certificates -->
                        ${cv.certifications && cv.certifications.length > 0 ? `
                        <div class="space-y-2 ${cv.education && cv.education.length > 0 ? 'border-t border-gray-300 pt-3' : ''}">
                            ${cv.certifications.map((cert) => `
                                <div>
                                    <p class="font-medium text-gray-800 text-xs leading-tight">${escapeHtml(cert.name || '')}</p>
                                    <p class="text-xs text-gray-600">${escapeHtml(cert.issuer || '')}</p>
                                    ${cert.date ? `<p class="text-xs text-gray-500">${escapeHtml(cert.date)}</p>` : ''}
                                </div>
                            `).join('')}
                        </div>
                        ` : ''}
                    </section>
                    ` : ''}
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
}

function getLanguageLevelText(level: string): string {
  const levels: { [key: string]: string } = {
    'basic': 'Temel',
    'intermediate': 'Orta',
    'fluent': 'Akıcı',
    'native': 'Anadil'
  };
  return levels[level] || level;
}

function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}