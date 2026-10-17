import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import projectService from '../../services/projectService'
import Container from '../ui/Container'
import { StaggerChildren, StaggerItem } from '../animations/StaggerChildren'

const projectOverrides = {
  'CarCure': {
    description: 'An automotive marketplace and service platform for UAE users covering a genuine spare-parts catalogue, enquiry handling and maintenance booking. Separate customer and staff dashboards, Supabase-backed accounts and storage, and email notifications throughout.',
    tags: ['Python', 'Django', 'DRF', 'Supabase', 'PostgreSQL', 'Render'],
    github: 'https://github.com/mohammedfawaz-o/carcure',
    accent: '#2d8cf0',
  },
  'Tour Package Management System': {
    description: 'Django-based tour package management system with CRUD operations, authentication, booking workflow, and database management.',
    tags: ['Python', 'Django', 'SQLite', 'HTML'],
    github: 'https://github.com/mohammedfawaz-o/tour-package',
    accent: '#9FE9F5',
  },
  'Portfolio Website': {
    description: 'Modern React portfolio with GSAP animations, responsive design, and performance optimization. Built with Framer Motion and Tailwind CSS.',
    tags: ['React', 'Tailwind CSS', 'GSAP', 'Framer Motion'],
    github: 'https://github.com/mohammedfawaz-o/portfolio',
    accent: '#4FB8D6',
  },
}

const fadeUp = {
  hidden: { y: 40, opacity: 0 },
  visible: (delay) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
  }),
}

function FeaturedProjects() {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    projectService
      .getAll()
      .then((res) => {
        const featured = res.data.filter((p) => projectOverrides[p.title])
        setProjects(featured)
      })
      .catch((err) => console.error(err))
  }, [])

  if (projects.length === 0) return null

  return (
    <section className="relative py-[7rem] md:py-[9rem] bg-white overflow-hidden">
      <div
        className="absolute pointer-events-none"
        style={{
          top: '10%',
          right: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(35,105,102,0.18) 0%, transparent 70%)',
        }}
      />

      <Container size="lg">
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-[#2d8cf0]" />
            <span className="text-[11px] font-[family-name:var(--font-mono)] text-[#2d8cf0] uppercase tracking-[0.3em] font-medium">
              Featured Projects
            </span>
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-[40px] md:text-[56px] leading-[1.04] font-semibold text-black tracking-tight">
            Selected Work
          </h2>
        </motion.div>

        <StaggerChildren className="space-y-8">
          {projects.map((project, idx) => {
            const override = projectOverrides[project.title] || {}
            const flip = idx % 2 === 1
            return (
              <StaggerItem key={project.id}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="ct-panel group relative overflow-hidden transition-colors duration-500"
                >
                  <div className={`grid grid-cols-1 md:grid-cols-2 ${flip ? 'md:[&>*:first-child]:order-2' : ''}`}>
                    {/* Preview */}
                    <div className="relative h-64 md:h-full min-h-[280px] overflow-hidden bg-[#ADD8E6]/40">
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="absolute inset-0 opacity-[0.06]"
                          style={{
                            backgroundImage:
                              'linear-gradient(#ADD8E6 1px, transparent 1px), linear-gradient(90deg, #ADD8E6 1px, transparent 1px)',
                            backgroundSize: '40px 40px',
                          }}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#ADD8E6]/50 via-transparent to-transparent" />
                      <span
                        className="absolute top-5 left-5 inline-flex items-center justify-center w-11 h-11 rounded-full text-[13px] font-[family-name:var(--font-mono)] font-bold"
                        style={{ background: override.accent || '#2d8cf0', color: '#fff' }}
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-8 md:p-10 flex flex-col justify-center">
                      <span className="text-[11px] font-[family-name:var(--font-mono)] text-[#2d8cf0] uppercase tracking-[0.2em] mb-3">
                        Case Study
                      </span>
                      <h3 className="font-[family-name:var(--font-display)] text-[28px] md:text-[34px] text-black font-medium leading-tight mb-3">
                        {project.title}
                      </h3>
                      <p className="text-[15px] text-[#666] leading-[1.8] mb-6">
                        {override.description || project.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-8">
                        {(override.tags || (project.tags ? project.tags.split(',').map((t) => t.trim()) : [])).map((tag) => (
                          <span
                            key={tag}
                            className="ct-tag px-3 py-1.5 text-[11px] font-[family-name:var(--font-mono)] uppercase tracking-[0.06em]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4">
                        {override.github && (
                          <a
                            href={override.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/btn inline-flex items-center gap-2 text-[13px] font-medium text-[#2d8cf0]"
                          >
                            View Case Study
                            <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </a>
                        )}
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-[13px] font-medium text-[#666] hover:text-black transition-colors"
                          >
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>
            )
          })}
        </StaggerChildren>

        <div className="mt-12 text-center">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-[14px] font-medium text-[#666] hover:text-[#2d8cf0] transition-colors"
          >
            View all projects
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </Container>
    </section>
  )
}

export default FeaturedProjects
