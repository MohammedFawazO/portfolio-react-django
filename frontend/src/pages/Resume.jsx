import { useState } from 'react'
import { Monitor } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import SectionHeading from '../components/ui/SectionHeading'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Container from '../components/ui/Container'
import { StaggerChildren, StaggerItem } from '../components/animations/StaggerChildren'
import { BooksShowcase } from '../components/ui/books-showcase'

function Resume() {
  const [selectedCv, setSelectedCv] = useState(null)

  // Each "binder" on the shelf is a version of my CV,
// so the same 3D showcase, carousel and detail panel drive the section - only
// the content changes. Download links point at the PDFs in /public/media.
//
// The showcase paints a book cover by default; these painters replace it with
// an actual résumé page (front), a document back and a labelled spine, so the
// shelf reads as a stack of CVs rather than novels.

// The covers are painted into canvas textures, so they have to name the site's
// own families rather than a browser default. This section sticks to Michroma
// for display and Poppins for everything else.
const DISPLAY_FONT = "'Michroma', 'Poppins', sans-serif"
const TEXT_FONT = "'Poppins', sans-serif"

const displayFont = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return DISPLAY_FONT
  const value = getComputedStyle(document.documentElement).getPropertyValue('--font-display').trim()
  return value || DISPLAY_FONT
}
const monoFont = () => TEXT_FONT

function wrapText(ctx, text, maxWidth) {
  const words = String(text).split(' ')
  const lines = []
  let line = ''
  words.forEach((word) => {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = test
    }
  })
  if (line) lines.push(line)
  return lines
}

function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16)
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`
}

function paintResumeCover(ctx, w, h, cv) {
  const accent = cv.accent
  const ink = '38, 51, 56'

  // paper
  ctx.fillStyle = '#FBFAF6'
  ctx.fillRect(0, 0, w, h)
  // faint ruled lines
  ctx.strokeStyle = `rgba(${hexToRgb(accent)},0.10)`
  ctx.lineWidth = 2
  for (let y = 300; y < h - 60; y += 46) {
    ctx.beginPath()
    ctx.moveTo(70, y)
    ctx.lineTo(w - 70, y)
    ctx.stroke()
  }

  // header band with the role. Only a document that actually carries a photo
  // reserves the left-hand column for its avatar - the photo-less CVs use the
  // full width and centre their title, with their badge down in the footer.
  // coverTitle lets a cover show a shorter line than the panel title (e.g.
  // "Python Full Stack") so the type stays big and the band never crowds.
  const reservedLeft = cv.hasPhoto ? 260 : 0
  const textCentre = reservedLeft + (w - reservedLeft) / 2
  const textWidth = w - reservedLeft - 120

  ctx.fillStyle = accent
  ctx.fillRect(0, 0, w, 300)
  ctx.fillStyle = 'rgba(255,255,255,0.16)'
  ctx.fillRect(0, 300, w, 10)

  // The role line shrinks to fit on a single line whenever it can (down to a
  // readable floor), so "Python Full Stack" never gets chopped to "Python Full".
  ctx.textAlign = 'center'
  ctx.fillStyle = '#FFFFFF'
  const rawTitle = (cv.coverTitle || cv.title).toUpperCase()
  const TITLE_MAX = 82
  const TITLE_MIN = 52
  const AUTHOR_SIZE = 40

  let titleSize = TITLE_MAX
  ctx.font = `700 ${titleSize}px ${displayFont()}`
  const singleWidth = ctx.measureText(rawTitle).width
  if (singleWidth > textWidth) {
    const fitted = Math.floor((titleSize * textWidth) / singleWidth)
    if (fitted >= TITLE_MIN) {
      titleSize = fitted
      ctx.font = `700 ${titleSize}px ${displayFont()}`
    }
  }
  const titleLines = wrapText(ctx, rawTitle, textWidth).slice(0, 2)

  const lineHeight = Math.round(titleSize * 1.12)
  const blockHeight = titleLines.length * lineHeight + 22 + AUTHOR_SIZE
  let cursorY = (300 - blockHeight) / 2 + titleSize * 0.78
  titleLines.forEach((line) => {
    ctx.fillText(line, textCentre, cursorY)
    cursorY += lineHeight
  })

  ctx.globalAlpha = 0.85
  ctx.font = `500 ${AUTHOR_SIZE}px ${displayFont()}`
  ctx.fillText(cv.author, textCentre, cursorY + 16)
  ctx.globalAlpha = 1

  // body : section labels + bullet rules, so it reads as a filled document
  ctx.textAlign = 'left'
  let y = 400
  const sections = cv.sections?.length ? cv.sections : ['Experience', 'Skills', 'Projects', 'Education']
  sections.forEach((section) => {
    ctx.fillStyle = accent
    ctx.font = `700 30px ${displayFont()}`
    ctx.fillText(section.toUpperCase(), 70, y)
    ctx.fillStyle = `rgba(${ink},0.25)`
    ctx.fillRect(70, y + 14, w - 140, 3)
    y += 58
    ctx.fillStyle = `rgba(${ink},0.42)`
    for (let i = 0; i < 3; i += 1) {
      const width = (w - 190) * (0.95 - i * 0.18 - (section.length % 3) * 0.04)
      ctx.fillRect(70, y, Math.max(120, width), 12)
      y += 26
    }
    y += 26
  })

// footer
  ctx.fillStyle = `rgba(${ink},0.35)`
  ctx.font = `500 26px ${monoFont()}`
  ctx.textAlign = 'left'
  ctx.fillText('MOHAMMED FAWAZ O  ·  FULL STACK DEVELOPER', 70, h - 62)
  ctx.fillStyle = accent
  ctx.fillRect(70, h - 92, 120, 8)

  // The photo version gets an avatar mark so the difference between the two is
  // obvious at a glance on the shelf; the photo-less one is flagged in the
  // footer instead, where it can never crowd the title.
  if (cv.hasPhoto) {
    const cx = 140
    const cy = 142
    const r = 64
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255,255,255,0.94)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.65)'
    ctx.lineWidth = 4
    ctx.stroke()

    ctx.fillStyle = accent
    ctx.beginPath()
    ctx.arc(cx, cy - 20, 23, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(cx - 39, cy + 39)
    ctx.quadraticCurveTo(cx, cy - 2, cx + 39, cy + 39)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.font = `600 21px ${monoFont()}`
    ctx.textAlign = 'center'
    ctx.fillText('PHOTO', cx, cy + 100)
  } else {
    const label = 'NO PHOTO · ATS-SAFE'
    ctx.font = `700 24px ${monoFont()}`
    const badgeW = ctx.measureText(label).width + 40
    const bx = w - 70 - badgeW
    ctx.textAlign = 'left'
    ctx.strokeStyle = accent
    ctx.lineWidth = 3
    ctx.strokeRect(bx, h - 84, badgeW, 44)
    ctx.fillStyle = accent
    ctx.fillText(label, bx + 20, h - 54)
  }
}

function paintResumeBack(ctx, w, h, cv) {
  const accent = cv.accent
  ctx.fillStyle = accent
  ctx.fillRect(0, 0, w, h)

  // document watermark
  ctx.save()
  ctx.globalAlpha = 0.12
  ctx.fillStyle = '#FFFFFF'
  ctx.textAlign = 'center'
  ctx.font = `800 240px ${displayFont()}`
  ctx.fillText('CV', w / 2, h * 0.55)
  ctx.restore()

  ctx.strokeStyle = 'rgba(255,255,255,0.28)'
  ctx.lineWidth = 3
  ctx.strokeRect(56, 56, w - 112, h - 112)

  ctx.globalAlpha = 0.7
  ctx.fillStyle = '#FFFFFF'
  ctx.textAlign = 'center'
  ctx.font = `500 34px ${monoFont()}`
  ctx.fillText(cv.metaLabel || '', w / 2, h - 90)
  ctx.globalAlpha = 1
}

function paintResumeSpine(ctx, w, h, cv) {
  ctx.fillStyle = cv.accent
  ctx.fillRect(0, 0, w, h)

  ctx.fillStyle = 'rgba(255,255,255,0.14)'
  ctx.fillRect(0, 0, 14, h)
  ctx.fillRect(w - 14, 0, 14, h)

  // vertical label down the spine
  ctx.save()
  ctx.translate(w / 2, h / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.textAlign = 'center'
  ctx.fillStyle = '#FFFFFF'
  ctx.font = `700 62px ${displayFont()}`
  ctx.fillText(cv.title.toUpperCase(), 0, 22)
  ctx.restore()

  // thin accent rules at the ends
  ctx.fillStyle = 'rgba(255,255,255,0.35)'
  ctx.fillRect(0, 70, w, 4)
  ctx.fillRect(0, h - 74, w, 4)
}

// Content pulled from each PDF in /public/media/cv. The page renders the
// active document's sections below the shelf, so opening a CV in focus mode
// swaps every section - not just the detail panel - to match that PDF.
const CV_CONTENT = {
  'data-entry': {
    summaryTitle: 'Professional Summary',
    summary:
      'Detail-oriented and adaptable professional with hands-on experience organizing information, working with spreadsheets and databases, checking records for accuracy, and supporting digital business workflows. Intermediate Microsoft Excel skills, proficiency in Word, PowerPoint and Excel, and a typing speed of 30-40 WPM. Brings attention to detail, consistency, confidentiality, and a quick-learning mindset to administrative and data-handling tasks.',
    skillsTitle: 'Core Skills',
    skills: {
      'Data Entry & Record Management': [
        'Data entry and record updating',
        'Spreadsheet organization',
        'Customer, product, and inventory record maintenance',
        'Database record fundamentals',
      ],
      'Office & Administrative Support': [
        'Microsoft Excel (Intermediate)',
        'Word and PowerPoint',
        'Email support',
        'Online research and information collection',
        'General administrative assistance',
      ],
      'Database & Digital Tools': [
        'PostgreSQL fundamentals',
        'SQLite fundamentals',
        'Digital systems',
        'Structured records',
      ],
      'Professional Strengths': [
        'Attention to detail',
        'Confidentiality and responsible data handling',
        'Task ownership',
        'Quick learner',
        'Team collaboration',
      ],
    },
    experienceTitle: 'Relevant Experience',
    experience: [
      {
        title: 'Freelance Python Full Stack Developer',
        company: 'Self-employed - development work, not a formal data-entry position',
        period: '2025 - Present',
        highlights: [
          'Develop and deploy database-driven web applications and websites for UAE clients.',
          'Organize structured information and support reliable data storage and retrieval in digital workflows.',
          'Coordinate client requirements, review functionality, and take ownership of delivery and updates.',
        ],
      },
      {
        title: 'Excel Community Training',
        company: 'Resource Person - Grace Valley College',
        period: '26 September 2024',
        highlights: [
          'Led a three-day hands-on Excel training for middle-aged learners.',
          'Demonstrated formulas, charts, and practical productivity features through guided exercises.',
        ],
      },
    ],
    projectsTitle: 'Selected Projects',
    projects: [
      {
        title: 'CarCure - Vehicle Management Platform',
        meta: 'Python, Django, PostgreSQL',
        description:
          'Developed a vehicle information management platform using structured database records and data management workflows to organize and retrieve vehicle-related information accurately.',
        highlights: ['Organized vehicle records for accurate storage and quick information retrieval.'],
      },
      {
        title: 'AL Shamil Turning LLC - Business Website',
        meta: 'Django, HTML, CSS, JavaScript',
        description:
          'Developed and deployed a responsive business website for a UAE-based client, structuring content and navigation to present services and business information clearly.',
        highlights: ['Structured website content and navigation for clear, reliable presentation.'],
      },
    ],
    education: [
      {
        degree: 'Bachelor of Computer Applications (BCA)',
        institution: 'Grace Valley College of Arts and Science',
        period: '2022 - 2025',
      },
    ],
    languages: ['English', 'Malayalam', 'Tamil (conversational)', 'Hindi (conversational)'],
  },
  'it-support': {
    summaryTitle: 'Professional Summary',
    summary:
      'IT graduate with hands-on experience developing, deploying, and maintaining database-driven applications and business websites using Python, Django, REST APIs, SQL, HTML, CSS, and JavaScript. Demonstrates strong problem-solving and documentation skills, learns new systems quickly, and seeks an IT-focused role to apply this technical foundation while expanding experience in technical support, applications, and IT operations.',
    skillsTitle: 'Technical Skills',
    skills: {
      Programming: ['Python', 'JavaScript', 'HTML5', 'CSS3'],
      'Frameworks & Platforms': ['Django', 'Django REST Framework', 'React', 'Next.js', 'Streamlit'],
      'IT & Application': [
        'Application Troubleshooting',
        'User Authentication',
        'Authorization & Permissions',
        'CRUD Operations',
        'Database Management',
        'File Handling',
        'Deployment',
      ],
      'Databases & Tools': ['Git', 'GitHub', 'VS Code', 'PostgreSQL', 'SQLite'],
      Other: [
        'Problem Solving',
        'System Testing',
        'Responsive Web Interfaces',
        'Technical Documentation',
      ],
    },
    experienceTitle: 'Professional Experience',
    experience: [
      {
        title: 'Freelance IT / Web Developer',
        company: 'Self-employed - UAE-based clients',
        period: 'Aug 2025 - Present',
        highlights: [
          'Architected and deployed web applications and business websites for UAE-based clients using Django and modern web technologies.',
          'Delivered CarCure: built a Django platform for spare parts ordering, maintenance booking, SOS roadside assistance, and role-based user and staff workflows.',
          'Led AL Shamil Turning LLC: developed and deployed a responsive portfolio website for a marine machinery manufacturer, highlighting products, services, and company capabilities.',
        ],
      },
    ],
    projectsTitle: 'Projects',
    projects: [
      {
        title: 'CarCure - Automotive Service & Management Platform',
        meta: 'Python, Django, Django REST Framework, PostgreSQL, JavaScript, HTML, CSS',
        description:
          'Architected a Django-based service and product management system for garage operations, implementing spare parts ordering, maintenance booking, SOS request workflows, and role-based user and staff management.',
      },
      {
        title: 'AL Shamil Turning LLC - Business Website',
        meta: 'HTML, CSS, JavaScript, Django',
        description:
          'Developed and deployed a responsive corporate website with a structured, mobile-friendly interface, optimized navigation, and a clear user experience.',
      },
      {
        title: 'Tour Package Management System',
        meta: 'Python, Django, SQLite',
        description:
          'Built a package, booking, and user management system with an admin panel, authentication, and CRUD features.',
      },
      {
        title: 'IoT-Based Smart Thermostat',
        meta: 'Arduino, Python, Sensors',
        description:
          'Designed an Arduino and Python system that monitors ambient temperature and triggers email alerts, using real-time data and automation for live updates.',
      },
    ],
    education: [
      {
        degree: 'Bachelor of Computer Applications (BCA)',
        institution: 'Grace Valley College of Arts & Science, Malappuram, Kerala',
        period: 'Nov 2022 - Apr 2025',
      },
    ],
    certifications: [
      { name: 'Python Full-Stack Internship', issuer: 'Marklance Infotech', date: 'Jan 2025' },
      { name: 'Excel Community Training, Resource Person', issuer: 'Grace Valley College', date: 'Sep 2024' },
      { name: 'IoT Internship', issuer: 'Grapesgenix Technical Solutions Pvt. Ltd.', date: 'Feb 2025' },
    ],
    languages: ['English (Fluent)', 'Malayalam (Native)', 'Hindi (Intermediate)', 'Tamil (Intermediate)'],
  },
  'python-fullstack-photo': {
    summaryTitle: 'Profile',
    summary:
      'Python Full Stack Developer with hands-on experience building and deploying database-driven web applications using Django and modern web technologies. Developed business portfolio websites for UAE-based clients and a production-ready automotive service platform featuring spare parts ordering, maintenance booking, SOS roadside assistance, role-based authentication, and REST API functionality. Skilled in backend development, API integration, responsive web design, and production deployment. Looking to join a company and team where I can contribute to real-world projects, learn from experienced developers, and continue growing my technical skills.',
    skillsTitle: 'Technical Skills',
    skills: {
      Languages: ['Python', 'HTML', 'CSS', 'JavaScript'],
      Frameworks: ['Django', 'Django REST Framework', 'Streamlit', 'Next.js'],
      Databases: ['PostgreSQL', 'SQLite'],
      'Version Control': ['Git', 'GitHub'],
      'Deployment & Tools': ['Render', 'Supabase', 'Domain Management', 'Production Deployment'],
      'Soft Skills': ['Task Ownership', 'Quick Learner', 'Team Collaboration', 'Attention to Detail'],
    },
    experienceTitle: 'Professional Experience',
    experience: [
      {
        title: 'Freelance Python Full Stack Developer',
        company: 'Client Projects - UAE-based clients',
        period: '2025 - Present',
        highlights: [
          'Developed and deployed web applications and business websites for UAE-based clients using Django and modern web technologies.',
          'CarCure: built a Django platform for spare parts ordering, vehicle maintenance booking, SOS roadside assistance, and role-based user and staff workflows.',
          'Implemented authentication, REST APIs, database-driven workflows, and responsive user interfaces.',
          'AL Shamil Turning LLC: developed and deployed a responsive portfolio website for a marine machinery manufacturer using Django, HTML, CSS, and JavaScript.',
          'Configured domain, DNS, hosting, and production deployment for a successful public launch.',
        ],
      },
    ],
    projectsTitle: 'Projects',
    projects: [
      {
        title: 'CarCure - Automotive Service & Spare Parts Management Platform',
        meta: 'UAE client project | Django | Django REST Framework | PostgreSQL',
        description:
          'Developed and deployed a Django-based platform for spare parts ordering, vehicle maintenance booking, and SOS roadside assistance.',
        highlights: [
          'Designed separate user and staff workflows with role-based authentication and permissions.',
          'Managed production deployment, domain configuration, and ongoing application updates.',
        ],
      },
      {
        title: 'AL Shamil Turning LLC - Business Portfolio Website',
        meta: 'UAE client project | Django | JavaScript | HTML/CSS',
        description:
          'Developed and deployed a responsive corporate website for a UAE-based marine machinery manufacturer.',
        highlights: [
          'Designed structured product, service, and company sections with mobile-responsive navigation.',
          'Configured domain, DNS, hosting, and production deployment for the public launch.',
        ],
      },
      {
        title: 'Tour Package Management System',
        meta: 'Python, Django, SQLite',
        description:
          'Built a system to manage packages, bookings, and users, with an admin panel, authentication, and CRUD features.',
      },
      {
        title: 'IoT-Based Smart Thermostat',
        meta: 'Arduino, Python',
        description:
          'Engineered an Arduino and Python system that monitored ambient temperature and automatically emailed alerts, improving awareness of real-time room conditions.',
      },
    ],
    internshipsTitle: 'Internships & Additional Experience',
    internships: [
      {
        title: 'Python Full-Stack Internship',
        company: 'Marklance Infotech',
        period: 'Dec 2024 - Feb 2025 (3 months)',
        highlights: [
          'Built dynamic web apps using Django, HTML, CSS, and JavaScript.',
          'Applied SQLite, Git, and GitHub in real-world projects.',
        ],
      },
      {
        title: 'IoT Internship',
        company: 'Grapesgenix Technical Solutions Pvt. Ltd.',
        period: '3 months',
        highlights: [
          'Worked on IoT applications with real-time data and sensors.',
          'Used real-time sensor data and Python-based automation for live updates to users.',
        ],
      },
      {
        title: 'Excel Community Training, Resource Person',
        company: 'Grace Valley College',
        period: '26 Sep 2024',
        highlights: [
          'Led a three-day hands-on Excel training for middle-aged learners.',
          'Covered formulas, charts, and practical productivity features.',
        ],
      },
    ],
    education: [
      {
        degree: 'Bachelor of Computer Applications (BCA)',
        institution: 'Grace Valley College of Arts and Science',
        period: '2022 - 2025',
      },
    ],
    languages: ['English', 'Malayalam', 'Tamil (Conversational)', 'Hindi (Conversational)'],
  },
  'python-fullstack-ats': {
    summaryTitle: 'Professional Summary',
    summary:
      'Python Full Stack Developer with hands-on experience building and deploying database-driven web applications using Python and Django, REST APIs, SQL, HTML, CSS, and JavaScript. Experienced in business websites and automotive service platforms featuring user authentication, role-based workflows, API integration, database management, file handling, and responsive interfaces.',
    skillsTitle: 'Technical Skills',
    skills: {
      'Programming Languages': ['Python', 'JavaScript', 'HTML5', 'CSS3'],
      Frameworks: ['Django', 'Django REST Framework', 'React', 'Streamlit', 'Next.js'],
      Databases: ['PostgreSQL', 'SQLite'],
      Backend: ['CRUD Operations', 'REST APIs', 'Authentication & Authorization'],
      Tools: ['VS Code', 'Git', 'GitHub'],
    },
    experienceTitle: 'Professional Experience',
    experience: [
      {
        title: 'Freelance Web Developer',
        company: 'Self-employed - UAE-based clients',
        period: 'Aug 2025 - Present',
        highlights: [
          'Architected and deployed web applications and business websites for UAE-based clients using Django and modern web technologies.',
          'Delivered CarCure: built a Django platform for spare parts ordering, maintenance booking, SOS roadside assistance, and role-based user and staff workflows.',
          'Led AL Shamil Turning LLC: developed and deployed a responsive portfolio website for a marine machinery manufacturer, highlighting products, services, and company capabilities.',
        ],
      },
    ],
    projectsTitle: 'Projects',
    projects: [
      {
        title: 'CarCure - Automotive Service & Spare Parts Management Platform',
        meta: 'Django, Python, Next.js, REST Framework, CSS3, HTML5, JavaScript, PostgreSQL',
        description:
          'Architected a Django-based service and product management system for garage operations, implementing spare parts ordering, maintenance booking, SOS request workflows, and role-based user and staff management.',
      },
      {
        title: 'AL Shamil Turning LLC - Business Portfolio Website',
        meta: 'HTML, CSS, JavaScript, Django',
        description:
          'Developed and deployed a responsive corporate website with a structured, mobile-friendly interface, optimized navigation, and a clear user experience.',
      },
      {
        title: 'Tour Package Management System',
        meta: 'Python, Django, SQLite',
        description:
          'Built a package, booking, and user management system with an admin panel, authentication, and CRUD features.',
      },
      {
        title: 'IoT-Based Smart Thermostat',
        meta: 'Arduino, Python',
        description:
          'Designed an Arduino and Python system that monitors ambient temperature and triggers email alerts, using real-time data and automation for live updates.',
      },
    ],
    education: [
      {
        degree: 'Bachelor of Computer Applications (BCA)',
        institution: 'Grace Valley College of Arts & Science, Malappuram, Kerala',
        period: 'Nov 2022 - Apr 2025',
      },
    ],
    certifications: [
      { name: 'Python Full-Stack Internship', issuer: 'Marklance Infotech', date: 'Jan 2025' },
      { name: 'Excel Community Training, Resource Person', issuer: 'Grace Valley College', date: 'Sep 2024' },
      { name: 'IoT Internship', issuer: 'Grapesgenix Technical Solutions Pvt. Ltd.', date: 'Feb 2025' },
    ],
    languages: ['English (Fluent)', 'Hindi (B2)', 'Tamil (B2)', 'Malayalam (Native)'],
  },
}

const DEFAULT_CV_ID = 'python-fullstack-photo'

const [cvDocuments] = useState(() => [
    {
      id: 'it-support',
      content: CV_CONTENT['it-support'],
      title: 'IT Software Support Professional',
      author: 'CV',
      year: '2026',
      stars: 5,
      metaLabel: 'No photo, ATS-safe',
      badge: 'ATS-ready · text only',
      hasPhoto: false,
      sections: ['Professional Summary', 'Skills', 'Professional Experience', 'Projects', 'Education', 'Certifications', 'Languages'],
      desc: 'An ATS-ready CV for IT Software Support Professional roles, covering hardware and software troubleshooting, end-user support, Windows and network administration, ticketing, and technical documentation. The single-column, text-only layout is built to parse cleanly in applicant tracking systems.',
      backBg: '#12333a',
      backInk: '214,240,242',
      spineBg: '#0A3332',
      spineInk: '#B8F2FA',
      accent: '#0A3332',
      actions: [
        { label: 'Download PDF', href: '/media/cv/it-software-support.pdf', tone: 'accent', icon: 'download', variant: 'console' },
        { label: 'Open in tab', href: '/media/cv/it-software-support.pdf', tone: 'light', icon: 'globe', variant: 'console', download: false },
      ],
    },
    {
      id: 'python-fullstack-photo',
      content: CV_CONTENT['python-fullstack-photo'],
      title: 'Python Full Stack Developer',
      coverTitle: 'Full Stack',
      author: 'Developer CV',
      year: '2026',
      stars: 5,
      metaLabel: 'Includes a photo',
      badge: 'Recruiter version · with photo',
      hasPhoto: true,
      sections: ['Profile', 'Technical Skills', 'Professional Experience', 'Projects', 'Internships & Additional Experience', 'Education', 'Languages'],
      desc: 'A recruiter-facing CV presenting hands-on experience with Django and Django REST Framework backends, React frontends, PostgreSQL data modelling, and production deployments. Designed for human review, with a photograph and a clear, scannable layout.',
      backBg: '#1a3a52',
      backInk: '220,235,250',
      spineBg: '#0f2535',
      spineInk: '#e6f0fa',
      accent: '#1a3a52',
      actions: [
        { label: 'Download PDF', href: '/media/cv/python-fullstack-developer.pdf', tone: 'accent', icon: 'download', variant: 'console' },
        { label: 'Open in tab', href: '/media/cv/python-fullstack-developer.pdf', tone: 'light', icon: 'globe', variant: 'console', download: false },
      ],
    },
    {
      id: 'python-fullstack-ats',
      content: CV_CONTENT['python-fullstack-ats'],
      title: 'Python Full Stack Developer',
      author: 'ATS-friendly CV',
      year: '2026',
      stars: 5,
      metaLabel: 'No photo, ATS-safe',
      badge: 'ATS-friendly · single column',
      hasPhoto: false,
      sections: ['Professional Summary', 'Technical Skills', 'Professional Experience', 'Projects', 'Education', 'Certifications', 'Languages'],
      desc: 'The same full stack profile, rebuilt for applicant tracking systems: no photograph, columns, icons, or tables, just clean single-column text with standard headings such as Experience, Skills, and Education. Recommended for applications submitted through a portal or ATS filter.',
      backBg: '#0f2535',
      backInk: '220,235,250',
      spineBg: '#0f2535',
      spineInk: '#e6f0fa',
      accent: '#0f2535',
      actions: [
        { label: 'Download PDF', href: '/media/cv/python-fullstack-developer-ats.pdf', tone: 'accent', icon: 'download', variant: 'console' },
        { label: 'Open in tab', href: '/media/cv/python-fullstack-developer-ats.pdf', tone: 'light', icon: 'globe', variant: 'console', download: false },
      ],
    },
  {
      id: 'data-entry',
      content: CV_CONTENT['data-entry'],
      title: 'Data Entry Specialist',
      author: 'Operations CV',
      year: '2026',
      stars: 4,
      metaLabel: 'Includes a photo',
      badge: 'Recruiter version · with photo',
      hasPhoto: true,
      sections: ['Professional Summary', 'Core Skills', 'Relevant Experience', 'Selected Projects', 'Education', 'Languages'],
      desc: 'A recruiter-facing CV for data entry and administrative roles, highlighting accurate record keeping, clean data handling, spreadsheet proficiency, and consistent attention to detail. Presented with a photograph in a clear, scannable layout for direct human review.',
      backBg: '#1f3a2e',
      backInk: '226,242,232',
      spineBg: '#12251c',
      spineInk: '#c8f0d8',
      accent: '#1f3a2e',
      actions: [
        { label: 'Download PDF', href: '/media/cv/data-entry.pdf', tone: 'accent', icon: 'download', variant: 'console' },
        { label: 'Open in tab', href: '/media/cv/data-entry.pdf', tone: 'light', icon: 'globe', variant: 'console', download: false },
      ],
    },
  ].map((cv) => ({
    ...cv,
    // the 3D index page lists this document's real sections instead of the
    // default book chapters, so opening it matches the CV inside
    chapters: cv.sections,
    // résumé covers instead of the default book jackets
    front: (ctx, w, h) => paintResumeCover(ctx, w, h, cv),
    back: (ctx, w, h) => paintResumeBack(ctx, w, h, cv),
    spine: (ctx, w, h) => paintResumeSpine(ctx, w, h, cv),
  })))

  const activeCv =
    selectedCv ||
    cvDocuments.find((cv) => cv.id === DEFAULT_CV_ID) ||
    cvDocuments[0]
  const content = activeCv?.content

  return (
    <>
      <Helmet>
        <title>Resume · Experience & Skills of Mohammed Fawaz O | Python Full Stack Developer</title>
        <meta name="description" content="Resume of Mohammed Fawaz O, Python Full Stack Developer specializing in Django and React." />
      </Helmet>

      {/* beige / black / blue theme, shared with the contact page and the CV form */}
      <div className="page-tail-fade min-h-screen bg-[#F5F5DC] pb-[4.5rem] pt-[7.5rem] md:pb-[7rem] md:pt-[9rem]">
        {/* Container owns the site's even gutters (equal left and right). The
            important overrides counteract styles/utilities.css, which redefines
            .px-6 unlayered as 4rem and outranks Container's sm:/lg: variants,
            leaving only 247px of content on a 375px phone. */}
        <Container size="lg" className="px-4! sm:px-10! lg:px-14! 2xl:px-20!">
          {/* Hero : the CV shelf. Every version of my resume, pick one, read
              it, take the PDF. */}
          <section className="mb-10 md:mb-14">
            {/* Two sections: heading on the left, intro text on the right.
                Grid rather than flex because styles/utilities.css redefines
                .flex-col unlayered, which outranks md:flex-row and would keep
                this stacked even on desktop. */}
            <div className="mb-8 grid items-end gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-x-10">
              <div>
                <p className="mb-3 text-[10px] font-medium text-[#2d8cf0] uppercase tracking-[0.22em] font-[family-name:var(--font-mono)] sm:text-[11px] sm:tracking-[0.28em]">
                  Mohammed Fawaz O · Python Full Stack Developer
                </p>
                <h1 className="font-[family-name:var(--font-display)] text-[36px] sm:text-[46px] md:text-[62px] leading-[1.02] font-semibold text-black tracking-tight break-words">
                  Resumes &amp; CVs
                </h1>
              </div>
              <p className="max-w-xl text-[15px] text-[#666] font-light leading-relaxed sm:text-[16px] md:max-w-md">
                I keep several versions of my resume, each shaped for a different kind of team. Open any one
                to read what it covers, then take the PDF with you.
              </p>
            </div>
            <div className="ct-panel overflow-hidden">
              <BooksShowcase
                books={cvDocuments}
                heroTitle="My Resumes"
                navTitle="Choose a Version"
                showNav={true}
                showDetailPanel={true}
                showCarousel={true}
                onBookSelect={setSelectedCv}
                themeColors={{
                  navy: '#12333A',
                  pink: '#2d8cf0',
                  cream: '#F5F5DC',
                  lav: '#666666',
                  peri: '#2d8cf0',
                  bgLight: '#F5F5DC',
                  bgDark: '#000000',
                  foregroundLight: '#323232',
                  foregroundDark: '#F5F5DC',
                  // Opened CV: warm paper with dark teal ink and the blue accent
                  // from the rest of the page, instead of the old black focus.
                  focusBg: '#F1ECDC',
                  focusFg: '#1E3A40',
                  focusAccent: '#1A6AA8',
                }}
              />
            </div>
          </section>

          {content && (
            <div key={activeCv.id}>
              {/* Professional Summary */}
              <SectionHeading tone="beige" alignment="left" title={content.summaryTitle || 'Professional Summary'} className="mb-7! md:mb-10!" />
              <Card variant="teal" className="ct-card mb-10 p-5! sm:p-6! md:mb-14 md:p-7!">
                <p className="text-[#323232] text-[15px] leading-[1.75] md:text-[16px] md:leading-[1.8]">{content.summary}</p>
              </Card>

              {/* Experience */}
              {content.experience?.length > 0 && (
                <div className="mb-10 md:mb-14">
                  <SectionHeading tone="beige" alignment="left" title={content.experienceTitle || 'Experience'} className="mb-7! md:mb-10!" />
                  <StaggerChildren className="space-y-4 md:space-y-5">
                    {content.experience.map((exp, index) => (
                      <StaggerItem key={`${activeCv.id}-exp-${index}`}>
                        <Card variant="light" className="ct-panel p-0! overflow-hidden">
                          <div className="resume-split-grid grid md:grid-cols-[2fr_3fr]">
                            <div className="px-4! py-5! sm:px-5! md:px-7! md:py-6! max-md:text-center">
                              <h4 className="text-[16px] md:text-[20px] leading-snug break-words font-semibold text-black font-[family-name:var(--font-display)] max-md:whitespace-normal text-center">{exp.title}</h4>
                              <p className="mt-3 break-words text-[13px] md:text-[14px] font-medium text-[#666] max-md:text-[13px] max-md:text-center">{exp.company}</p>
                              <span className="mt-3 inline-block break-words text-[11px] md:text-[12px] text-[#666] uppercase tracking-[0.14em] font-[family-name:var(--font-mono)] max-md:text-[11px] max-md:text-center">{exp.period}</span>
                            </div>
                            <div className="border-t border-black/10 px-4! py-5! sm:px-5! md:border-t-0 md:px-7! md:py-6!">
                              {exp.description && (
                                <p className="mb-5 break-words text-[14px] md:text-[15px] leading-[1.7] text-[#323232] max-md:text-[14px] max-md:leading-[1.6]">{exp.description}</p>
                              )}
                              <ul className="space-y-2">
                                {exp.highlights.map((highlight, i) => (
                                  <li key={i} className="flex items-start gap-2 break-words text-[#323232] text-[14px]">
                                    <Monitor size={14} strokeWidth={2} className="mt-[3px] shrink-0 text-[#2d8cf0]" />
                                    {highlight}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </Card>
                      </StaggerItem>
                    ))}
                  </StaggerChildren>
                </div>
              )}

              {/* Projects */}
              {content.projects?.length > 0 && (
                <div className="mb-10 md:mb-14">
                  <SectionHeading tone="beige" alignment="left" title={content.projectsTitle || 'Projects'} className="mb-7! md:mb-10!" />
                  <StaggerChildren className="space-y-4 md:space-y-5">
                    {content.projects.map((project, index) => (
                      <StaggerItem key={`${activeCv.id}-project-${index}`}>
                        <Card variant="light" className="ct-panel p-0! overflow-hidden">
                          <div className="resume-split-grid grid md:grid-cols-[2fr_3fr]">
                            <div className="px-4! py-5! sm:px-5! md:px-7! md:py-6!">
                              <h4 className="text-[18px] md:text-[20px] leading-snug break-words font-semibold text-black font-[family-name:var(--font-display)]">{project.title}</h4>
                              {project.meta && (
                                <p className="text-[12px] text-[#2d8cf0] uppercase tracking-[0.14em] font-[family-name:var(--font-mono)] mt-3">{project.meta}</p>
                              )}
                            </div>
                            <div className="border-t border-black/10 px-4! py-5! sm:px-5! md:border-t-0 md:px-7! md:py-6!">
                              <p className="break-words text-[15px] leading-[1.7] text-[#323232]">{project.description}</p>
                              {project.highlights?.length > 0 && (
                                <ul className="space-y-2 mt-4">
                                  {project.highlights.map((highlight, i) => (
                                <li key={i} className="flex items-start gap-2 break-words text-[13px] md:text-[14px] text-[#323232] max-md:text-[13px]">
                                      <Monitor size={14} strokeWidth={2} className="mt-[3px] shrink-0 text-[#2d8cf0]" />
                                      {highlight}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        </Card>
                      </StaggerItem>
                    ))}
                  </StaggerChildren>
                </div>
              )}

              {/* Internships & Additional Experience */}
              {content.internships?.length > 0 && (
                <div className="mb-10 md:mb-14">
                  <SectionHeading tone="beige" alignment="left" title={content.internshipsTitle || 'Internships & Additional Experience'} className="mb-7! md:mb-10!" />
                  <StaggerChildren className="space-y-4 md:space-y-5">
                    {content.internships.map((role, index) => (
                      <StaggerItem key={`${activeCv.id}-internship-${index}`}>
                        <Card variant="light" className="ct-panel p-0! overflow-hidden">
                          <div className="resume-split-grid grid md:grid-cols-[2fr_3fr]">
                            <div className="px-4! py-5! sm:px-5! md:px-7! md:py-6!">
                              <h4 className="text-[18px] md:text-[20px] leading-snug break-words font-semibold text-black font-[family-name:var(--font-display)]">{role.title}</h4>
                              <p className="mt-3 break-words text-[14px] font-medium text-[#666]">{role.company}</p>
                              <span className="mt-3 inline-block break-words text-[12px] text-[#666] uppercase tracking-[0.14em] font-[family-name:var(--font-mono)]">{role.period}</span>
                            </div>
                            <div className="border-t border-black/10 px-4! py-5! sm:px-5! md:border-t-0 md:px-7! md:py-6!">
                              <ul className="space-y-2">
                                {role.highlights.map((highlight, i) => (
                                  <li key={i} className="flex items-start gap-2 break-words text-[#323232] text-[14px]">
                                    <Monitor size={14} strokeWidth={2} className="mt-[3px] shrink-0 text-[#2d8cf0]" />
                                    {highlight}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </Card>
                      </StaggerItem>
                    ))}
                  </StaggerChildren>
                </div>
              )}

              {/* Skills */}
              {content.skills && Object.keys(content.skills).length > 0 && (
                <div className="mb-10 md:mb-14">
                  <SectionHeading tone="beige" alignment="left" title={content.skillsTitle || 'Technical Skills'} className="mb-7! md:mb-10!" />
                  <Card variant="light" className="resume-split-grid ct-panel p-0! overflow-hidden">
                    <StaggerChildren>
                      {Object.entries(content.skills).map(([category, items]) => (
                        <StaggerItem key={`${activeCv.id}-skill-${category}`}>
                          <div className="grid md:grid-cols-[2fr_3fr]">
                            <div className="px-4! py-4! md:px-7! md:py-6!">
                              <h4 className="text-[11px] font-medium text-[#2d8cf0] uppercase tracking-[0.18em] font-[family-name:var(--font-mono)] md:pt-[5px]">{category}</h4>
                            </div>
                            <div className="px-4! py-4! md:px-7! md:py-6!">
                              <div className="flex flex-wrap gap-2">
                                {items.map((skill) => (
                                  <Badge key={skill} variant="secondary" className="ct-tag">{skill}</Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </StaggerItem>
                      ))}
                    </StaggerChildren>
                  </Card>
                </div>
              )}

              {/* Education */}
              {content.education?.length > 0 && (
                <div className="mb-10 md:mb-14">
                  <SectionHeading tone="beige" alignment="left" title="Education" className="mb-7! md:mb-10!" />
                  <StaggerChildren className="space-y-4 md:space-y-5">
                    {content.education.map((edu, index) => (
                      <StaggerItem key={`${activeCv.id}-edu-${index}`}>
                        <Card variant="light" className="ct-panel p-0! overflow-hidden">
                          <div className="resume-split-grid grid md:grid-cols-[2fr_3fr]">
                            <div className="px-4! py-5! sm:px-5! md:px-7! md:py-6!">
                              <h4 className="text-[18px] md:text-[20px] leading-snug break-words font-semibold text-black font-[family-name:var(--font-display)]">{edu.degree}</h4>
                              <span className="mt-3 inline-block break-words text-[12px] text-[#666] uppercase tracking-[0.14em] font-[family-name:var(--font-mono)]">{edu.period}</span>
                            </div>
                            <div className="border-t border-black/10 px-4! py-5! sm:px-5! md:border-t-0 md:px-7! md:py-6!">
                              <p className="break-words text-[14px] text-[#666]">{edu.institution}</p>
                            </div>
                          </div>
                        </Card>
                      </StaggerItem>
                    ))}
                  </StaggerChildren>
                </div>
              )}

              {/* Certifications */}
              {content.certifications?.length > 0 && (
                <div className="mb-10 md:mb-14">
                  <SectionHeading tone="beige" alignment="left" title="Certifications" className="mb-7! md:mb-10!" />
                  {/* Flex instead of a 2-column grid so an odd final card
                      (e.g. 3 certifications) sits centred on the bottom row,
                      forming an inverted triangle rather than hugging the
                      bottom-left corner. 4+ cards still flow two per row. */}
                  <StaggerChildren className="flex flex-wrap justify-center gap-4">
                    {content.certifications.map((cert, index) => (
                      <StaggerItem key={`${activeCv.id}-cert-${index}`} className="w-full sm:w-[calc(50%-0.5rem)]">
                        <Card variant="light" className="ct-panel h-full p-5! sm:p-6!">
                          <div className="mb-2! flex flex-wrap items-start justify-between gap-2">
                            <h4 className="text-[16px] font-semibold text-black font-[family-name:var(--font-display)]">{cert.name}</h4>
                            <span className="text-[12px] text-[#666] uppercase tracking-[0.14em] font-[family-name:var(--font-mono)]">{cert.date}</span>
                          </div>
                          <p className="break-words text-[14px] text-[#666]">{cert.issuer}</p>
                        </Card>
                      </StaggerItem>
                    ))}
                  </StaggerChildren>
                </div>
              )}

              {/* Languages */}
              {content.languages?.length > 0 && (
                <Card variant="light" className="ct-panel p-0! overflow-hidden">
                  <div className="resume-split-grid grid md:grid-cols-[2fr_3fr]">
                    <div className="px-4! py-5! md:px-7! md:py-6!">
                      <h3 className="text-[18px] md:text-[20px] leading-snug break-words font-semibold text-black font-[family-name:var(--font-display)]">Languages</h3>
                    </div>
                    <div className="border-t border-black/10 px-4! py-5! md:border-t-0 md:px-7! md:py-6!">
                      <div className="flex flex-wrap gap-2">
                        {content.languages.map((language) => (
                          <Badge key={language} variant="secondary" className="ct-tag">{language}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}
        </Container>
      </div>
    </>
  )
}

export default Resume
