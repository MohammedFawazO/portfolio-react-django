import { useState, useEffect, useMemo, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import projectService from '../services/projectService'
import SectionHeading from '../components/ui/SectionHeading'
import Container from '../components/ui/Container'
import Tag from '../components/ui/Tag'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import { KineticTextReveal } from '../components/ui/KineticTextReveal'
import { useHeroScroll } from '../context/HeroScrollContext'

const projectDetails = {
  'CarCure': {
    description: 'Production-level roadside assistance and vehicle spare parts platform designed for UAE users. Features include SOS emergency requests, maintenance booking, user/staff dashboards, and Supabase integration.',
    tags: ['Python', 'Django', 'DRF', 'Bootstrap', 'Supabase', 'PostgreSQL', 'Render', 'Cloudflare'],
    highlights: ['Authentication system', 'File uploads', 'Email notifications', 'REST APIs', 'Responsive design'],
  },
  'Sandra International Website': {
    description: 'Business portfolio website developed for a UAE startup. Clean design, fast performance, and mobile-first responsive layout.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
    highlights: ['Professional design', 'SEO optimized', 'Fast loading', 'Mobile-first'],
  },
  'Al Shamil Turning LLC': {
    description: 'Corporate portfolio website for an engineering company in Fujairah, UAE. Professional design with improved UI and responsive layout.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
    highlights: ['Corporate design', 'UI improvements', 'Fast deployment', 'Business-focused'],
  },
  'Dubai Travel AI Assistant': {
    description: 'AI-powered travel assistant for exploring Dubai. Built with Python and Streamlit, it helps travelers plan their trips using AI.',
    tags: ['Python', 'Streamlit', 'AI'],
    highlights: ['AI recommendations', 'Interactive interface', 'Travel planning'],
  },
  'Tour Package Management System': {
    description: 'Django-based tour package management system with CRUD operations, authentication, booking workflow, and database management.',
    tags: ['Python', 'Django', 'SQLite', 'HTML'],
    highlights: ['CRUD operations', 'Authentication', 'Booking workflow', 'Admin panel'],
  },
}

function CountUp({ target, active, suffix = '', delay = 0 }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!active) return
    const timeout = setTimeout(() => {
      const duration = 1200
      const startTime = performance.now()
      const animate = (now) => {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setCount(Math.round(eased * target))
        if (progress < 1) requestAnimationFrame(animate)
      }
      requestAnimationFrame(animate)
    }, delay * 1000)
    return () => clearTimeout(timeout)
  }, [active, target, delay])

  return (
    <span className="text-[22px] font-light text-[#6FE7FF] font-(family-name:--font-display) leading-none">
      {String(count).padStart(2, '0')}{suffix}
    </span>
  )
}

function Projects() {
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [search, setSearch] = useState('')
  const statsRef = useRef(null)
  const titleTextRef = useRef(null)
  const [countStarted, setCountStarted] = useState(false)
  const [vh, setVh] = useState(typeof window !== 'undefined' ? window.innerHeight : 0)

  useEffect(() => {
    const onResize = () => setVh(window.innerHeight)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const heroRef = useRef(null)
  const rawProgress = useMotionValue(0)
  const progress = useSpring(rawProgress, { stiffness: 80, damping: 30, mass: 0.6 })
  const heroProgress = useHeroScroll()

  useEffect(() => {
    heroProgress.set(0)
    const unsub = progress.on('change', (v) => heroProgress.set(v))
    return () => {
      unsub()
      heroProgress.set(0)
    }
  }, [progress, heroProgress])

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return

    const updateProgress = () => {
      const rect = hero.getBoundingClientRect()
      const scrollDistance = hero.offsetHeight - window.innerHeight
      if (scrollDistance <= 0) return
      const p = Math.min(1, Math.max(0, -rect.top / scrollDistance))
      rawProgress.set(p)
    }

    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)
    updateProgress()

    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [rawProgress])

   // ─────────────────────────────────────────────
   // HANDS
   // ─────────────────────────────────────────────

    const robotX = useTransform(progress, [0.5, 0.85], ['0vw', '13vw'])
    const humanX = useTransform(progress, [0.5, 0.85], ['0vw', '-13vw'])
    const robotScaleVal = useTransform(progress, [0.5, 0.85], [1, 1.35])
    const humanScaleVal = useTransform(progress, [0.5, 0.85], [1, 1.35])
    const robotRotate = useTransform(progress, [0, 0.72, 0.85], [-1, 0, 0])
    const humanRotate = useTransform(progress, [0, 0.72, 0.85], [1, 0, 0])

    // ─────────────────────────────────────────────
    // CAMERA
    // ─────────────────────────────────────────────

    const cameraScale = useTransform(progress, [0, 0.72, 0.85], [1, 1.08, 1.08])

    // ─────────────────────────────────────────────
    // CONNECTION GLOW
    // ─────────────────────────────────────────────

    const connectionGlow = useTransform(progress, [0.5, 0.65, 0.75, 0.85], [0, 1, 1, 1])
    const glowScale = useTransform(progress, [0.5, 0.65, 0.75, 0.85], [0.3, 1, 1.2, 1.2])

    // ─────────────────────────────────────────────
    // TEXT FADE (after connection)
    // ─────────────────────────────────────────────

    // HERO CONTENT : visible on load, fades out as the scroll animation plays
    const textFadeOut = useTransform(progress, [0.55, 0.85], [1, 0])
    const textSlideUp = useTransform(progress, [0.55, 0.85], [0, -24])
    const textCombinedFade = textFadeOut

    // POST-HERO PAGE : cover triggers ONLY after the hand/star/text animations finish
    // (progress ~0.85), then slides UP by a full viewport to cover the pinned hero
    const gridSlide = useTransform(progress, [0.85, 1], [0, -vh])
    // Gentle grey overlay over the hero images as the panel begins covering it
    const heroGreyOverlay = useTransform(progress, [0.85, 1], [0, 0.45])
    // HERO : stays pinned and static while the next panel slides over and covers it

  const filteredProjects = projects.filter(project => {
    if (!search) return true
    const q = search.toLowerCase()
    const details = projectDetails[project.title] || {}
    const allTags = details.tags || (project.tags ? project.tags.split(',').map(t => t.trim()) : [])
    return (
      project.title.toLowerCase().includes(q) ||
      (details.description || project.description || '').toLowerCase().includes(q) ||
      allTags.some(t => t.toLowerCase().includes(q))
    )
  })

  const stats = useMemo(() => {
    const techSet = new Set()
    Object.values(projectDetails).forEach(d => {
      (d.tags || []).forEach(t => techSet.add(t))
    })
    return [
      { label: 'Total Projects', value: 4, suffix: '' },
      { label: 'Tech Stack', value: 16, suffix: '+' },
      { label: 'Commercial Builds', value: 2, suffix: '' },
      { label: 'Year Freelance', value: 1, suffix: '+' },
    ]
  }, [projects])

  useEffect(() => {
    const timer = setTimeout(() => setCountStarted(true), 2700)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    projectService.getAll()
      .then(res => setProjects(res.data))
      .catch(err => console.error(err))
  }, [])

  return (
    <>
      <Helmet>
        <title>Projects · Web Apps by Mohammed Fawaz O | Python Full Stack Developer</title>
        <meta name="description" content="View projects built by Mohammed Fawaz O : from roadside assistance platforms to business portfolio websites." />
      </Helmet>

      {/* Hero Section : pinned during scroll animation */}
      <div ref={heroRef} className="h-[1400vh]">
      <motion.section className="sticky top-0 h-screen min-h-175 bg-[#050505] overflow-hidden">
      {/* Background : static, subtle central glow (behind text) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-[#D8B878]/5 blur-[150px]" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#050505]" />
      </div>

      {/* Virtual camera : hands + connection star, zoomed on scroll (above text) */}
      <motion.div style={{ scale: cameraScale, transformOrigin: 'center 45%' }} className="absolute inset-0 z-20 pointer-events-none">
           {/* Hands layer */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Robot */}
            <div className="hand-robot absolute -left-16 top-[65%] -translate-y-1/2 pointer-events-none">
              <motion.img
                src="/media/robot.png"
                alt=""
                style={{ scale: robotScaleVal, rotate: robotRotate, x: robotX }}
                className="w-55 md:w-77.5 lg:w-100 will-change-transform"
              />
            </div>
            {/* Human */}
            <div className="hand-human absolute -right-16 top-[65%] -translate-y-1/2 pointer-events-none">
              <motion.img
                src="/media/human.png"
                alt=""
                style={{ scale: humanScaleVal, rotate: humanRotate, x: humanX }}
                className="w-55 md:w-77.5 lg:w-100 will-change-transform"
              />
            </div>
          </div>

          {/* Connection glow : symmetric star with rays and streaks */}
          <motion.div
            style={{ opacity: connectionGlow, scale: glowScale }}
            className="absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          >
            {/* Outer haze : pulsing */}
            <div className="absolute w-32 h-32 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.6, 0.5] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-full h-full rounded-full bg-[#D8B878]/50 blur-lg"
              />
            </div>
            {/* Warm inner glow : pulsing */}
            <div className="absolute w-20 h-20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <motion.div
                animate={{ scale: [1, 1.07, 1] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-full h-full rounded-full bg-[#D8B878]/80 blur-md"
              />
            </div>

            {/* Rotating rays group : slow spin with breathing ray length */}
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.08, 0.95, 1.05, 1] }}
              transition={{
                rotate: { duration: 120, ease: 'linear', repeat: Infinity },
                scale: { duration: 6, ease: 'easeInOut', repeat: Infinity },
              }}
              className="absolute inset-0"
            >
              {/* Primary cross : horizontal + vertical, longest & brightest */}
              <div className="absolute w-72 h-px bg-linear-to-r from-transparent via-[#D8B878] to-transparent left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 blur-[0.5px]" />
              <div className="absolute w-px h-72 bg-linear-to-b from-transparent via-[#D8B878] to-transparent left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 blur-[0.5px]" />

              {/* Diagonal pair : 45° / 135°, medium length */}
              <div className="absolute w-56 h-px bg-linear-to-r from-transparent via-[#D8B878]/70 to-transparent left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 blur-[0.5px]" />
              <div className="absolute w-56 h-px bg-linear-to-r from-transparent via-[#D8B878]/70 to-transparent left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-135 blur-[0.5px]" />

              {/* Accent sparkle rays : 4 short rays offset 22.5°, white-hot tips */}
              <div className="absolute w-28 h-px bg-linear-to-r from-transparent via-white/60 to-transparent left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[22.5deg] blur-[0.5px]" />
              <div className="absolute w-28 h-px bg-linear-to-r from-transparent via-white/60 to-transparent left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-22.5deg] blur-[0.5px]" />
              <div className="absolute w-28 h-px bg-linear-to-r from-transparent via-white/60 to-transparent left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[67.5deg] blur-[0.5px]" />
              <div className="absolute w-28 h-px bg-linear-to-r from-transparent via-white/60 to-transparent left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-67.5deg] blur-[0.5px]" />
            </motion.div>

            {/* Core : always on top, covers all line intersections, pulsing */}
            <div className="absolute w-12 h-12 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <motion.div
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="w-full h-full rounded-full bg-[#D8B878] blur-xs"
              />
            </div>
            <div className="absolute w-6 h-6 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.85, 1, 0.85] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-full h-full rounded-full bg-white blur-[2px]"
              />
            </div>
        </motion.div>

        {/* Thin grey overlay over the hero images as the panel covers them */}
        <motion.div
          style={{ opacity: heroGreyOverlay }}
          className="absolute inset-0 z-30 pointer-events-none bg-[rgba(140,140,140,0.45)]"
        />
      </motion.div>

        {/* Central content : scroll-controlled fade/slide */}
        <motion.div
          style={{ opacity: textCombinedFade, y: textSlideUp }}
          className="absolute top-32 left-0 right-0 bottom-0 z-10 text-center px-6 flex flex-col items-center"
        >
           {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-[13px] text-[#6FE7FF] font-mono uppercase tracking-[0.3em] mb-1"
          >
            Code With a Purpose
          </motion.p>

          {/* Title + brackets : with scroll transforms */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.0, ease: [0.16, 1, 0.3, 1] }}
            className="relative inline-block mb-6 px-3 py-7"
          >
            <motion.svg
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 2.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 240 80"
              fill="none"
              preserveAspectRatio="none"
            >
              <motion.path
                d="M1 20 L1 4 Q1 1 4 1 L24 1"
                stroke="#6FE7FF"
                strokeWidth="1"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 0.6, delay: 2.2, ease: [0.16, 1, 0.3, 1] }}
                filter="drop-shadow(0 0 4px rgba(111,231,255,0.3))"
              />
              <motion.path
                d="M239 20 L239 4 Q239 1 236 1 L216 1"
                stroke="#6FE7FF"
                strokeWidth="1"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 0.6, delay: 2.3, ease: [0.16, 1, 0.3, 1] }}
                filter="drop-shadow(0 0 4px rgba(111,231,255,0.3))"
              />
              <motion.path
                d="M1 60 L1 76 Q1 79 4 79 L24 79"
                stroke="#6FE7FF"
                strokeWidth="1"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 0.6, delay: 2.4, ease: [0.16, 1, 0.3, 1] }}
                filter="drop-shadow(0 0 4px rgba(111,231,255,0.3))"
              />
              <motion.path
                d="M239 60 L239 76 Q239 79 236 79 L216 79"
                stroke="#6FE7FF"
                strokeWidth="1"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 0.6, delay: 2.5, ease: [0.16, 1, 0.3, 1] }}
                filter="drop-shadow(0 0 4px rgba(111,231,255,0.3))"
              />
            </motion.svg>

            <KineticTextReveal
              ref={titleTextRef}
              text="Projects"
              splitBy="characters"
              direction="up"
              distance={20}
              stagger={0.03}
              blur={false}
              autoPlay={true}
              delay={2.0}
              className="font-(family-name:--font-display) text-[52px] md:text-[70px] lg:text-[90px] leading-[0.95] font-light text-[#F3F0EA] justify-center uppercase"
            />
          </motion.div>

          {/* Subtitle : with scroll transforms */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: -26 }}
            transition={{ duration: 0.6, delay: 2.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-[18px] md:text-[22px] text-[rgba(255,255,255,.55)] font-light max-w-lg mx-auto leading-[1.6]"
          >
            Real applications built for real problems.
          </motion.p>
        </motion.div>

        {/* Bottom section: stats + scroll indicator : fades with the text on scroll */}
        <motion.div style={{ opacity: textCombinedFade }} className="absolute bottom-28 left-0 right-0 z-10 flex flex-col items-center px-6">
          {/* Stats Glass Rail : with scroll transforms */}
            <motion.div
              ref={statsRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.7, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-lg mx-auto mb-3"
            >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 2.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ padding: '28px 24px' }}
              className="bg-linear-to-b from-[rgba(255,255,255,.07)] to-[rgba(255,255,255,.02)] backdrop-blur-[32px] border border-[rgba(255,255,255,.15)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,.08)]"
            >
              <div className="grid grid-cols-4">
                 {stats.map((stat, i) => (
                   <div key={stat.label} className="flex flex-col items-center justify-start gap-2 px-2 py-1">
                     <div className="h-7 flex items-center justify-center">
                       <CountUp target={stat.value} active={countStarted} suffix={stat.suffix} delay={i * 0.15} />
                     </div>
                     <span className="text-[10px] text-[rgba(255,255,255,.55)] font-mono uppercase tracking-[0.15em] leading-tight text-center min-h-[26px]">
                       {stat.label}
                     </span>
                   </div>
                 ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Scroll to explore */}
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 0.8, delay: 2.9 }}
             className="flex flex-col items-center gap-1.5"
           >
            <span className="text-[11px] text-[rgba(255,255,255,.55)] font-mono uppercase tracking-[0.2em]">
              Scroll
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-5.5 h-8.5 rounded-full border border-[rgba(255,255,255,.25)] flex justify-center"
            >
              <motion.div
                animate={{ y: [2, 10, 2], opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-0.75 h-1.5 bg-[#D8B878] rounded-full mt-1.25"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>
      </div>

      {/* Projects Content : slides up from bottom over the hero (redesigned) */}
      <motion.div id="projects-grid" style={{ y: gridSlide }} className="relative z-30 min-h-screen bg-white pt-20 pb-32 overflow-hidden rounded-t-[40px]">
        <Container>
          <div className="relative z-10">
            <SectionHeading
              tone="light"
              eyebrow="All Projects"
              title="Case Studies"
              subtitle="A selection of applications I've designed, built, and shipped."
              alignment="left"
            />

            <div className="max-w-md mb-14">
              <Input
                placeholder="Search projects or technologies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="!bg-white !border !border-[#D2DCDF] !text-[#0A3332] placeholder:!text-[#718082]"
              />
            </div>

            <div className="space-y-8">
              {filteredProjects.map((project, index) => {
                const details = projectDetails[project.title] || {}
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className="group relative bg-[#12171C] border border-[#29323A] rounded-3xl overflow-hidden hover:border-[#6FE7FF]/30 transition-colors duration-400"
                  >
                    <div className="p-8 md:p-12">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                        <div className="flex items-baseline gap-4">
                          <span className="font-(family-name:--font-display) text-[20px] text-[#6FE7FF] font-medium leading-none">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <h3 className="text-[24px] md:text-[30px] font-medium text-[#F5F7F7] leading-tight font-(family-name:--font-display)">
                            {project.title}
                          </h3>
                        </div>
                        {project.featured && <Tag variant="teal" size="sm">Featured</Tag>}
                      </div>

                      <p className="text-[#AEB9BD] mb-8 text-[16px] leading-[1.8] max-w-3xl">
                        {details.description || project.description}
                      </p>

                      <div className="grid md:grid-cols-2 gap-8">
                        {details.highlights && (
                          <div>
                            <h4 className="text-[11px] font-medium text-[#6FE7FF] uppercase tracking-[0.18em] font-(family-name:--font-mono) mb-3">
                              Key Features
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {details.highlights.map((highlight, i) => (
                                <Tag key={i} size="sm">{highlight}</Tag>
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <h4 className="text-[11px] font-medium text-[#6FE7FF] uppercase tracking-[0.18em] font-(family-name:--font-mono) mb-3">
                            Technologies
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {(details.tags || (project.tags ? project.tags.split(',').map(t => t.trim()) : [])).map((tag, i) => (
                              <Tag key={i} variant="primary" size="sm">{tag}</Tag>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 mt-9 pt-7 border-t border-[#29323A]">
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-3 bg-[#0A3332] text-[#F5F7F7] text-[13px] font-medium rounded-[10px] hover:bg-[#164C4A] transition-all duration-200"
                          >
                            Live Demo
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </a>
                        )}
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-3 border border-[#29323A] text-[#F5F7F7] text-[13px] font-medium rounded-[10px] hover:bg-[#202830] hover:border-[#6FE7FF]/40 hover:text-[#6FE7FF] transition-all duration-200"
                          >
                            Source Code
                          </a>
                        )}
                        <button
                          onClick={() => setSelectedProject({ ...project, details })}
                          className="inline-flex items-center gap-2 px-5 py-3 text-[#AEB9BD] text-[13px] font-medium rounded-[10px] hover:text-[#6FE7FF] transition-colors"
                        >
                          Details
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </Container>

        <Modal
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          title={selectedProject?.title}
          size="lg"
        >
          {selectedProject && (
            <div>
              <p className="text-[#AEB9BD] mb-4">{selectedProject.details?.description || selectedProject.description}</p>
              {selectedProject.details?.tags && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedProject.details.tags.map((tag, i) => (
                    <Tag key={i} variant="primary" size="sm">{tag}</Tag>
                  ))}
                </div>
              )}
              {selectedProject.details?.highlights && (
                <div>
                  <h4 className="text-[12px] font-medium text-[#6FE7FF] uppercase tracking-[0.18em] font-(family-name:--font-mono) mb-2">Key Features</h4>
                  <ul className="space-y-1">
                    {selectedProject.details.highlights.map((h, i) => (
                      <li key={i} className="text-[#AEB9BD] text-[14px]">- {h}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </Modal>
      </motion.div>
    </>
  )
}

export default Projects
