import { Helmet } from 'react-helmet-async'
import SectionHeading from '../components/ui/SectionHeading'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Container from '../components/ui/Container'
import { StaggerChildren, StaggerItem } from '../components/animations/StaggerChildren'
import { BooksShowcase } from '../components/ui/books-showcase'

function Resume() {
  const experience = [
    {
      title: 'Full Stack Developer',
      company: 'UAE Startup',
      period: '2023 - Present',
      description: 'Developed production websites, built REST APIs, handled deployments, and worked directly with international clients.',
      highlights: [
        'Developed production websites for real clients',
        'Built and maintained REST APIs',
        'Deployed applications to production environments',
        'Debugged and fixed issues in live applications',
        'Gathered client requirements',
      ],
    },
  ]

  const education = [
    {
      degree: 'Bachelor of Computer Applications (BCA)',
      institution: 'University',
      period: '2018 - 2021',
    },
  ]

  const skills = {
    Backend: ['Python', 'Django', 'Django REST Framework', 'REST APIs'],
    Frontend: ['React', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap'],
    Databases: ['PostgreSQL', 'MySQL', 'SQLite', 'Supabase'],
    Tools: ['Git', 'GitHub', 'Postman', 'Vite'],
    Deployment: ['Render', 'Railway', 'Cloudflare', 'WhiteNoise'],
  }

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
  // reserves the right-hand column for its avatar - the photo-less CVs use the
  // full width and centre their title, with their badge down in the footer.
  // coverTitle lets a cover show a shorter line than the panel title (e.g.
  // "Python Full Stack") so the type stays big and the band never crowds.
  const reservedRight = cv.hasPhoto ? 260 : 0
  const textCentre = (w - reservedRight) / 2
  const textWidth = w - reservedRight - 120

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
    const cx = w - 140
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

const cvDocuments = [
    {
      id: 'it-support',
      title: 'IT Software Support Professional',
      author: 'CV',
      year: '2026',
      stars: 5,
      metaLabel: 'No photo, ATS-safe',
      badge: 'ATS-ready · text only',
      hasPhoto: false,
      sections: ['Summary', 'Experience', 'Technical Skills', 'Education', 'Certifications', 'Languages'],
      desc: 'My resume for IT Software Support Professional roles - hardware and software troubleshooting, user support, Windows and network administration, ticketing and the documentation side of it. Text only and laid out for applicant tracking systems, so it parses cleanly.',
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
      title: 'Python Full Stack Developer',
      coverTitle: 'Full Stack',
      author: 'Developer CV',
      year: '2026',
      stars: 5,
      metaLabel: 'Includes a photo',
      badge: 'Recruiter version · with photo',
      hasPhoto: true,
      sections: ['Profile', 'Experience', 'Selected Projects', 'Stack', 'Education', 'Languages'],
      desc: 'My full stack resume as a person reads it: Django and DRF backends, React frontends, PostgreSQL data models and the deployments behind them, laid out for a human with a photo on top. Send this when the CV reaches a recruiter directly - use the ATS version below when a portal filters it first.',
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
      title: 'Python Full Stack Developer',
      author: 'ATS-friendly CV',
      year: '2026',
      stars: 5,
      metaLabel: 'No photo, ATS-safe',
      badge: 'ATS-friendly · single column',
      hasPhoto: false,
      sections: ['Professional Summary', 'Professional Experience', 'Skills', 'Projects', 'Education', 'Additional Information'],
      desc: 'The same full stack role, rebuilt to survive applicant tracking systems: no photo, no columns, no icons or tables, plain single-column text with standard headings like Experience, Skills and Education. Use this whenever the CV goes through a portal or an ATS filter first.',
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
  ].map((cv) => ({
    ...cv,
    // the 3D index page lists this document's real sections instead of the
    // default book chapters, so opening it matches the CV inside
    chapters: cv.sections,
    // résumé covers instead of the default book jackets
    front: (ctx, w, h) => paintResumeCover(ctx, w, h, cv),
    back: (ctx, w, h) => paintResumeBack(ctx, w, h, cv),
    spine: (ctx, w, h) => paintResumeSpine(ctx, w, h, cv),
  }))

  return (
    <>
      <Helmet>
        <title>Resume · Experience & Skills of Mohammed Fawaz O | Python Full Stack Developer</title>
        <meta name="description" content="Resume of Mohammed Fawaz O, Python Full Stack Developer specializing in Django and React." />
      </Helmet>

      {/* beige / black / blue theme, shared with the contact page and the CV form */}
      <div className="min-h-screen bg-[#F5F5DC] py-[7rem] md:py-[9rem] pt-[7.5rem]">
        {/* Container owns the site's even gutters (equal left and right) */}
        <Container size="lg">
          {/* Hero : the CV shelf. Every version of my resume, pick one, read
              it, take the PDF. */}
          <section className="mb-20">
            <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4 mb-8">
              <div>
                <p className="text-[11px] font-medium text-[#2d8cf0] uppercase tracking-[0.28em] font-[family-name:var(--font-mono)] mb-4">
                  Mohammed Fawaz O · Python Full Stack Developer
                </p>
                <h1 className="font-[family-name:var(--font-display)] text-[40px] md:text-[62px] leading-[1.02] font-semibold text-black tracking-tight">
                  Resumes &amp; CVs
                </h1>
              </div>
              <p className="text-[16px] text-[#666] font-light leading-relaxed max-w-md">
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
                themeColors={{
                  navy: '#000000',
                  pink: '#2d8cf0',
                  cream: '#F5F5DC',
                  lav: '#666666',
                  peri: '#2d8cf0',
                  bgLight: '#F5F5DC',
                  bgDark: '#000000',
                  foregroundLight: '#323232',
                  foregroundDark: '#F5F5DC',
                }}
              />
            </div>
          </section>

          {/* Professional Summary */}
          <Card variant="teal" className="ct-card !p-7 mb-12">
            <h3 className="text-[11px] font-medium text-black uppercase tracking-[0.18em] font-[family-name:var(--font-mono)] mb-4">Professional Summary</h3>
            <p className="text-[#323232] text-[16px] leading-[1.8]">
              Python Full Stack Developer with experience building production-ready web applications using Django,
              Django REST Framework, React, and PostgreSQL. Proven ability to deliver complete solutions from
              concept to deployment. Strong backend development skills with focus on clean architecture, API design,
              and database management. Experience working with international clients and delivering projects on time.
            </p>
          </Card>

          {/* Experience */}
          <div className="mb-14">
            <SectionHeading tone="beige" alignment="left" eyebrow="Career" title="Experience" />
            <StaggerChildren className="space-y-5">
              {experience.map((exp, index) => (
                <StaggerItem key={index}>
                  <Card variant="light" className="ct-panel !p-7">
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                      <h4 className="text-[20px] font-semibold text-black font-[family-name:var(--font-display)]">{exp.title}</h4>
                      <span className="text-[12px] text-[#666] uppercase tracking-[0.14em] font-[family-name:var(--font-mono)]">{exp.period}</span>
                    </div>
                    <p className="text-[#666] mb-4 text-[14px] font-medium">{exp.company}</p>
                    <p className="text-[#323232] mb-5 text-[15px] leading-[1.7]">{exp.description}</p>
                    <ul className="space-y-2">
                      {exp.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-start gap-2 text-[#323232] text-[14px]">
                          <span className="text-[#2d8cf0] mt-0.5 font-semibold">&#10003;</span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>

          {/* Education */}
          <div className="mb-14">
            <SectionHeading tone="beige" alignment="left" eyebrow="Background" title="Education" />
            <StaggerChildren className="space-y-5">
              {education.map((edu, index) => (
                <StaggerItem key={index}>
                  <Card variant="light" className="ct-panel !p-7">
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                      <h4 className="text-[20px] font-semibold text-black font-[family-name:var(--font-display)]">{edu.degree}</h4>
                      <span className="text-[12px] text-[#666] uppercase tracking-[0.14em] font-[family-name:var(--font-mono)]">{edu.period}</span>
                    </div>
                    <p className="text-[#666] text-[14px]">{edu.institution}</p>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>

          {/* Skills */}
          <div>
            <SectionHeading tone="beige" alignment="left" eyebrow="Capabilities" title="Technical Skills" />
            <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(skills).map(([category, items]) => (
                <StaggerItem key={category}>
                  <Card variant="light" className="ct-panel !p-6 h-full">
                    <h4 className="text-[11px] font-medium text-[#2d8cf0] mb-4 uppercase tracking-[0.18em] font-[family-name:var(--font-mono)]">{category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {items.map((skill) => (
                        <Badge key={skill} variant="secondary" className="ct-tag">{skill}</Badge>
                      ))}
                    </div>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </Container>
      </div>
    </>
  )
}

export default Resume
