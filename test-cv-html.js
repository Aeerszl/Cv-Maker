// Test script for generateCVHTML function
function getLevelText(level) {
  switch (level) {
    case 'beginner': return 'Başlangıç';
    case 'intermediate': return 'Orta';
    case 'advanced': return 'İleri';
    case 'expert': return 'Uzman';
    default: return 'Belirtilmemiş';
  }
}

function getLanguageLevelText(level) {
  switch (level) {
    case 'basic': return 'Temel';
    case 'intermediate': return 'Orta';
    case 'advanced': return 'İleri';
    case 'fluent': return 'Akıcı';
    case 'native': return 'Anadil';
    default: return 'Belirtilmemiş';
  }
}

function generateCVHTML(cv) {
  const personalInfo = cv.personalInfo || {};
  const fullName = personalInfo.fullName || 'İsim Soyisim';
  const title = personalInfo.title || '';
  const email = personalInfo.email || '';
  const phone = personalInfo.phone || '';
  const location = personalInfo.location || '';
  const linkedin = personalInfo.linkedin || '';
  const summary = cv.summary || '';

  // Template-specific styling
  let headerStyle = '';
  let bodyStyle = '';
  let sectionStyle = '';

  switch (cv.template) {
    case 'modern':
      headerStyle = 'bg-gray-800 text-white px-8 py-6';
      bodyStyle = 'bg-white text-gray-900';
      sectionStyle = 'border-l-4 border-blue-500 pl-4';
      break;
    case 'classic':
      headerStyle = 'text-center border-b-2 border-gray-300 pb-4';
      bodyStyle = 'bg-white text-gray-900';
      sectionStyle = 'border-b border-gray-200 pb-4';
      break;
    case 'creative':
      headerStyle = 'bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-6 rounded-lg';
      bodyStyle = 'bg-gray-50 text-gray-900';
      sectionStyle = 'bg-white p-6 rounded-lg shadow-md';
      break;
    case 'professional':
      headerStyle = 'bg-blue-900 text-white px-8 py-6';
      bodyStyle = 'bg-white text-gray-900';
      sectionStyle = 'border-l-4 border-blue-900 pl-4';
      break;
    case 'minimal':
      headerStyle = 'text-center py-4';
      bodyStyle = 'bg-white text-gray-900';
      sectionStyle = 'py-4';
      break;
    case 'executive':
      headerStyle = 'bg-gray-900 text-white px-8 py-8';
      bodyStyle = 'bg-white text-gray-900';
      sectionStyle = 'border-b-2 border-gray-300 pb-6';
      break;
    case 'techpro':
      headerStyle = 'bg-black text-green-400 px-8 py-6 font-mono';
      bodyStyle = 'bg-gray-900 text-green-400 font-mono';
      sectionStyle = 'border border-green-400 p-4';
      break;
    case 'elegant':
      headerStyle = 'text-center bg-gradient-to-r from-gray-100 to-gray-200 py-8';
      bodyStyle = 'bg-white text-gray-900';
      sectionStyle = 'bg-gray-50 p-6 rounded-lg';
      break;
    case 'bold':
      headerStyle = 'bg-red-600 text-white px-8 py-6 font-bold';
      bodyStyle = 'bg-white text-gray-900';
      sectionStyle = 'border-2 border-red-600 p-4';
      break;
    default:
      headerStyle = 'bg-blue-600 text-white px-8 py-6';
      bodyStyle = 'bg-white text-gray-900';
      sectionStyle = 'border-l-4 border-blue-600 pl-4';
  }

  return `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${cv.title}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          body { font-family: 'Inter', sans-serif; }
        </style>
    </head>
    <body class="${bodyStyle} max-w-4xl mx-auto p-8">
        <!-- Header -->
        <div class="header ${headerStyle} mb-8">
            <h1 class="text-4xl font-bold mb-2">${fullName}</h1>
            ${title ? `<p class="text-xl opacity-90">${title}</p>` : ''}
            <div class="mt-4 flex flex-wrap gap-4 text-sm">
                ${email ? `<span>📧 ${email}</span>` : ''}
                ${phone ? `<span>📱 ${phone}</span>` : ''}
                ${location ? `<span>📍 ${location}</span>` : ''}
                ${linkedin ? `<span>💼 ${linkedin}</span>` : ''}
            </div>
        </div>

        <!-- Summary -->
        ${summary ? `
        <div class="section ${sectionStyle} mb-8">
            <h2 class="text-2xl font-bold mb-4 text-blue-600">ÖZET</h2>
            <p class="text-lg leading-relaxed">${summary}</p>
        </div>
        ` : ''}

        <!-- Work Experience -->
        ${cv.workExperience && cv.workExperience.length > 0 ? `
        <div class="section ${sectionStyle} mb-8">
            <h2 class="text-2xl font-bold mb-6 text-blue-600">İŞ DENEYİMİ</h2>
            ${cv.workExperience?.map((exp, index) => `
                <div class="mb-6 ${index > 0 ? 'border-t pt-6' : ''}">
                    <h3 class="text-xl font-semibold text-gray-800">${exp.position || ''}</h3>
                    <p class="text-lg text-blue-600 mb-2">${exp.company || ''}</p>
                    <p class="text-sm text-gray-600 mb-3">${exp.startDate || ''} - ${exp.endDate || (exp.current ? 'Devam Ediyor' : '')}</p>
                    ${exp.description ? `<p class="text-gray-700 leading-relaxed">${exp.description}</p>` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}

        <!-- Education -->
        ${cv.education && cv.education.length > 0 ? `
        <div class="section ${sectionStyle} mb-8">
            <h2 class="text-2xl font-bold mb-6 text-blue-600">EĞİTİM</h2>
            ${cv.education?.map((edu, index) => `
                <div class="mb-6 ${index > 0 ? 'border-t pt-6' : ''}">
                    <h3 class="text-xl font-semibold text-gray-800">${edu.degree || ''} ${edu.field ? `in ${edu.field}` : ''}</h3>
                    <p class="text-lg text-blue-600 mb-2">${edu.school || ''}</p>
                    <p class="text-sm text-gray-600">${edu.startDate || ''} - ${edu.endDate || (edu.current ? 'Devam Ediyor' : '')}</p>
                </div>
            `).join('')}
        </div>
        ` : ''}

        <!-- Skills -->
        ${cv.skills && cv.skills.length > 0 ? `
        <div class="section ${sectionStyle} mb-8">
            <h2 class="text-2xl font-bold mb-6 text-blue-600">YETENEKLER</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                ${cv.skills?.map((skill) => `
                    <div class="bg-gray-100 p-3 rounded-lg">
                        <span class="font-medium">${skill.name || ''}</span>
                        <span class="text-sm text-gray-600 ml-2">(${getLevelText(skill.level)})</span>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}

        <!-- Languages -->
        ${cv.languages && cv.languages.length > 0 ? `
        <div class="section ${sectionStyle} mb-8">
            <h2 class="text-2xl font-bold mb-6 text-blue-600">DİL BİLGİLERİ</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                ${cv.languages?.map((lang) => `
                    <div class="bg-gray-100 p-3 rounded-lg">
                        <span class="font-medium">${lang.name || ''}</span>
                        <span class="text-sm text-gray-600 ml-2">(${getLanguageLevelText(lang.level)})</span>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
    </body>
    </html>
  `;
}

// Test with different templates
const testCV = {
  title: 'Test CV',
  template: 'modern',
  personalInfo: {
    fullName: 'Ahmet Yılmaz',
    title: 'Senior Software Developer',
    email: 'ahmet@example.com',
    phone: '+90 555 123 4567',
    location: 'İstanbul, Türkiye',
    linkedin: 'linkedin.com/in/ahmetyilmaz'
  },
  summary: 'Deneyimli yazılım geliştirici, modern teknolojiler ve agile metodolojiler konusunda uzman.',
  workExperience: [
    {
      position: 'Senior Developer',
      company: 'Tech Company',
      startDate: '2022-01',
      endDate: '2024-01',
      description: 'Full-stack development, React, Node.js, MongoDB'
    }
  ],
  education: [
    {
      degree: 'Bachelor',
      field: 'Computer Science',
      school: 'İstanbul Üniversitesi',
      startDate: '2018-09',
      endDate: '2022-06'
    }
  ],
  skills: [
    { name: 'JavaScript', level: 'advanced' },
    { name: 'React', level: 'expert' },
    { name: 'Node.js', level: 'advanced' }
  ],
  languages: [
    { name: 'Türkçe', level: 'native' },
    { name: 'English', level: 'fluent' }
  ]
};

console.log('Testing Modern template:');
console.log(generateCVHTML(testCV).substring(0, 500) + '...');

// Test different template
testCV.template = 'techpro';
console.log('\nTesting TechPro template:');
console.log(generateCVHTML(testCV).substring(0, 500) + '...');