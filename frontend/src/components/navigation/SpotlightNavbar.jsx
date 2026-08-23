import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { animate, motion, useReducedMotion } from 'framer-motion'
import { cn } from '../../lib/utils'
import { BlueprintPillButton } from '../ui/blueprint-pill-button'

// Detect blueprint mode by watching the html class toggled by About.jsx.
// Keeps the global navbar untouched in every other mode.
function useBlueprintActive() {
  const [active, setActive] = useState(false)
  useEffect(() => {
    const root = document.documentElement
    const update = () => setActive(root.classList.contains('about-blueprint-nav'))
    update()
    const mo = new MutationObserver(update)
    mo.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => mo.disconnect()
  }, [])
  return active
}

const defaultItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact', href: '/contact' },
  { label: 'Resume', href: '/resume' },
]

const entranceAnimations = {
  flipIn: {
    initial: { opacity: 0, rotateX: -90, transformPerspective: 800, transformOrigin: 'bottom center' },
    animate: { opacity: 1, rotateX: 0, transformPerspective: 800, transformOrigin: 'bottom center' },
    transition: { duration: 0.5, ease: [0.455, 0.030, 0.515, 0.955] },
  },
  emerge: {
    initial: { opacity: 0, y: -20, scale: 0.96, filter: 'blur(8px)' },
    animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
  fadeSlide: {
    initial: { opacity: 0, y: -12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
  scaleUp: {
    initial: { opacity: 0, scale: 0.92 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
  static: {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    transition: { duration: 0 },
  },
}

function SpotlightNavbar({ items = defaultItems, className, onItemClick, animationKey = 'flipIn' }) {
  const navRef = useRef(null)
  const location = useLocation()
  const shouldReduceMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(() =>
    items.findIndex(item => item.href === location.pathname)
  )
  const [hoverX, setHoverX] = useState(null)

  const spotlightX = useRef(0)
  const ambienceX = useRef(0)

  const blueprint = useBlueprintActive()

  useEffect(() => {
    const idx = items.findIndex(item => item.href === location.pathname)
    if (idx !== -1) setActiveIndex(idx)
  }, [location.pathname, items])

  useEffect(() => {
    if (!navRef.current) return
    const nav = navRef.current

    const handleMouseMove = (e) => {
      const rect = nav.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setHoverX(x)
      spotlightX.current = x
      nav.style.setProperty('--spotlight-x', `${x}px`)
      nav.style.setProperty('--spotlight-y', `${y}px`)
    }

    const handleMouseLeave = () => {
      setHoverX(null)
      const activeItem = nav.querySelector(`[data-index="${activeIndex}"]`)
      if (activeItem) {
        const navRect = nav.getBoundingClientRect()
        const itemRect = activeItem.getBoundingClientRect()
        const targetX = itemRect.left - navRect.left + itemRect.width / 2

        animate(spotlightX.current, targetX, {
          type: 'spring',
          stiffness: 200,
          damping: 20,
          onUpdate: (v) => {
            spotlightX.current = v
            nav.style.setProperty('--spotlight-x', `${v}px`)
          },
        })
      }
    }

    nav.addEventListener('mousemove', handleMouseMove)
    nav.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      nav.removeEventListener('mousemove', handleMouseMove)
      nav.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [activeIndex])

  useEffect(() => {
    if (!navRef.current) return
    const nav = navRef.current

    const positionAmbience = () => {
      const activeItem = nav.querySelector(`[data-index="${activeIndex}"]`)
      if (activeItem) {
        const navRect = nav.getBoundingClientRect()
        const itemRect = activeItem.getBoundingClientRect()
        const targetX = itemRect.left - navRect.left + itemRect.width / 2

        animate(ambienceX.current, targetX, {
          type: 'spring',
          stiffness: 200,
          damping: 20,
          onUpdate: (v) => {
            ambienceX.current = v
            nav.style.setProperty('--ambience-x', `${v}px`)
          },
        })
      }
    }

    const timeout = setTimeout(positionAmbience, 800)
    return () => clearTimeout(timeout)
  }, [activeIndex])

  const handleItemClick = (item, index) => {
    setActiveIndex(index)
    onItemClick?.(item, index)
  }

  const anim = entranceAnimations[animationKey] || entranceAnimations.flipIn

  // In blueprint mode, the navbar is the EXACT same BlueprintPillButton used
  // by the hero RESUME button — same dashed rectangle frame, nested solid +
  // dotted frames, W/H dimension indicators (real measured size), cursor
  // crosshair and JetBrains Mono links — with the 5 nav links living inside
  // it as children. Every other mode keeps the untouched spotlight navbar.
  if (blueprint) {
    return (
      <div className={cn('relative flex justify-center z-50', className)} style={{ paddingTop: '24px' }}>
        <BlueprintPillButton className="bp-nav" heightOnRight={false}>
          <ul className="relative flex items-center h-full px-2 gap-0.5 z-[10]">
            {items.map((item, idx) => (
              <li key={idx} className="relative h-full flex items-center justify-center">
                <Link
                  to={item.href}
                  data-index={idx}
                  onClick={() => handleItemClick(item, idx)}
                  className={cn(
                    'px-2 py-1.5 text-sm font-medium transition-colors duration-200 rounded-full',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d2ff]',
                    activeIndex === idx ? 'is-active' : ''
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </BlueprintPillButton>
      </div>
    )
  }

  return (
    <div className={cn('relative flex justify-center z-50', className)} style={{ paddingTop: '40px' }}>
      <motion.nav
        ref={navRef}
        initial={shouldReduceMotion ? { opacity: 1 } : anim.initial}
        animate={anim.animate}
        transition={anim.transition}
        className={cn(
          'spotlight-nav relative h-11 rounded-full overflow-hidden',
          'backdrop-blur-[24px] border border-[rgba(255,255,255,0.1)]',
          'bg-[rgba(255,255,255,0.05)] shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
        )}
      >
        {/* Content */}
        <ul className="relative flex items-center h-full px-2 gap-0 z-[10]">
          {items.map((item, idx) => (
            <li key={idx} className="relative h-full flex items-center justify-center">
              <Link
                to={item.href}
                data-index={idx}
                onClick={() => handleItemClick(item, idx)}
                className={cn(
                  'px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-full',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]',
                  activeIndex === idx
                    ? 'is-active text-[var(--color-primary-light)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--color-primary-light)]'
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* 1. The Moving Spotlight (Follows Mouse) */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 w-full h-full z-[1] opacity-0 transition-opacity duration-300"
          style={{
            opacity: hoverX !== null ? 1 : 0,
            background: `radial-gradient(
              120px circle at var(--spotlight-x) 100%,
              rgba(var(--color-primary-light-rgb), 0.15) 0%,
              transparent 50%
            )`,
          }}
        />

        {/* 2. The Active State Ambience (Stays on Active) */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 w-full h-[2px] z-[2]"
          style={{
            background: `radial-gradient(
              30px circle at var(--ambience-x) 0%,
              rgba(var(--color-primary-light-rgb), 1) 0%,
              transparent 100%
            )`,
          }}
        />
      </motion.nav>

      <style>{`
        .spotlight-nav {
          --spotlight-x: 50%;
          --spotlight-y: 50%;
          --ambience-x: 50%;
        }
      `}</style>
    </div>
  )
}

export default SpotlightNavbar
