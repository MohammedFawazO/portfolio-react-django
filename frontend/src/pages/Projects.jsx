import { useState, useEffect, useMemo, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
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

// Icon set for the console highlight bullets. Keys match the `icon` field on
// each highlight; stroke-based to match the rest of the project's line work.
// Unknown keys render nothing, so a missing icon degrades to plain text.
const HIGHLIGHT_ICONS = {
  box: <path d="M21 8l-9-5-9 5m18 0l-9 5m9-5v8l-9 5m0-8L3 8m9 5v8" />,
  bag: <path d="M6 7V6a6 6 0 0 1 12 0v1M5 7h14l-1 13H6L5 7zM9.5 11v1a2.5 2.5 0 0 0 5 0v-1" />,
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.6-3.6" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  shield: <path d="M12 3l7 3v5.5c0 4.4-2.9 7.6-7 9-4.1-1.4-7-4.6-7-9V6l7-3z" />,
  code: <path d="m8 6-6 6 6 6M16 6l6 6-6 6" />,
  type: <path d="M4 7V4h16v3M12 4v16M9 20h6" />,
  list: <path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" />,
  phone: (
    <>
      <rect x="6" y="2" width="12" height="20" rx="2.5" />
      <path d="M11 18.5h2" />
    </>
  ),
  zap: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />,
  file: <path d="M14 2H6v20h12V6l-4-4zM14 2v4h4M9 13h6M9 17h6" />,
  trend: <path d="m3 17 6-6 4 4 8-8M15 7h6v6" />,
  terminal: (
    <>
      <rect x="2" y="3" width="20" height="18" rx="2" />
      <path d="m6 9 3 3-3 3M12 15h5" />
    </>
  ),
  monitor: (
    <>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  refresh: <path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1M21 3v5h-5" />,
  tag: (
    <>
      <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z" />
      <circle cx="7.5" cy="7.5" r="1.2" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="5.5" rx="8" ry="3" />
      <path d="M4 5.5v13c0 1.7 3.6 3 8 3s8-1.3 8-3v-13M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  sliders: (
    <>
      <path d="M4 8h16M4 16h16" />
      <circle cx="9" cy="8" r="2.2" />
      <circle cx="16" cy="16" r="2.2" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.5 20c0-3.4 2.9-5.2 6.5-5.2s6.5 1.8 6.5 5.2" />
      <path d="M16 5.2a3.2 3.2 0 0 1 0 5.6M17.8 20c0-2.6-.9-4.2-2.3-5" />
    </>
  ),
  map: <path d="m9 4-6 2v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14" />,
  branch: (
    <>
      <circle cx="6" cy="6" r="2.6" />
      <circle cx="6" cy="18" r="2.6" />
      <circle cx="18" cy="8" r="2.6" />
      <path d="M6 8.6v6.8M18 10.6c0 3.2-2.7 4.4-6 5.2" />
    </>
  ),
  pen: <path d="M12 19.5 19 12.5l2.5 2.5-7 7-3.5 1 1-3.5zM17.5 14 21 17.5M14 4.5l5.5 5.5" />,
  layout: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9.5h18M9.5 21V9.5" />
    </>
  ),
  layers: <path d="m12 3 9 4.8-9 4.8-9-4.8L12 3zM3 13l9 4.8 9-4.8" />,
}

function HighlightIcon({ name }) {
  const path = HIGHLIGHT_ICONS[name]
  if (!path) return null
  return (
    <span className="console-highlight-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {path}
      </svg>
    </span>
  )
}

const projectDetails = {
  'CarCure': {
    description:
      'An automotive marketplace and service platform for UAE drivers, pairing a genuine spare-parts catalogue with enquiry handling and maintenance scheduling. Django and DRF carry the backend, role-separated dashboards keep customers and staff on the same records, and Supabase handles accounts and file storage.',
    tags: ['Python', 'Django', 'DRF', 'Bootstrap', 'Supabase', 'PostgreSQL', 'Render', 'Cloudflare'],
    highlights: [
      { icon: 'gear', title: 'Parts Catalogue', text: 'Genuine spares browsable by make, model and year.' },
      { icon: 'search', title: 'Enquiry Handling', text: 'Customers raise a parts enquiry, staff answer from the same thread.' },
      { icon: 'calendar', title: 'Service Booking', text: 'Reserve maintenance slots and keep vehicle history in one place.' },
      { icon: 'grid', title: 'Split Dashboards', text: 'Customers track progress while staff manage fulfilment from the same records.' },
      { icon: 'shield', title: 'Accounts & Storage', text: 'Supabase-backed auth with secure uploads for proofs and invoices.' },
      { icon: 'code', title: 'REST API Layer', text: 'A clean DRF surface so web and mobile clients never drift apart.' },
    ],
  },
  'Al Shamil Turning LLC': {
    description:
      'A corporate site for a Fujairah engineering firm, built so heavy technical work still reads clearly. A restrained visual system, structured service content and a fully responsive layout let contractors and clients understand the firm\u2019s capabilities without a designer in the loop.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
    highlights: [
      { icon: 'type', title: 'Corporate Identity', text: 'Type, spacing and colour tuned to feel engineered, not templated.' },
      { icon: 'list', title: 'Service Breakdown', text: 'Capabilities organised so contractors reach what they need quickly.' },
      { icon: 'phone', title: 'Responsive Layout', text: 'From phones on site through to wide desktop monitors.' },
      { icon: 'zap', title: 'Lightweight Build', text: 'Plain HTML, CSS and JavaScript for quick loads and easy handover.' },
      { icon: 'file', title: 'Content Structure', text: 'Project and service copy laid out for scanning, not reading end to end.' },
      { icon: 'trend', title: 'Fast Delivery', text: 'Static hosting with no build step to slow the client down.' },
    ],
  },
  'Dubai Travel AI Assistant': {
    description:
      'A conversational planning companion for exploring Dubai, written in Python with Streamlit. Visitors describe a day, a budget or a mood and get a shaped itinerary back, with the interface doing the work of turning a language model response into a plan someone would actually follow.',
    tags: ['Python', 'Streamlit', 'AI'],
    highlights: [
      { icon: 'terminal', title: 'Prompt-Driven Planning', text: 'Describe the trip in plain language, receive a structured day back.' },
      { icon: 'monitor', title: 'Streamlit Interface', text: 'A responsive UI assembled entirely in Python, no separate frontend.' },
      { icon: 'pin', title: 'Grounded Suggestions', text: 'Recommendations anchored to real places rather than filler advice.' },
      { icon: 'refresh', title: 'Iterative Refinement', text: 'Ask for changes and the plan adapts without starting over.' },
      { icon: 'tag', title: 'Budget Awareness', text: 'Cost and timing trade-offs reflected in the output.' },
      { icon: 'zap', title: 'Instant Results', text: 'Plans generate in seconds, no waiting on a build or reload.' },
    ],
  },
  'Tour Package Management System': {
    description:
      'A booking platform for tour operators that covers packages, availability and customers under one roof. Built on Django with SQLite to keep setup trivial, it walks the full reservation lifecycle from first enquiry to confirmation, with a staff-facing admin panel for day-to-day changes.',
    tags: ['Python', 'Django', 'SQLite', 'HTML'],
    highlights: [
      { icon: 'database', title: 'Full CRUD', text: 'Packages, itineraries and pricing managed end to end.' },
      { icon: 'calendar', title: 'Booking Workflow', text: 'Enquiry through confirmation, with capacity handled centrally.' },
      { icon: 'lock', title: 'Authentication', text: 'Separate staff and customer access to exactly the right data.' },
      { icon: 'sliders', title: 'Admin Panel', text: 'Everyday changes made in the UI, never by touching the database.' },
      { icon: 'users', title: 'Customer Records', text: 'Bookings and history kept against each traveller.' },
      { icon: 'box', title: 'Zero-Friction Setup', text: 'SQLite keeps local and demo installs to a single command.' },
    ],
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
]

// Rich info shown in the right-side console when a milestone is selected.
const PROJECT_INFO = {
  jar: {
    num: '01',
    name: 'Coming Soon',
    category: 'In Development',
    description:
      'Something new is taking shape in the workshop right now. This slot is reserved for the next build, and it will carry the full breakdown the moment it goes live.',
    highlights: [
      { icon: 'map', title: 'Concept & Planning', text: 'Scope and requirements mapped before a line of code.' },
      { icon: 'branch', title: 'Architecture', text: 'Data model and service boundaries decided up front.' },
      { icon: 'layout', title: 'UI Prototyping', text: 'Layouts explored and reviewed before implementation.' },
      { icon: 'layers', title: 'Stack Selection', text: 'Chosen for what the project actually needs.' },
    ],
    stack: ['React', 'Node', 'PostgreSQL'],
    live: '#',
    repo: '#',
  },
  carcure: {
    num: '02',
    name: 'CarCure',
    category: 'E-commerce · SaaS',
    description:
      'An automotive marketplace and service platform for UAE users covering genuine spare parts, enquiry handling and maintenance booking, built around speed, reliability and convenience.',
    highlights: projectDetails['CarCure'].highlights,
    stack: projectDetails['CarCure'].tags,
    live: 'https://carcure.ae/',
    repo: '',
    repoNote: 'Client repo · private',
  },
  carcure2: {
    num: '03',
    name: 'AL Shamil Turning',
    category: 'Corporate Portfolio',
description:
        'A corporate portfolio for a Fujairah engineering firm, rebuilt for clarity and full responsiveness: faster to load, easier to read, and finally up to the standard of their work.',
    highlights: projectDetails['Al Shamil Turning LLC'].highlights,
    stack: projectDetails['Al Shamil Turning LLC'].tags,
    live: 'https://alshamilturning.com/',
    repo: '',
    repoNote: 'Client repo · private',
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
        <meta name="description" content="View projects built by Mohammed Fawaz O : from automotive marketplaces to business portfolio websites." />
      </Helmet>

      {/* Hero Section : pinned during scroll animation */}
      <div ref={heroRef} className="h-[1400vh] flex flex-col">
      <motion.section className="sticky top-0 h-screen shrink-0 min-h-175 bg-[#050505] overflow-hidden">
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
                     <span className="text-[10px] text-[rgba(255,255,255,.55)] font-mono uppercase tracking-[0.15em] leading-tight text-center min-h-6.5">
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
      <motion.div id="projects-grid" style={{ y: gridSlide, marginBottom: -vh }} className="relative z-30 bg-[linear-gradient(180deg,#1c1f24_0%,#101216_35%,#070809_100%)] pt-10 pb-0 overflow-hidden rounded-t-[40px] flex-1 flex flex-col">

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

              {slots.map((p, i) => {
                const slotName = ['left', 'center', 'right'][i]
                const live = PROJECT_INFO[p.id] && PROJECT_INFO[p.id].live
                const liveHref = live && live !== '#' ? live : null
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
                        // Already centered - select and slide immediately
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

                    {/* Animated milestone image stack - slides, podium/shadow stay put */}
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
                          liveHref ? (
                            <a
                              href={liveHref}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={`Open ${p.title} website`}
                              className="podium-snapshot-link"
                            >
                              <img
                                src={p.milestone}
                                alt={`${p.title} milestone`}
                                className={`podium-object-back ${p.tilt ? '' : 'is-flat'}`}
                              />
                            </a>
                          ) : (
                            <img
                              src={p.milestone}
                              alt={`${p.title} milestone`}
                              className={`podium-object-back ${p.tilt ? '' : 'is-flat'}`}
                            />
                          )
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

              {/* Tech-stack marquee beneath the selected milestone - matches the
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
                          <li key={typeof h === 'string' ? h : `${info.num}-${h.title}`}>
                            {typeof h === 'string' ? (
                              h
                            ) : (
                              <>
                                <strong className="console-highlight-title">
                                  <HighlightIcon name={h.icon} />
                                  {h.title}
                                </strong>
                                <span className="console-highlight-text">{h.text}</span>
                              </>
                            )}
                          </li>
                        ))}
                      </ul>

                      <div className="console-actions">
                        {info.live && info.live !== '#' && (
                          <a className="console-btn console-btn--primary" href={info.live} target="_blank" rel="noreferrer">
                            Live Site
                            <svg viewBox="0 0 24 24" width="14" height="14"><path d="M7 17L17 7M17 7H8M17 7V16" /></svg>
                          </a>
                        )}
                        {info.repo && info.repo !== '#' ? (
                          <a className="console-btn" href={info.repo} target="_blank" rel="noreferrer">
                            Repository
                            <svg viewBox="0 0 24 24" width="14" height="14"><path d="M9 19c-4 1.5-4-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" /></svg>
                          </a>
                        ) : (
                          // Client work : the source lives in the client's private
                          // repo, so there is nothing to link - say so instead of
                          // offering a dead button.
                          <span className="console-btn console-btn--note" title={info.repoNote || 'Private repository'}>
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="10.5" width="16" height="10" rx="2" /><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" /></svg>
                            {info.repoNote || 'Private repository'}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

</div>

{/* CTA : the next step after someone has looked at the work.
          Sits directly under the podium stage, and reuses .console-btn so the
          buttons are identical to the ones in the project console rather
          than a second button style. Links, not anchors: both targets are
          routes in App.jsx, so react-router handles them and the page
          never does a full reload. */}
          </Container>

          {/* Full-bleed: a direct child of #projects-grid, which is already
              viewport-width, so the card spans the whole section without any
              100vw maths (which would overflow against the html
              scrollbar-gutter). The inner wrapper keeps the copy at the
              same measure it had inside Container. */}
          <div className="milestone-cta page-tail-fade mt-auto">
            <div className="milestone-cta-inner">
              <h2 className="milestone-cta-title">Have a project in mind?</h2>
                <p className="milestone-cta-sub">
                  Let&rsquo;s build something useful. I design and build web applications with Django and
                  React, from the first sketch through to something running in production, for UAE
                  teams who need the result to hold up.
                </p>
                <div className="milestone-cta-actions">
                  {/* Two routes to the same person: the dedicated contact page,
                      and the form embedded on the home page. Both are react-router
                      Links; the second relies on the hash-scroll handler in
                      MainLayout to land on the form instead of the page top.

                      The arrow svg matches the console buttons - same 24 viewBox,
                      14px, currentColor stroke. It sits at zero width until hover,
                      which is what .milestone-cta-arrow animates open. */}
                  <Link to="/contact" className="console-btn console-btn--primary">
                    Get in touch
                    <svg
                      className="milestone-cta-arrow"
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                  <Link to="/#home-contact" className="console-btn">
                    Contact us
                    <svg
                      className="milestone-cta-arrow"
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </div>
            </div>
          </div>
      </motion.div>
    </>
  )
}

export default Projects

















