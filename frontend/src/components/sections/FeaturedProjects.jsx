import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { Link } from 'react-router-dom'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { GithubIcon } from '../ui/SocialIcons'
import ScrollReveal from '../ui/ScrollReveal'
import Container from '../ui/Container'

const PROMINENT_PROJECT = {
  id: 'carcure',
  title: 'CarCure',
  eyebrow: 'Automotive Service & Spare Parts Platform',
  badge: 'Featured Showcase',
  description:
    'CarCure is an automotive platform I built for the UAE market, covering spare parts, vehicle services, maintenance bookings, and customer enquiries. The project includes separate dashboards for customers and staff, vehicle management, and service request workflows, with each feature built around how the platform is actually used. The backend runs on Django and Django REST Framework, with Supabase handling authentication and cloud storage.',
  tags: ['Python', 'Django', 'Django REST Framework', 'Supabase', 'PostgreSQL', 'Render', 'Cloudflare'],
  preview: '/media/carcure.png',
  images: ['/media/carcure.png', '/media/website img.png', '/media/carcure-2.png', '/media/carcure-3.png'],
  live: 'https://carcure.ae/',
  github: '',
}

const SUPPORTING_PROJECTS = [
  {
    id: 'al-shamil',
    title: 'AL Shamil Turning LLC',
    eyebrow: 'Corporate Website & Service Showcase',
    description:
      'A company website built for a marine machinery and engineering business in Fujairah, UAE. The site presents the company\'s services, technical capabilities, and business information in a clean, responsive layout that works across mobile and desktop. Designed to give visitors a clear picture of what the company does and make its services easy to explore.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive UI', 'UI/UX'],
    preview: '/media/hull machine.png',
    images: ['/media/hull machine.png', '/media/website img-2.png', '/media/alshamil-2.png', '/media/alshamil-3.png'],
    live: 'https://alshamilturning.com/',
    github: '',
  },
  {
    id: 'portfolio-site',
    title: 'Personal Portfolio',
    eyebrow: 'Interactive Developer Portfolio',
    description:
      'My own portfolio, built with React to showcase my projects, skills, and development journey. Beyond a traditional portfolio, it features interactive 3D scenes and smooth animations. I built it to experiment with modern frontend techniques while creating a space that reflects my work and the way I approach development.',
    tags: ['React', 'Tailwind CSS', 'Framer Motion', 'Three.js', 'Vite'],
    preview: '/media/about default.png',
    images: ['/media/about default.png', '/media/home.png', '/media/about.png', '/media/projects.png'],
    live: '',
    github: 'https://github.com/MohammedFawazO/portfolio-react-django.git',
  },
]

const PROJECTS = [PROMINENT_PROJECT, ...SUPPORTING_PROJECTS]

const fadeUp = {
  hidden: { y: 30, opacity: 0 },
  visible: (delay = 0) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
  }),
}

const clamp01 = (value) => Math.min(1, Math.max(0, value))
const easeOutCubic = (value) => 1 - Math.pow(1 - value, 3)

// Destination for a project card: the live URL when there is one, otherwise
// the repository. Matches the links listed on the Projects page.
// Photos shot in 3:2 read as oversized next to the wide screenshots, so these
// render at half the image box.
const IMAGE_SCALES = {
  '/media/hull machine.png': 0.5,
  '/media/about default.png': 0.72,
}

const projectHref = (project) => {
  if (project.live && project.live !== '#') return project.live
  if (project.github && project.github !== '#') return project.github
  return null
}

function ProjectLink({ project, className, onActivate, children }) {
  const href = projectHref(project)

  const handleClick = (event) => {
    if (!onActivate) return
    // This card runs its own shuffle -> blackout -> redirect sequence.
    event.preventDefault()
    onActivate(event)
  }

  if (!href) return <div className={className}>{children}</div>

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={handleClick}
      aria-label={`Open ${project.title}`}
      className={`${className} cursor-pointer group`}
    >
      {children}
    </a>
  )
}

function ProjectGallery({ project, progress, onImageClick }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#E8EEF2]">
      {project.images.map((image, index) => {
        const step = 1 / project.images.length
        const reveal = index === 0 ? 1 : clamp01((progress - index * step) / step)
        const eased = easeOutCubic(reveal)

        return (
          <figure
            key={`${project.id}-${index}`}
            className="absolute inset-0"
            style={{
              transform: `translate3d(0, ${(1 - eased) * 108}%, 0)`,
              zIndex: index + 1,
            }}
          >
            <ProjectLink
              project={project}
              onActivate={onImageClick ? () => onImageClick(project) : undefined}
              className="flex h-full w-full items-center justify-center px-4 py-6 sm:px-7"
            >
              <img
                src={image}
                alt={`${project.title} preview ${index + 1}`}
                className="rounded-[5px] object-contain object-center transition-transform duration-500 ease-out group-hover:scale-[1.015]"
                style={{
                  width: `${(IMAGE_SCALES[image] ?? 1) * 100}%`,
                  maxHeight: `${(IMAGE_SCALES[image] ?? 1) * 100}%`,
                }}
              />
            </ProjectLink>
          </figure>
        )
      })}
    </div>
  )
}

function MobileGallery({ project }) {
  // The first image is the cover already shown in the desktop card, so the
  // phone view starts from the actual site shots instead of repeating it.
  const images = project.images.slice(1)
  const trackRef = useRef(null)
  const [active, setActive] = useState(0)

  const handleScroll = () => {
    const track = trackRef.current
    if (!track) return
    const next = Math.round(track.scrollLeft / Math.max(track.clientWidth, 1))
    setActive((current) => (current === next ? current : next))
  }

  if (!images.length) return null

  return (
    <div className="ct-panel mb-5 overflow-hidden lg:hidden">
      <div
        ref={trackRef}
        onScroll={handleScroll}
        data-lenis-prevent
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain bg-[#E8EEF2] scrollbar-none [&::-webkit-scrollbar]:hidden"
      >
        {images.map((image, index) => (
          <figure
            key={`${project.id}-mobile-${index}`}
            className="w-full shrink-0 snap-center p-2.5 sm:p-3"
          >
            <ProjectLink project={project} className="block">
              <img
                src={image}
                alt={`${project.title} preview ${index + 2}`}
                className="mx-auto aspect-16/10 w-full rounded-[5px] object-contain"
              />
            </ProjectLink>
          </figure>
        ))}
      </div>

      <div className="flex items-center justify-center gap-1.5 border-t-2 border-black bg-white/80 px-3 py-2">
        <span className="sr-only">
          {`Image ${active + 1} of ${images.length}`}
        </span>
        {images.map((image, index) => (
          <span
            key={`${project.id}-mobile-dot-${index}`}
            aria-hidden="true"
            className={`h-1 rounded-full transition-all duration-300 ${index === active ? 'w-4 bg-[#2d8cf0]' : 'w-1.5 bg-black/20'}`}
          />
        ))}
      </div>
    </div>
  )
}

function StickyShowcase({ trackRefs }) {
  const [displayedIndex, setDisplayedIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [swapFrom, setSwapFrom] = useState(null)
  const displayedIndexRef = useRef(0)
  const progressRef = useRef(0)
  const outgoingGalleryRef = useRef(null)
  const swapRunningRef = useRef(false)
  // Click sequence: a tweened progress override drives the shuffle, then the
  // card swells while the whole screen fades to black.
  const [overrideProgress, setOverrideProgress] = useState(null)
  const [blackout, setBlackout] = useState(null)
  const cardRef = useRef(null)
  const blackoutRef = useRef(null)
  const transitionRef = useRef(false)

  // Once the screen is black, hand off to the project in the same tab so the
  // expansion and fade remain visible before navigation.
  //
  // The fade is full-screen instead of a sheet clipped outward from the card:
  // the clip version left the story copy sitting in view until the edge swept
  // past it, which read as a flash of text mid-blackout.
  useLayoutEffect(() => {
    if (!blackout || !blackoutRef.current) return undefined
    const sheet = blackoutRef.current
    const { href, isSwap, target } = blackout
    const card = cardRef.current

    const timeline = gsap.timeline({
      onComplete: () => {
        if (isSwap) {
          if (card) gsap.set(card, { clearProps: 'transform' })
          setBlackout(null)
          setOverrideProgress(null)
          return
        }
        // Navigate only after the card expansion and full-screen fade finish.
        window.location.assign(href)
      },
    })
    if (card) timeline.to(card, { scale: 1.12, duration: 0.55, ease: 'power2.in' }, 0)
    timeline.to(sheet, { opacity: 1, duration: 0.55, ease: 'power4.out' }, 0)
    timeline.addLabel('black', 0.55)

    if (isSwap) {
      timeline.add(
        () => {
          setDisplayedIndex(target)
        },
        'black',
      )
      // Fade out so the new content appears smoothly.
      timeline.to(sheet, { opacity: 0, duration: 0.45, ease: 'power2.out' }, 'black')
      timeline.to(card, { scale: 1, duration: 0.45, ease: 'power2.out' }, 'black')
      timeline.set(card, { clearProps: 'transform' })
    } else {
      // Hold at full black so the expand reads before redirecting.
      timeline.to({}, { duration: 0.15 }, 'black')
    }
    return () => timeline.kill()
  }, [blackout])

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      // The click sequence owns progress while it runs; scrolling must not
      // fight the shuffle halfway through.
      if (transitionRef.current || swapRunningRef.current) return
      const eyeLevel = window.innerHeight * 0.62
      let nextIndex = 0
      let nextProgress = 0

      trackRefs.current.forEach((element, index) => {
        if (!element) return
        const rect = element.getBoundingClientRect()
        if (rect.top <= eyeLevel) {
          nextIndex = index
          nextProgress = clamp01((eyeLevel - rect.top) / Math.max(rect.height, 1))
        }
      })

      if (displayedIndexRef.current !== nextIndex) {
        const direction = nextIndex > displayedIndexRef.current ? 'forward' : 'backward'
        setSwapFrom({
          index: direction === 'forward' ? displayedIndexRef.current : nextIndex,
          progress: direction === 'forward' ? progressRef.current : nextProgress,
          direction,
        })

        if (direction === 'forward') setDisplayedIndex(nextIndex)
        displayedIndexRef.current = nextIndex
      }

      progressRef.current = nextProgress
      if (nextIndex === displayedIndexRef.current) setProgress(nextProgress)
    }

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [trackRefs])

  const project = PROJECTS[displayedIndex]

  // Clicking a project image expands the card and fades the page to black
  // before navigating to the project.
  const handleCardClick = (clicked) => {
    const href = projectHref(clicked)
    if (!href) return

    transitionRef.current = true
    setBlackout({ href, isSwap: false })
  }

  return (
    <div className="sticky top-0 h-screen max-lg:hidden lg:block">
      {blackout && (
        createPortal(
          <div
            ref={blackoutRef}
            aria-hidden="true"
            className="fixed inset-0 z-9998 bg-black"
            style={{ opacity: 0 }}
          />,
          document.body
        )
      )}
      <div className="flex h-full items-center justify-center">
        <div className="w-full">
          <div ref={cardRef} className="ct-panel relative flex h-[82vh] w-full flex-col overflow-hidden bg-[#ADD8E6]">
            <div className="flex items-center justify-between gap-4 border-b-2 border-black bg-[#E8EEF2] px-4 py-3">
              <span className="shrink-0 whitespace-nowrap font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2d8cf0]">
                {String(displayedIndex + 1).padStart(2, '0')} / {PROJECTS.length}
              </span>
              <span className="truncate font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
                {project.title}
              </span>
            </div>

            <div className="relative min-h-0 flex-1">
              <div className="absolute inset-0 z-0">
                <ProjectGallery
                  project={project}
                  progress={overrideProgress ?? progress}
                  onImageClick={handleCardClick}
                />
              </div>

              <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 rounded-full border-2 border-black bg-white/85 px-2.5 py-1.5 backdrop-blur-sm">
                {project.images.map((_, index) => (
                  <span
                    key={`${project.id}-dot-${index}`}
                    className="h-1 w-5 rounded-full transition-colors duration-300"
                    style={{
                      backgroundColor:
                        index === 0 || progress >= index * (1 / project.images.length)
                          ? '#2d8cf0'
                          : '#d4d4d8',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProjectActions({ project, compact = false }) {
  return (
    <div className="mt-5 flex flex-nowrap items-stretch gap-2 lg:mt-6 lg:flex-wrap lg:gap-3">
      {project.live && (
        <a
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          className={[
            'inline-flex items-center gap-1.5 whitespace-nowrap bg-[#ADD8E6] text-black font-semibold rounded-full border-2 border-black shadow-[4px_4px_0_#000] hover:bg-[#2d8cf0] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all font-mono uppercase tracking-wider',
            compact ? 'px-4 py-2.5 text-xs' : 'px-2.5 py-2.5 text-[9px] sm:px-3.5 sm:text-[11px] lg:gap-2 lg:px-5 lg:py-3 lg:text-xs',
          ].join(' ')}
        >
          View Live Project
          <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </a>
      )}
      {project.github && (
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className={[
            'inline-flex items-center gap-1.5 whitespace-nowrap bg-transparent text-black font-semibold rounded-full border-2 border-black shadow-[4px_4px_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all font-mono uppercase tracking-wider',
            compact ? 'px-4 py-2.5 text-xs' : 'px-2.5 py-2.5 text-[9px] sm:px-3.5 sm:text-[11px] lg:gap-2 lg:px-5 lg:py-3 lg:text-xs',
          ].join(' ')}
        >
          Source Code
          <GithubIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </a>
      )}
    </div>
  )
}

function ProjectStory({ project, index, trackRef }) {
  const trackElementRef = useRef(null)

  const setTrackElement = (element) => {
    trackElementRef.current = element
    trackRef(element)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col justify-center py-7 sm:py-9 lg:py-10"
    >
      <MobileGallery project={project} />

      <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-3 sm:gap-3">
        <span className="font-mono text-[11px] font-semibold tracking-[0.18em] text-[#2d8cf0] sm:text-[12px]">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="h-px w-8 bg-black/20 sm:w-10" />
        <span className="font-mono text-[10px] sm:text-[13px] uppercase tracking-[0.16em] font-semibold text-[#2d8cf0] sm:tracking-[0.2em]">
          {project.eyebrow}
        </span>
      </div>

      <h3 className="mb-3.5 font-(family-name:--font-display) text-[26px] font-bold leading-[1.12] tracking-tight text-black sm:text-[36px] sm:leading-tight sm:tracking-normal md:text-[42px] lg:mb-5 lg:text-[46px]">
        {project.title}
      </h3>

      <div ref={setTrackElement}>
        <ScrollReveal text={project.description} trackRef={trackElementRef} />
        <ProjectActions project={project} />
      </div>
    </motion.article>
  )
}

function FeaturedProjects() {
  const trackRefs = useRef([])

  return (
    <section id="selected-work" className="relative pt-20 pb-20 md:pt-28 md:pb-28 bg-white border-b-2 border-black">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute"
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
          className="absolute"
          style={{
            bottom: '10%',
            left: '-5%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(173,216,230,0.14) 0%, transparent 70%)',
          }}
        />
      </div>

      <Container size="lg" style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mb-10 sm:mb-12 lg:mb-14"
        >
          <div className="grid grid-cols-1 items-end gap-4 sm:gap-5 lg:grid-cols-12 lg:gap-6">
            <div className="text-center lg:col-span-12">
              <h2 className="font-(family-name:--font-display) text-[26px] leading-[1.1] font-bold text-black tracking-tight uppercase text-center sm:text-[38px] sm:leading-[1.08] lg:text-[44px]">
                SELECTED WORK
              </h2>
            </div>
            <div className="text-center lg:col-span-12">
              <p className="mx-auto max-w-2xl text-[14px] text-[#666] leading-relaxed sm:text-[15px]">
                A selection of live commercial client platforms and software applications highlighting clean architecture, robust backends, and tactile interfaces.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-4 lg:grid-cols-[60%_minmax(0,1fr)]">
          <div className="relative">
            <StickyShowcase trackRefs={trackRefs} />
          </div>

          <div>
            {PROJECTS.map((project, index) => (
              <ProjectStory
                key={project.id}
                project={project}
                index={index}
                trackRef={(element) => {
                  trackRefs.current[index] = element
                }}
              />
            ))}
          </div>
        </div>

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
            className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#ADD8E6] text-black font-semibold rounded-full border-2 border-black shadow-[4px_4px_0_#000] hover:bg-[#2d8cf0] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all font-mono text-xs uppercase tracking-wider"
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