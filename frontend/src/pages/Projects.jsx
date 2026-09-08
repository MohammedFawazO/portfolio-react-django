import { useState, useEffect, useMemo, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import SectionHeading from '../components/ui/SectionHeading'
import Container from '../components/ui/Container'
import { KineticTextReveal } from '../components/ui/KineticTextReveal'
import { technologies } from '../components/ui/TechMarquee'
import { useHeroScroll } from '../context/HeroScrollContext'

// Lookup so the selected-project marquee can reuse the same icons as the
// hero TechMarquee (matched by name). Alias "html"/"css" to the hero's
// "HTML5"/"CSS3" logos.
const TECH_MAP = (() => {
  const map = Object.fromEntries(
    technologies.map((t) => [t.name.toLowerCase(), t])
  )
  map['html'] = map['html5']
  map['css'] = map['css3']
  return map
})()

const ResponsiveDesignIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    height="24"
    width="24"
  >
    <desc>Responsive Design 1 Streamline Icon: https://streamlinehq.com</desc>
    <path fill="#66e1ff" d="M5.78223 14.3914V5.30449c0 -0.79236 0.64234 -1.43471 1.43471 -1.43471H21.5648c0.7923 0 1.4347 0.64235 1.4347 1.43471v9.08691H5.78223Z" strokeWidth="1" />
    <path fill="#c2f3ff" d="M19.6517 3.86978H7.21694c-0.79237 0 -1.43471 0.64235 -1.43471 1.43471v9.08691h3.34779L19.6517 3.86978Z" strokeWidth="1" />
    <path fill="#ffffff" d="M5.78223 14.3915H22.9995v2.3912c0 0.7925 -0.6424 1.4348 -1.4347 1.4348H7.21694c-0.79237 0 -1.43471 -0.6423 -1.43471 -1.4348v-2.3912Z" strokeWidth="1" />
    <path fill="#ffffff" d="M10.5647 6.73929H4.82568c-0.52834 -0.0001 -0.95654 0.4282 -0.95654 0.95654V15.348c0 0.5282 0.4282 0.9565 0.95654 0.9564h5.73902c0.5284 0 0.9566 -0.4282 0.9566 -0.9564V7.69583c0 -0.52834 -0.4282 -0.95654 -0.9566 -0.95654Z" strokeWidth="1" />
    <path fill="#66e1ff" d="M11.5213 8.65228H3.86914v5.73912h7.65216V8.65228Z" strokeWidth="1" />
    <path fill="#c2f3ff" d="M10.5647 8.65228H3.86914v5.73912h0.95654l5.73902 -5.73912Z" strokeWidth="1" />
    <path fill="#ffffff" d="M5.78261 11.5219H1.95654C1.4282 11.5218 1 11.9501 1 12.4784v6.6956c0 0.5283 0.4282 0.9565 0.95654 0.9565h3.82607c0.52824 0 0.95654 -0.4282 0.95654 -0.9565v-6.6956c0 -0.5283 -0.4283 -0.9565 -0.95654 -0.9565Z" strokeWidth="1" />
    <path fill="#66e1ff" d="M6.73905 13.4349H1v4.7826h5.73905v-4.7826Z" strokeWidth="1" />
    <path fill="#c2f3ff" d="M1 13.4349v4.7826h0.47827l4.78261 -4.7826H1Z" strokeWidth="1" />
    <path stroke="#000000" strokeLinecap="round" strokeLinejoin="round" d="M5.85791 4.82623c0.1957 -0.58135 0.74591 -0.96855 1.35917 -0.95645H21.5649c0.8153 0.02392 1.4573 0.70355 1.4347 1.51895V16.6986c0.0226 0.8153 -0.6194 1.4949 -1.4347 1.5189H8.65189" strokeWidth="1" />
    <path stroke="#000000" strokeLinecap="round" strokeLinejoin="round" d="M10.0864 20.1305h8.6086" strokeWidth="1" />
    <path stroke="#000000" strokeLinecap="round" strokeLinejoin="round" d="M14.3906 18.2175v1.913" strokeWidth="1" />
    <path stroke="#000000" strokeLinecap="round" strokeLinejoin="round" d="M13.4341 14.3915h9.5651" strokeWidth="1" />
    <path stroke="#000000" strokeLinecap="round" strokeLinejoin="round" d="M3.86914 9.60881V7.69583c0 -0.52834 0.4283 -0.95654 0.95654 -0.95654h5.73902c0.5284 0 0.9566 0.4282 0.9566 0.95654V15.348c0 0.5282 -0.4282 0.9564 -0.9566 0.9564H8.65175" strokeWidth="1" />
    <path stroke="#000000" strokeLinecap="round" strokeLinejoin="round" d="M8.65234 14.3915h2.86956" strokeWidth="1" />
    <path stroke="#000000" strokeLinecap="round" strokeLinejoin="round" d="M5.78261 11.5219H1.95654C1.4282 11.5218 1 11.9501 1 12.4784v6.6956c0 0.5283 0.4282 0.9565 0.95654 0.9565h3.82607c0.52824 0 0.95654 -0.4282 0.95654 -0.9565v-6.6956c0 -0.5283 -0.4283 -0.9565 -0.95654 -0.9565Z" strokeWidth="1" />
    <path stroke="#000000" strokeLinecap="round" strokeLinejoin="round" d="M1 18.2175h5.73905" strokeWidth="1" />
    <path stroke="#000000" strokeLinecap="round" strokeLinejoin="round" d="M1 13.4349h5.73905" strokeWidth="1" />
    <path stroke="#000000" strokeLinecap="round" strokeLinejoin="round" d="M3.86816 8.65326h7.65214" strokeWidth="1" />
  </svg>
)

const spotlightVariants = {
  hidden: { opacity: 0, scaleY: 0.04, scaleX: 0.25, x: '-50%' },
  visible: {
    opacity: 0.82,
    scaleY: 1,
    scaleX: 1,
    x: '-50%',
    transition: { duration: 0.9, delay: 0.25, ease: 'easeOut' },
  },
}

const lightSourceVariants = {
  hidden: { opacity: 0, scale: 0.12, x: '-50%', y: '-50%' },
  visible: {
    opacity: 1,
    scale: 1,
    x: '-50%',
    y: '-50%',
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

/* Directional slide for the milestone images only.
   Podium base (podium.png) and shadow (::after) stay fixed. */
const SWITCH_EASE = [0.22, 1, 0.36, 1]
const SWITCH_DURATION = 0.6

const slideVariants = {
  enter: (dirRef) => {
    const dir = dirRef && typeof dirRef === 'object' ? dirRef.current : dirRef
    return { x: dir > 0 ? '-16%' : '16%', opacity: 0 }
  },
  center: { x: '0%', opacity: 1 },
  exit: (dirRef) => {
    const dir = dirRef && typeof dirRef === 'object' ? dirRef.current : dirRef
    return { x: dir > 0 ? '16%' : '-16%', opacity: 0 }
  },
}

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

const MILESTONES = [
  {
    id: 'jar',
    title: 'Coming Soon!',
    badge: '',
    milestone: '/media/jar-coming soon.png',
    tilt: false,
    front: null,
    caption: true,
  },
  {
    id: 'carcure',
    title: 'CarCure',
    eyebrow: 'E-commerce',
    badge: 'Featured',
    milestone: '/media/website img.png',
    tilt: true,
    front: '/media/carcure.png',
    caption: true,
  },
  {
    id: 'carcure2',
    title: 'AL Shamil Turning',
    eyebrow: 'Portfolio',
    badge: '',
    milestone: '/media/website img-2.png',
    tilt: true,
    front: '/media/hull machine.png',
    caption: true,
  },
  {
    id: 'sandra',
    title: 'Sandra International',
    eyebrow: 'Portfolio',
    badge: '',
    milestone: null,
    tilt: false,
    front: null,
    caption: true,
  },
]

// Rich info shown in the right-side console when a milestone is selected.
const PROJECT_INFO = {
  jar: {
    num: '01',
    name: 'Coming Soon',
    category: 'In Development',
    description:
      'A brand-new platform is currently in the workshop. This slot will showcase the next build the moment it goes live.',
    highlights: ['Concept & planning', 'Architecture design', 'UI prototyping', 'Stack selection'],
    stack: ['React', 'Node', 'PostgreSQL'],
    live: '#',
    repo: '#',
  },
  carcure: {
    num: '02',
    name: 'CarCure',
    category: 'E-commerce · SaaS',
    description:
      'Production-grade roadside assistance and spare-parts platform for UAE drivers. Handles SOS requests, service booking, and staff dashboards end to end.',
    highlights: projectDetails['CarCure'].highlights,
    stack: projectDetails['CarCure'].tags,
    live: '#',
    repo: '#',
  },
  carcure2: {
    num: '03',
    name: 'AL Shamil Turning',
    category: 'Corporate Portfolio',
    description:
      'Corporate portfolio site for a Fujairah engineering firm, rebuilt with a cleaner UI, faster loads, and a fully responsive layout.',
    highlights: projectDetails['Al Shamil Turning LLC'].highlights,
    stack: projectDetails['Al Shamil Turning LLC'].tags,
    live: '#',
    repo: '#',
  },
  sandra: {
    num: '04',
    name: 'Sandra International',
    category: 'Business Portfolio',
    description:
      'Business portfolio website for a UAE startup, built mobile-first with strong SEO and fast page performance.',
    highlights: projectDetails['Sandra International Website'].highlights,
    stack: projectDetails['Sandra International Website'].tags,
    live: '#',
    repo: '#',
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
  const statsRef = useRef(null)
  const titleTextRef = useRef(null)
  const [countStarted, setCountStarted] = useState(false)
  const [vh, setVh] = useState(typeof window !== 'undefined' ? window.innerHeight : 0)
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )

  // Carousel: index of the project currently shown in the center podium
  const [order, setOrder] = useState(1)
  // Direction of the last navigation: 1 = forward (next), -1 = backward (prev)
  // Live ref so enter/exit always read the CURRENT direction (never a frozen value)
  const directionRef = useRef(0)
  // Lock to prevent overlapping clicks from desyncing the slide direction
  const [animating, setAnimating] = useState(false)
  // Selected milestone (click to focus, others fade out); null = default view
  const [selectedId, setSelectedId] = useState(null)
  // True while a side milestone is navigating to center before selection,
  // so we can suppress hover effects during the move
  const [navigating, setNavigating] = useState(false)

  useEffect(() => {
    const onResize = () => {
      setVh(window.innerHeight)
      setIsMobile(window.innerWidth < 768)
    }
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
    return () => { unsub(); heroProgress.set(0) }
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

  const robotX = useTransform(progress, [0.5, 0.85], ['0vw', '13vw'])
  const humanX = useTransform(progress, [0.5, 0.85], ['0vw', '-13vw'])
  const robotScaleVal = useTransform(progress, [0.5, 0.85], [1, 1.35])
  const humanScaleVal = useTransform(progress, [0.5, 0.85], [1, 1.35])
  const robotRotate = useTransform(progress, [0, 0.72, 0.85], [-1, 0, 0])
  const humanRotate = useTransform(progress, [0, 0.72, 0.85], [1, 0, 0])
  const cameraScale = useTransform(progress, [0, 0.72, 0.85], [1, 1.08, 1.08])
  const connectionGlow = useTransform(progress, [0.5, 0.65, 0.75, 0.85], [0, 1, 1, 1])
  const glowScale = useTransform(progress, [0.5, 0.65, 0.75, 0.85], [0.3, 1, 1.2, 1.2])

  /* Mobile-only hand motion: before converging, the left hand pushes further
     left and the right hand further right (so they clear the heading), then
     they only start moving toward each other once clear of the heading. */
  const robotXMobile = useTransform(progress, [0, 0.45, 0.6, 0.85], ['0vw', '-16vw', '-16vw', '-1vw'])
  const humanXMobile = useTransform(progress, [0, 0.45, 0.6, 0.85], ['0vw', '16vw', '16vw', '1vw'])
  const connectionGlowMobile = useTransform(progress, [0.6, 0.7, 0.8, 0.85], [0, 1, 1, 1])
  const glowScaleMobile = useTransform(progress, [0.6, 0.7, 0.8, 0.85], [0.3, 1, 1.2, 1.2])
  const textFadeOut = useTransform(progress, [0.55, 0.85], [1, 0])
  const textSlideUp = useTransform(progress, [0.55, 0.85], [0, -24])
  const textCombinedFade = textFadeOut
  const gridSlide = useTransform(progress, [0.85, 1], [0, -vh])
  const heroGreyOverlay = useTransform(progress, [0.85, 1], [0, 0.45])

  const stats = useMemo(() => {
    return [
      { label: 'Total Projects', value: 4, suffix: '' },
      { label: 'Tech Stack', value: 16, suffix: '+' },
      { label: 'Commercial Builds', value: 2, suffix: '' },
      { label: 'Year Freelance', value: 1, suffix: '+' },
    ]
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setCountStarted(true), 2700);
    return () => clearTimeout(timer);
  }, [])

  // While a milestone is focused, lift the projects section above the fixed
  // "Let's Connect" chrome and disable that link so it can't intercept clicks
  // meant for the close (X) button.
  useEffect(() => {
    const root = document.documentElement
    if (selectedId) root.classList.add('project-detail-open')
    else root.classList.remove('project-detail-open')
    return () => root.classList.remove('project-detail-open')
  }, [selectedId])

  const slotFor = (p) => MILESTONES[(p + 1 - order + MILESTONES.length) % MILESTONES.length]
  const slots = [slotFor(0), slotFor(1), slotFor(2)]

  // Rich console data for the currently selected milestone
  const info = selectedId ? PROJECT_INFO[selectedId] : null

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
       <motion.div style={{ scale: cameraScale, transformOrigin: 'center 45%' }} className="absolute inset-0 z-20 max-md:z-0 pointer-events-none">
           {/* Hands layer */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Robot */}
            <div className="hand-robot absolute -left-16 top-[65%] max-md:top-[35%] -translate-y-1/2 pointer-events-none">
              <motion.img
                src="/media/robot.png"
                alt=""
                 style={{ scale: robotScaleVal, rotate: robotRotate, x: isMobile ? robotXMobile : robotX }}
                className="w-55 md:w-77.5 lg:w-100 will-change-transform"
              />
            </div>
            {/* Human */}
            <div className="hand-human absolute -right-16 top-[65%] max-md:top-[35%] -translate-y-1/2 pointer-events-none">
              <motion.img
                src="/media/human.png"
                alt=""
                 style={{ scale: humanScaleVal, rotate: humanRotate, x: isMobile ? humanXMobile : humanX }}
                className="w-55 md:w-77.5 lg:w-100 will-change-transform"
              />
            </div>
          </div>

          {/* Connection glow : symmetric star with rays and streaks */}
          <motion.div
             style={{ opacity: isMobile ? connectionGlowMobile : connectionGlow, scale: isMobile ? glowScaleMobile : glowScale }}
            className="absolute left-1/2 top-[35%] max-md:top-[21%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
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

              {/* Diagonal pair : 45 / 135, medium length */}
              <div className="absolute w-56 h-px bg-linear-to-r from-transparent via-[#D8B878]/70 to-transparent left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 blur-[0.5px]" />
              <div className="absolute w-56 h-px bg-linear-to-r from-transparent via-[#D8B878]/70 to-transparent left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-135 blur-[0.5px]" />

              {/* Accent sparkle rays : 4 short rays offset 22.5, white-hot tips */}
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
              className="font-(family-name:--font-display) text-[35px] md:text-[70px] lg:text-[90px] leading-[0.95] font-light text-[#F3F0EA] justify-center uppercase"
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
              <div className="grid grid-cols-2 md:grid-cols-4">
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
      <motion.div id="projects-grid" style={{ y: gridSlide }} className="relative z-30 min-h-screen bg-[linear-gradient(180deg,#1c1f24_0%,#101216_35%,#070809_100%)] pt-10 pb-32 overflow-hidden rounded-t-[40px]">

        {/* Default-state chevrons: functional carousel controls */}
        {!selectedId && (
          <>
            <button
              type="button"
              aria-label="Previous project"
              className="podium-chevron podium-chevron--btn podium-chevron--left"
              disabled={animating}
              onClick={() => {
                if (animating) return
                directionRef.current = 1
                setOrder((o) => (o + 1) % MILESTONES.length)
                setAnimating(true)
                setTimeout(() => setAnimating(false), 600)
              }}
            >
              <svg viewBox="0 0 24 24">
                <polyline points="15 5 8 12 15 19" />
              </svg>
            </button>

            <button
              type="button"
              aria-label="Next project"
              className="podium-chevron podium-chevron--btn podium-chevron--right"
              disabled={animating}
              onClick={() => {
                if (animating) return
                directionRef.current = -1
                setOrder((o) => (o + MILESTONES.length - 1) % MILESTONES.length)
                setAnimating(true)
                setTimeout(() => setAnimating(false), 600)
              }}
            >
              <svg viewBox="0 0 24 24">
                <polyline points="9 5 16 12 9 19" />
              </svg>
            </button>
          </>
        )}

        {/* Selected-state chevrons: switch directly between milestones
            (recenter the new milestone + keep detail open, no return to default) */}
        {selectedId && (
          <>
            <button
              type="button"
              aria-label="Previous milestone"
              className="podium-chevron podium-chevron--btn podium-chevron--selected podium-chevron--left"
              disabled={animating}
              onClick={() => {
                if (animating) return
                const prevId = slots[0].id
                directionRef.current = 1
                setOrder((o) => (o + 1) % MILESTONES.length)
                setSelectedId(prevId)
                setAnimating(true)
                setNavigating(true)
                setTimeout(() => setAnimating(false), 600)
                setTimeout(() => setNavigating(false), 600)
              }}
            >
              <svg viewBox="0 0 24 24">
                <polyline points="15 5 8 12 15 19" />
              </svg>
            </button>

            <button
              type="button"
              aria-label="Next milestone"
              className="podium-chevron podium-chevron--btn podium-chevron--selected podium-chevron--right"
              disabled={animating}
              onClick={() => {
                if (animating) return
                const nextId = slots[2].id
                directionRef.current = -1
                setOrder((o) => (o + MILESTONES.length - 1) % MILESTONES.length)
                setSelectedId(nextId)
                setAnimating(true)
                setNavigating(true)
                setTimeout(() => setAnimating(false), 600)
                setTimeout(() => setNavigating(false), 600)
              }}
            >
              <svg viewBox="0 0 24 24">
                <polyline points="9 5 16 12 9 19" />
              </svg>
            </button>
          </>
        )}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-72 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.10),transparent_70%)]" />
        <Container>
          <div className="relative z-10">
            <SectionHeading
              tone="dark"
              title="Milestones"
              subtitle="A selection of applications I've designed, built, and shipped."
              alignment="center"
              subtitleClassName="mt-2"
            />

            <motion.div
              className={`podium-stage${navigating ? ' pod-no-hover' : ''}`}
              style={{ marginTop: '-48px' }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.35 }}
            >

              {slots.map((p, i) => {
                const slotName = ['left', 'center', 'right'][i]
                return (
                  <div
                    key={slotName}
                    onClick={() => {
                      if (selectedId || animating) return
                      const idx = MILESTONES.findIndex((m) => m.id === p.id)
                      // Slot of the clicked milestone: 0=left, 1=center, 2=right
                      const slot =
                        (((idx + order - 1) % MILESTONES.length) + MILESTONES.length) %
                        MILESTONES.length
                      if (slot === 1) {
                        // Already centered — select and slide immediately
                        setSelectedId(p.id)
                        return
                      }
                      // Bring it to center with one chevron, then select/slide.
                      // Left slot -> right chevron (next); right slot -> left chevron (prev)
                      const dir = slot === 0 ? 1 : -1
                      directionRef.current = dir
                      setOrder(
                        (o) =>
                          (o + (dir === 1 ? 1 : MILESTONES.length - 1)) %
                          MILESTONES.length
                      )
                      setAnimating(true)
                      setNavigating(true)
                      setTimeout(() => setAnimating(false), 600)
                      setTimeout(() => {
                        setSelectedId(p.id)
                        // keep hover suppressed until the slide-to-left finishes
                        setTimeout(() => setNavigating(false), 600)
                      }, 620)
                    }}
                    className={`podium-item podium-${slotName}${
                      selectedId && selectedId !== p.id ? ' is-dimmed' : ''
                    }${selectedId === p.id ? ' is-selected' : ''}`}
                  >
                    <motion.div className="podium-spotlight" variants={spotlightVariants} />
                    <motion.div className="podium-light-source" variants={lightSourceVariants} />
                    <div className="podium-floor-glow" />
                    <div className="podium-top-light" />

                    <img
                      src="/media/podium.png"
                      alt="Project podium"
                      className="podium-image"
                    />

                    {/* Animated milestone image stack — slides, podium/shadow stay put */}
                    <AnimatePresence initial={false} custom={directionRef}>
                      <motion.div
                        key={p.id}
                        className="podium-image-stack"
                        custom={directionRef}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: SWITCH_DURATION, ease: SWITCH_EASE }}
                      >
                        {p.milestone ? (
                          <img
                            src={p.milestone}
                            alt={`${p.title} milestone`}
                            className={`podium-object-back ${p.tilt ? '' : 'is-flat'}`}
                          />
                        ) : (
                          <div
                            className={`podium-object-back podium-placeholder ${p.tilt ? '' : 'is-flat'}`}
                          >
                            <span className="podium-placeholder-eyebrow">{p.eyebrow}</span>
                            <span className="podium-placeholder-title">{p.title}</span>
                          </div>
                        )}

                        {p.front && (
                          <img
                            src={p.front}
                            alt={p.title}
                            className={`podium-object${p.id === 'carcure2' ? ' podium-object--raised' : ''}`}
                          />
                        )}

                        {p.caption && (
                          <div className="podium-caption">
                            {p.eyebrow && (
                              <span className="podium-caption-eyebrow">{p.eyebrow}</span>
                            )}
                            <div className="podium-caption-row">
                              <span className="podium-caption-title">{p.title}</span>
                              {p.badge && <span className="podium-caption-badge">{p.badge}</span>}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                )
              })}

              </motion.div>

              {/* Tech-stack marquee beneath the selected milestone — matches the
                  hero TechMarquee styling, constrained to the left half (left → center).
                  Wrapped in a fixed-height slot so the crossfade never reflows the section. */}
              <div className="marquee-slot">
              <AnimatePresence>
                {selectedId && info && (
                  <motion.div
                    key={`marquee-${selectedId}`}
                    className="project-tech-marquee"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: SWITCH_DURATION, ease: SWITCH_EASE }}
                  >
                    <div className="relative overflow-hidden py-4">
                      <div
                        className="flex w-max animate-marquee gap-12 whitespace-nowrap"
                        style={{
                          maskImage: 'linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)',
                          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)',
                        }}
                      >
                        {[...info.stack, ...info.stack].map((tech, i) => {
                          const match = TECH_MAP[tech.toLowerCase()]
                          return (
                            <div key={i} className="flex items-center gap-1.5">
                              {tech.toLowerCase() === 'responsive design' ? (
                            <span className="opacity-60">{ResponsiveDesignIcon}</span>
                          ) : match ? (
                                match.svg ? (
                                  <span className="opacity-60">{match.svg}</span>
                                ) : (
                                  <img
                                    src={match.image}
                                    alt={match.name}
                                    className="h-5 w-auto opacity-60"
                                    style={
                                      match.name === 'GitHub' || match.name === 'Django'
                                        ? { filter: 'invert(1)' }
                                        : undefined
                                    }
                                  />
                                )
                              ) : null}
                              <span className="text-[#59636E] text-sm font-medium tracking-wide">
                                {tech}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              </div>

              <AnimatePresence>
                {selectedId && (
                  <motion.button
                    type="button"
                    aria-label="Close milestone detail"
                    onClick={() => setSelectedId(null)}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="podium-close-btn"
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <line x1="5" y1="5" x2="19" y2="19" />
                      <line x1="19" y1="5" x2="5" y2="19" />
                    </svg>
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Right-side information console for the selected milestone */}
              <AnimatePresence>
                {selectedId && info && (
                  <motion.div
                    key={selectedId}
                    className="podium-console"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: SWITCH_DURATION, ease: SWITCH_EASE }}
                  >
                    <div className="console-inner">
                      <div className="console-head">
                        <span className="console-num">{info.num}</span>
                        <div className="console-head-text">
                          <span className="console-category">{info.category}</span>
                          <h3 className="console-name">{info.name}</h3>
                        </div>
                      </div>

                      <p className="console-desc">{info.description}</p>

                      <ul className="console-highlights">
                        {info.highlights.map((h) => (
                          <li key={h}>{h}</li>
                        ))}
                      </ul>

                      <div className="console-actions">
                        <a className="console-btn console-btn--primary" href={info.live} target="_blank" rel="noreferrer">
                          Live Site
                          <svg viewBox="0 0 24 24" width="14" height="14"><path d="M7 17L17 7M17 7H8M17 7V16" /></svg>
                        </a>
                        <a className="console-btn" href={info.repo} target="_blank" rel="noreferrer">
                          Repository
                          <svg viewBox="0 0 24 24" width="14" height="14"><path d="M9 19c-4 1.5-4-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" /></svg>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
        </Container>
      </motion.div>
    </>
  )
}

export default Projects

















