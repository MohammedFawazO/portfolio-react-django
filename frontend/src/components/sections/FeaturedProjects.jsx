import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ExternalLink, Sparkles } from 'lucide-react'
import { GithubIcon } from '../ui/SocialIcons'
import Container from '../ui/Container'

const PROMINENT_PROJECT = {
  id: 'carcure',
  title: 'CarCure',
  eyebrow: 'Flagship Production Platform',
  badge: 'Featured Showcase',
  description:
    'An automotive marketplace and service platform engineered for UAE drivers and repair centers. Consolidates a genuine spare-parts catalogue, service enquiry workflows, and scheduled maintenance booking into one unified system. Built with Django and Django REST Framework backends, Supabase authentication and cloud storage, and distinct role-based dashboards for customers and operations staff.',
  tags: ['Python', 'Django', 'Django REST Framework', 'Supabase', 'PostgreSQL', 'Render', 'Cloudflare'],
  preview: '/media/carcure.png',
  live: 'https://carcure.ae/',
  github: '', // Private client repo - will not render button
}

const SUPPORTING_PROJECTS = [
  {
    id: 'al-shamil',
    title: 'Al Shamil Turning LLC',
    eyebrow: 'Corporate Engineering Web System',
    description:
      'A corporate portfolio website designed and deployed for a marine machinery engineering company based in Fujairah, UAE. Restructured heavy industrial capabilities into a clear, responsive service catalog with optimized page load speeds and accessible layouts across mobile and desktop.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive UI', 'UI/UX'],
    preview: '/media/website img-2.png',
    live: 'https://alshamilturning.com/',
    github: '', // Client repo
  },
  {
    id: 'tour-package',
    title: 'Tour Package Management System',
    eyebrow: 'Tourism Operations & Booking System',
    description:
      'A full reservation management system built on Django. Handles travel packages, date-specific customer availability, reservation checkout workflows, and staff administration for daily operation and booking oversight.',
    tags: ['Python', 'Django', 'SQLite', 'Authentication', 'HTML/CSS'],
    preview: '/media/code.png',
    live: '',
    github: 'https://github.com/mohammedfawaz-o/tour-package',
  },
  {
    id: 'portfolio-site',
    title: 'Developer Portfolio & Interactive Sandbox',
    eyebrow: 'Modern Web Architecture & 3D Interactive Canvas',
    description:
      'The custom portfolio you are currently browsing, built using React and modern component architecture. Features responsive Three.js 3D canvas viewports, Framer Motion transitions, custom theme modes (Blueprint, Matrix, and Test), and zero-latency client navigation.',
    tags: ['React', 'Tailwind CSS', 'Framer Motion', 'Three.js', 'Vite'],
    preview: '/media/design.png',
    live: '',
    github: 'https://github.com/mohammedfawaz-o/portfolio',
  },
]

const fadeUp = {
  hidden: { y: 30, opacity: 0 },
  visible: (delay = 0) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
  }),
}

function FeaturedProjects() {
  return (
    <section id="selected-work" className="relative pt-20 pb-20 md:pt-28 md:pb-28 bg-white overflow-hidden border-b-2 border-black">
      {/* Background ambient gradient */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '15%',
          right: '-5%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(45,140,240,0.08) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '10%',
          left: '-5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(173,216,230,0.14) 0%, transparent 70%)',
        }}
      />

      <Container size="lg">
        {/* Section Header */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mb-14"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-8">
              <h2 className="font-(family-name:--font-display) text-[32px] sm:text-[44px] lg:text-[52px] leading-[1.08] font-bold text-black tracking-tight">
                Selected work
              </h2>
            </div>
            <div className="lg:col-span-4">
              <p className="text-[15px] text-[#666] leading-relaxed">
                A selection of live commercial client platforms and software applications highlighting clean architecture, robust backends, and tactile interfaces.
              </p>
            </div>
          </div>
        </motion.div>

        {/* 1. Prominent Hero Showcase Project: CarCure */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="ct-panel bg-[#ADD8E6] rounded-[5px] border-2 border-black shadow-[6px_6px_0_#000] overflow-hidden mb-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Visual Preview */}
            <div className="lg:col-span-7 bg-[#E8EEF2] border-b-2 lg:border-b-0 lg:border-r-2 border-black relative p-6 sm:p-8 flex items-center justify-center overflow-hidden min-h-75 sm:min-h-100">
              <div
                className="absolute inset-0 opacity-[0.08] pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(#2d8cf0 1px, transparent 1px), linear-gradient(90deg, #2d8cf0 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />

              <div className="relative w-full max-w-140 rounded-[5px] border-2 border-black shadow-[4px_4px_0_#000] overflow-hidden bg-white">
                <div className="h-7 bg-[#F5F5DC] border-b-2 border-black flex items-center px-3 gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400 border border-black/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-black/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black/40" />
                  <div className="ml-3 font-mono text-[10px] text-[#555] truncate">
                    https://carcure.ae
                  </div>
                </div>
                <img
                  src={PROMINENT_PROJECT.preview}
                  alt={PROMINENT_PROJECT.title}
                  className="w-full h-auto object-cover max-h-85"
                />
              </div>

              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 bg-[#ADD8E6] border-2 border-black rounded-lg shadow-[2px_2px_0_#000] text-[11px] font-mono font-bold text-black uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                {PROMINENT_PROJECT.badge}
              </div>
            </div>

            {/* Content & Details */}
            <div className="lg:col-span-5 p-7 sm:p-10 flex flex-col justify-between">
              <div>
                <span className="inline-block text-[11px] font-mono text-[#2d8cf0] uppercase tracking-[0.2em] font-semibold mb-2">
                  {PROMINENT_PROJECT.eyebrow}
                </span>

                <h3 className="font-(family-name:--font-display) text-[28px] sm:text-[36px] font-bold text-black leading-tight mb-4">
                  {PROMINENT_PROJECT.title}
                </h3>

                <p className="text-[14px] sm:text-[15px] text-[#444] leading-[1.8] mb-6">
                  {PROMINENT_PROJECT.description}
                </p>

                <div className="mb-8">
                  <div className="text-[11px] font-mono text-[#777] uppercase tracking-wider mb-2.5 font-semibold">
                    Technologies
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {PROMINENT_PROJECT.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-white border-2 border-black text-[11px] font-mono font-medium text-black rounded-lg shadow-[2px_2px_0_#000]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons (Only shown if URL exists) */}
              <div className="flex flex-wrap gap-3 pt-2">
                {PROMINENT_PROJECT.live && (
                  <a
                    href={PROMINENT_PROJECT.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-[#ADD8E6] text-black font-semibold rounded-[5px] border-2 border-black shadow-[4px_4px_0_#000] hover:bg-[#2d8cf0] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all font-mono text-xs uppercase tracking-wider"
                  >
                    View Live Project
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {PROMINENT_PROJECT.github && (
                  <a
                    href={PROMINENT_PROJECT.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-white text-black font-semibold rounded-[5px] border-2 border-black shadow-[4px_4px_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all font-mono text-xs uppercase tracking-wider"
                  >
                    Source Code
                    <GithubIcon className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2. Supporting Projects with Alternating Layouts */}
        <div className="space-y-8">
          {SUPPORTING_PROJECTS.map((project, idx) => {
            const isFlipped = idx % 2 === 1
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="ct-panel bg-[#ADD8E6] rounded-[5px] border-2 border-black shadow-[4px_4px_0_#000] overflow-hidden"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-12 ${isFlipped ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                  {/* Image Preview */}
                  <div className={`lg:col-span-5 bg-[#E8EEF2] border-b-2 lg:border-b-0 ${isFlipped ? 'lg:border-l-2' : 'lg:border-r-2'} border-black p-6 flex items-center justify-center min-h-60 relative overflow-hidden`}>
                    <div className="w-full max-w-105 rounded-[5px] border-2 border-black shadow-[3px_3px_0_#000] overflow-hidden bg-white">
                      <img
                        src={project.preview}
                        alt={project.title}
                        className="w-full h-auto object-cover max-h-55"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-mono text-[#2d8cf0] uppercase tracking-[0.2em] font-semibold mb-2 block">
                        {project.eyebrow}
                      </span>

                      <h3 className="font-(family-name:--font-display) text-[22px] sm:text-[26px] font-bold text-black leading-tight mb-3">
                        {project.title}
                      </h3>

                      <p className="text-[14px] sm:text-[15px] text-[#555] leading-[1.75] mb-5">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 bg-white border-2 border-black text-[11px] font-mono font-medium text-black rounded-lg shadow-[2px_2px_0_#000]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action buttons (only when URL exists) */}
                    <div className="flex flex-wrap gap-3">
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#ADD8E6] text-black font-semibold rounded-[5px] border-2 border-black shadow-[3px_3px_0_#000] hover:bg-[#2d8cf0] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_#000] active:translate-x-0.75 active:translate-y-0.75 active:shadow-none transition-all font-mono text-xs uppercase tracking-wider"
                        >
                          View Live Project
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white text-black font-semibold rounded-[5px] border-2 border-black shadow-[3px_3px_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_#000] active:translate-x-0.75 active:translate-y-0.75 active:shadow-none transition-all font-mono text-xs uppercase tracking-wider"
                        >
                          Source Code
                          <GithubIcon className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Explore All Projects Button */}
        <motion.div
          custom={0.3}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-14 text-center"
        >
          <Link
            to="/projects"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#ADD8E6] text-black font-semibold rounded-[5px] border-2 border-black shadow-[4px_4px_0_#000] hover:bg-[#2d8cf0] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all font-mono text-xs uppercase tracking-wider"
          >
            Explore All Projects
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </Container>
    </section>
  )
}

export default FeaturedProjects

