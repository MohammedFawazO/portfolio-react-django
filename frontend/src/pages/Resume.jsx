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

  const books = [
    {
      id: 'crafting-interpreters',
      title: 'Crafting Interpreters',
      author: 'Robert Nystrom',
      year: '2021',
      stars: 5,
      desc: 'A hands-on guide to building your own programming language from scratch, walking through two complete interpreters from scanning tokens to garbage collection.',
      backBg: '#1a3a52',
      backInk: '220,235,250',
      spineBg: '#0f2535',
      spineInk: '#e6f0fa',
    },
    {
      id: 'clean-architecture',
      title: 'Clean Architecture',
      author: 'Robert C. Martin',
      year: '2017',
      stars: 4,
      desc: 'A practical guide to software structure and architecture. The book distills decades of experience into a set of universal rules for building systems that are easy to maintain and extend.',
      backBg: '#2b3a30',
      backInk: '230,240,220',
      spineBg: '#1c2a1f',
      spineInk: '#dbe7d2',
    },
    {
      id: 'refactoring',
      title: 'Refactoring',
      author: 'Martin Fowler',
      year: '2018',
      stars: 5,
      desc: 'The definitive guide to improving the design of existing code. Full of real-world examples showing how to safely refactor for clarity, performance, and flexibility without breaking behavior.',
      backBg: '#3a2a1c',
      backInk: '250,230,210',
      spineBg: '#2a1d12',
      spineInk: '#f4e7d2',
    },
    {
      id: 'domain-driven-design',
      title: 'Domain-Driven Design',
      author: 'Eric Evans',
      year: '2003',
      stars: 5,
      desc: 'The book that introduced DDD to the world. It teaches how to model complex business domains in code, align teams around a shared language, and build software that evolves with the business.',
      backBg: '#1f2a4a',
      backInk: '210,220,245',
      spineBg: '#131a30',
      spineInk: '#cbd5f0',
    },
    {
      id: 'designing-data-intensive',
      title: 'Designing Data-Intensive Applications',
      author: 'Martin Kleppmann',
      year: '2017',
      stars: 5,
      desc: 'A deep, friendly tour through the systems behind modern applications: databases, streams, replication, consistency, and the trade-offs that shape every backend decision.',
      backBg: '#3a1f2a',
      backInk: '250,220,225',
      spineBg: '#2a121c',
      spineInk: '#f4d8de',
    },
  ]

  return (
    <>
      <Helmet>
        <title>Resume · Experience & Skills of Mohammed Fawaz O | Python Full Stack Developer</title>
        <meta name="description" content="Resume of Mohammed Fawaz O, Python Full Stack Developer specializing in Django and React." />
      </Helmet>

      <div className="min-h-screen bg-[#F5F7F7] py-[8rem] md:py-[10rem] pt-[9rem]">
        <Container size="lg">
          <div className="mb-16">
            <h1 className="font-[family-name:var(--font-display)] text-[44px] md:text-[68px] leading-[1.02] font-semibold text-[#0A3332] tracking-tight">
              Mohammed Fawaz O
            </h1>
            <p className="text-[17px] text-[#405354] font-light mt-4 max-w-2xl leading-relaxed">
              Python Full Stack Developer with experience building production-ready web applications using
              Django, Django REST Framework, React, and PostgreSQL.
            </p>
          </div>

          {/* Professional Summary */}
          <Card variant="teal" className="!p-8 mb-12">
            <h3 className="text-[11px] font-medium text-[#6FE7FF] uppercase tracking-[0.18em] font-[family-name:var(--font-mono)] mb-4">Professional Summary</h3>
            <p className="text-[#F5F7F7] text-[16px] leading-[1.8]">
              Python Full Stack Developer with experience building production-ready web applications using Django,
              Django REST Framework, React, and PostgreSQL. Proven ability to deliver complete solutions from
              concept to deployment. Strong backend development skills with focus on clean architecture, API design,
              and database management. Experience working with international clients and delivering projects on time.
            </p>
          </Card>

          {/* Experience */}
          <div className="mb-14">
            <SectionHeading tone="light" alignment="left" eyebrow="Career" title="Experience" />
            <StaggerChildren className="space-y-5">
              {experience.map((exp, index) => (
                <StaggerItem key={index}>
                  <Card variant="light" className="!p-7">
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                      <h4 className="text-[20px] font-medium text-[#0A3332] font-[family-name:var(--font-display)]">{exp.title}</h4>
                      <span className="text-[12px] text-[#236966] uppercase tracking-[0.14em] font-[family-name:var(--font-mono)]">{exp.period}</span>
                    </div>
                    <p className="text-[#405354] mb-4 text-[14px] font-medium">{exp.company}</p>
                    <p className="text-[#405354] mb-5 text-[15px] leading-[1.7]">{exp.description}</p>
                    <ul className="space-y-2">
                      {exp.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-start gap-2 text-[#405354] text-[14px]">
                          <span className="text-[#236966] mt-0.5">&#10003;</span>
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
            <SectionHeading tone="light" alignment="left" eyebrow="Background" title="Education" />
            <StaggerChildren className="space-y-5">
              {education.map((edu, index) => (
                <StaggerItem key={index}>
                  <Card variant="light" className="!p-7">
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                      <h4 className="text-[20px] font-medium text-[#0A3332] font-[family-name:var(--font-display)]">{edu.degree}</h4>
                      <span className="text-[12px] text-[#236966] uppercase tracking-[0.14em] font-[family-name:var(--font-mono)]">{edu.period}</span>
                    </div>
                    <p className="text-[#405354] text-[14px]">{edu.institution}</p>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>

          {/* Skills */}
          <div>
            <SectionHeading tone="light" alignment="left" eyebrow="Capabilities" title="Technical Skills" />
            <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(skills).map(([category, items]) => (
                <StaggerItem key={category}>
                  <Card variant="light" className="!p-6 h-full">
                    <h4 className="text-[11px] font-medium text-[#236966] mb-4 uppercase tracking-[0.18em] font-[family-name:var(--font-mono)]">{category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {items.map((skill) => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>

          {/* Reading Shelf */}
          <div className="mt-20">
            <SectionHeading
              tone="light"
              alignment="left"
              eyebrow="Reading Shelf"
              title="Books That Shaped How I Build"
              subtitle="A few of the books I keep coming back to — they shape how I design APIs, structure code, and think about systems."
            />
            <div className="rounded-2xl overflow-hidden border border-[#0A3332]/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.35)]">
              <BooksShowcase
                books={books}
                heroTitle="Reading"
                navTitle="Currently Reading"
                showNav={true}
                showDetailPanel={true}
                showCarousel={true}
                themeColors={{
                  navy: '#0A3332',
                  pink: '#236966',
                  cream: '#F5F7F7',
                  lav: '#405354',
                  peri: '#6FE7FF',
                  bgLight: '#F5F7F7',
                  bgDark: '#0A3332',
                  foregroundLight: '#0A3332',
                  foregroundDark: '#F5F7F7',
                }}
              />
            </div>
          </div>
        </Container>
      </div>
    </>
  )
}

export default Resume
