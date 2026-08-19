import { Helmet } from 'react-helmet-async'
import SectionHeading from '../components/ui/SectionHeading'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Container from '../components/ui/Container'
import { StaggerChildren, StaggerItem } from '../components/animations/StaggerChildren'

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
        </Container>
      </div>
    </>
  )
}

export default Resume
