import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation } from 'react-router-dom'
import { animate, AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { cn } from '../../lib/utils'
import { BlueprintPillButton } from '../ui/blueprint-pill-button'
import { findActiveIndex } from './navActive'

const SCRAMBLE_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/\\~0123456789ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿ'

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

// Detect test mode by watching the html class toggled by About.jsx.
function useMatrixActive() {
  const [active, setActive] = useState(false)
  useEffect(() => {
    const root = document.documentElement
    const update = () => setActive(root.classList.contains('about-matrix-nav'))
    update()
    const mo = new MutationObserver(update)
    mo.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => mo.disconnect()
  }, [])
  return active
}

function useTestModeActive() {
  const [active, setActive] = useState(false)
  useEffect(() => {
    const root = document.documentElement
    const update = () => setActive(root.classList.contains('about-test-nav'))
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
  { label: 'Resume', href: '/resume' },
  // { label: 'Contact', href: '/contact' },
]

// Routes are compared normalised (see navActive.js) so "/about/" or
// "/resume/?x" still resolve to the right link instead of leaving the
// previous page's item highlighted.

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

export function MobileMenu({ items, activeIndex, onItemClick, variant = 'default' }) {
  const [open, setOpen] = useState(false)
  const isTest = variant === 'test'
  const design = variant === 'design'
  const blueprint = useBlueprintActive()
  const matrix = useMatrixActive()
  const panelRef = useRef(null)
  const [fabTop, setFabTop] = useState(null)

  // Footer avoidance: the hamburger is pinned to `top-10`, so on its own it
  // would stay put while the footer area (video band + footer shell) scrolls up
  // underneath it. Measure the same boundary the WhatsApp CTA uses - the last
  // in-flow section in <main>, or the top of the footer shell including its
  // top margin - and let the button ride up off-screen instead of ever
  // overlapping the footer. Identical maths on every route.
  useEffect(() => {
    const compute = () => {
      let sectionLine = null
      const main = document.querySelector('main')
      if (main) {
        const kids = Array.from(main.children)
        for (let i = kids.length - 1; i >= 0; i -= 1) {
          const cs = getComputedStyle(kids[i])
          if (cs.display === 'none' || cs.position === 'fixed' || cs.position === 'absolute') continue
          sectionLine = kids[i].getBoundingClientRect().bottom
          break
        }
      }

      const footerEl = document.querySelector('footer.footer-responsive')
      const shell = footerEl?.closest('.footer-shell') || footerEl
      let footerLine = null
      if (shell) {
        const marginTop = parseFloat(getComputedStyle(shell).marginTop) || 0
        footerLine = shell.getBoundingClientRect().top - marginTop
      }

      const boundary =
        sectionLine !== null && footerLine !== null
          ? Math.min(sectionLine, footerLine)
          : (sectionLine ?? footerLine)

      if (boundary === null) {
        setFabTop(null)
        return
      }

      // Natural top is 2.5rem (top-10). Keep the button's bottom edge a small
      // clearance above the border; once the border rises past that line the
      // computed offset turns negative and the button leaves the viewport
      // rather than sitting over the footer.
      const NATURAL_TOP = 40
      const BTN_SIZE = 44
      const CLEARANCE = 24
      setFabTop(Math.min(NATURAL_TOP, boundary - BTN_SIZE - CLEARANCE))
    }

    let frame = 0
    const schedule = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        compute()
      })
    }
    compute()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    const ro = new ResizeObserver(schedule)
    ro.observe(document.body)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      ro.disconnect()
    }
  }, [])

  // Escape closes it, and so does a tap anywhere outside the panel.
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const onPointerDown = (e) => {
      if (panelRef.current?.contains(e.target)) return
      if (e.target.closest?.('.hamburger')) return
      setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  // Button AND panel are portaled together, and both are positioned `fixed`
  // from the viewport rather than absolutely from the nav wrapper. The nav
  // wrapper is pointer-events-none (so the page stays clickable behind it),
  // `fixed`, and its height is only the 40px padding strip - so anything
  // positioned against it inherited click-through, clipping and stacking
  // behaviour that differed per route. Owning both elements outright makes the
  // menu behave identically on every page.
  const menu = (
    <>
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="mobile-menu-panel"
        onClick={() => setOpen((v) => !v)}
        style={fabTop !== null ? { top: `${fabTop}px` } : undefined}
        className={cn(
          'hamburger liquid-glass !fixed top-10 left-5 z-[70] md:hidden w-11 h-11 rounded-full flex items-center justify-center cursor-pointer p-0',
          open && 'is-open',
          blueprint && '!bg-[#001428] !border !border-[#00d2ff]/70',
          matrix && '!bg-black !border !border-[#03A062]/60',
          isTest && '!bg-[#070204] !border !border-[#D2042D]',
          design && 'hamburger--design'
        )}
      >
        <svg viewBox="0 0 32 32" className={cn(
          isTest && '[&_*]:!stroke-[#D2042D]',
          blueprint && '[&_*]:!stroke-[#00d2ff]',
          matrix && '[&_*]:!stroke-[#03A062]'
        )}>
          <path className="line line-top-bottom" d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22" />
          <path className="line" d="M7 16 27 16" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu-panel"
            ref={panelRef}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{ transformOrigin: 'top left' }}
            className={cn(
              'md:hidden !fixed top-[5.5rem] left-5 z-[70] w-56 rounded-2xl border backdrop-blur-xl p-2 shadow-2xl',
              blueprint ? 'border-[#00d2ff]/40 bg-[rgba(0,20,40,0.95)]' :
                matrix ? 'border-[#03A062]/40 bg-[rgba(0,10,5,0.95)]' :
                  isTest ? 'border-[#D2042D]/40 bg-[rgba(7,2,4,0.95)]' :
                    design ? 'border-[#4c5355]/50 bg-[rgba(253,251,247,0.97)]' :
                      'border-white/10 bg-[rgba(10,12,15,0.92)]'
            )}
          >
            <ul className="flex flex-col">
              {items.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.href}
                    onClick={() => {
                      setOpen(false)
                      onItemClick?.(item, idx)
                    }}
                    className={cn(
                      'block px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200',
                      activeIndex === idx
                        ? (blueprint ? 'bg-[#00d2ff]/20 text-[#00d2ff]' : matrix ? 'bg-[#03A062]/20 text-[#03A062]' : isTest ? 'bg-[#D2042D]/20 text-[#FF3B47]' : design ? 'bg-[#246bff]/10 text-[#246bff]' : 'bg-white/10 text-white')
                        : (blueprint ? 'text-[#00d2ff]/70 hover:bg-[#00d2ff]/10 hover:text-[#00d2ff]' : matrix ? 'text-[#03A062]/70 hover:bg-[#03A062]/10 hover:text-[#03A062]' : isTest ? 'text-[#D2042D]/70 hover:bg-[#D2042D]/10 hover:text-[#FF3B47]' : design ? 'text-[#3b4647]/80 hover:bg-[#246bff]/10 hover:text-[#246bff]' : 'text-white/70 hover:bg-white/5 hover:text-white')
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )

  return typeof document !== 'undefined' ? createPortal(menu, document.body) : null
}

export function useIsMobile(breakpoint = 768) {
  const getIsMobile = () =>
    typeof window !== 'undefined' && window.innerWidth < breakpoint

  const [isMobile, setIsMobile] = useState(getIsMobile)

  useEffect(() => {
    const update = () => setIsMobile(getIsMobile())
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [breakpoint])

  return isMobile
}

function SpotlightNavbar({ items = defaultItems, className, onItemClick, animationKey = 'flipIn' }) {
  const navRef = useRef(null)
  const location = useLocation()
  const shouldReduceMotion = useReducedMotion()
  // The active link is always derived from the route - never stored - so the
  // underline can never drift out of sync with the page it belongs to.
  const activeIndex = useMemo(() => findActiveIndex(items, location.pathname), [items, location.pathname])
  const [hoverX, setHoverX] = useState(null)

  const spotlightX = useRef(0)
  const ambienceX = useRef(0)
  const spotlightAnim = useRef(null)

  const blueprint = useBlueprintActive()
  const matrix = useMatrixActive()
  const testMode = useTestModeActive()
  const isMobile = useIsMobile()
  const [hoveredIdx, setHoveredIdx] = useState(null)
const [displayLabels, setDisplayLabels] = useState({})
  const scrambleRef = useRef(null)

  const scrambleText = useCallback((text, progress) => {
    return text.split('').map((ch, i) => {
      if (ch === ' ' || ch === '/' || ch === '.') return ch
      if (i < progress * text.length) return ch
      return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
    }).join('')
  }, [])

  useEffect(() => {
    if (!testMode) return
    if (hoveredIdx === null) {
      if (scrambleRef.current) clearInterval(scrambleRef.current)
      setDisplayLabels({})
      return
    }

    const label = items[hoveredIdx]?.label || ''
    const target = label.toUpperCase()
    let progress = 0

    scrambleRef.current = setInterval(() => {
      progress += 0.15
      if (progress >= 1) {
        clearInterval(scrambleRef.current)
        setDisplayLabels(prev => ({ ...prev, [hoveredIdx]: target }))
      } else {
        setDisplayLabels(prev => ({ ...prev, [hoveredIdx]: scrambleText(target, progress) }))
      }
    }, 40)

    return () => {
      if (scrambleRef.current) clearInterval(scrambleRef.current)
    }
  }, [hoveredIdx, items, testMode, scrambleText])

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    const handleMouseMove = (e) => {
      const rect = nav.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      // pointer is back in charge : cancel any spring still running
      spotlightAnim.current?.stop()
      spotlightAnim.current = null
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

        spotlightAnim.current?.stop()
        spotlightAnim.current = animate(spotlightX.current, targetX, {
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
      spotlightAnim.current?.stop()
      spotlightAnim.current = null
    }
  }, [activeIndex])

  // The active underline (--ambience-x). Re-measured whenever anything that
  // can move it happens : the route changes, a mode switch rebuilds the nav,
  // the webfonts land, or the nav / active link resize (window resize,
  // scrollbar). Measuring once - plus a fixed 800ms guess - used to leave it
  // stranded on the previous page or parked at the CSS default.
  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

if (activeIndex < 0) {
      nav.style.setProperty('--ambience-show', '0')
      return
    }

    let frame = 0
    const place = () => {
      const item = nav.querySelector(`[data-index="${activeIndex}"]`)
      if (!item) return
      const itemRect = item.getBoundingClientRect()
      if (!itemRect.width) return
      const navRect = nav.getBoundingClientRect()
      const x = itemRect.left - navRect.left + itemRect.width / 2
      ambienceX.current = x
      nav.style.setProperty('--ambience-x', `${x}px`)
    }

const measure = () => {
      place()
      nav.style.setProperty('--ambience-show', '1')
    }

    measure()
    frame = requestAnimationFrame(measure)

    const item = nav.querySelector(`[data-index="${activeIndex}"]`)
    const ro = new ResizeObserver(place)
    ro.observe(nav)
    if (item) ro.observe(item)
    window.addEventListener('resize', measure)

    let cancelled = false
    if (document.fonts?.ready) document.fonts.ready.then(() => !cancelled && measure())

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [activeIndex, blueprint, testMode])

  const handleItemClick = (item, index) => {
    onItemClick?.(item, index)
  }

  const anim = entranceAnimations[animationKey] || entranceAnimations.flipIn

  // In blueprint mode, the navbar is the EXACT same BlueprintPillButton used
  // by the hero RESUME button - same dashed rectangle frame, nested solid +
  // dotted frames, W/H dimension indicators (real measured size), cursor
  // crosshair and JetBrains Mono links - with the 5 nav links living inside
  // it as children. Every other mode keeps the untouched spotlight navbar.
  if (blueprint) {
    return (
      <div className={cn('relative z-50 w-full pointer-events-none', className)} style={{ paddingTop: '24px' }}>
        {!isMobile && (
          <div className="flex justify-center">
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
        )}

        {isMobile && <MobileMenu items={items} activeIndex={activeIndex} onItemClick={handleItemClick} />}
      </div>
    )
  }

  if (testMode) {
    return (
      <div className={cn('relative z-50 w-full pointer-events-none', className)} style={{ paddingTop: '24px' }}>
        {!isMobile && (
          <div className="flex justify-center">
            <div className="relative px-7 py-3 sm:px-8 sm:py-3.5 rounded-none bg-[#080204]/95 backdrop-blur-md border border-[#D2042D]/40 shadow-[0_4px_14px_rgba(0,0,0,0.5),inset_0_0_10px_rgba(210,4,45,0.06)] pointer-events-auto overflow-hidden">
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(210,4,45,0.03)_2px,rgba(210,4,45,0.03)_4px)]" />
                <div className="scanline-animation absolute inset-0 bg-gradient-to-b from-transparent via-[#D2042D]/5 to-transparent animate-[scanline_4s_linear_infinite]" />
              </div>
              <ul className="relative flex items-center h-full gap-0.5 z-[10]">
                {items.map((item, idx) => (
                  <li key={idx} className="relative h-full flex items-center justify-center">
                    <Link
                      to={item.href}
                      data-index={idx}
                      onClick={() => handleItemClick(item, idx)}
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onMouseLeave={() => setHoveredIdx(null)}
                      className={cn(
                        'relative inline-block px-3 py-1.5 text-[14px] font-bold tracking-[0.1em] uppercase transition-colors duration-200 rounded-none overflow-hidden',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D2042D]',
                        activeIndex === idx
                          ? 'text-[#D2042D] drop-shadow-[0_0_8px_rgba(255,59,71,0.85)]'
                          : `text-[#E5E7EB] hover:text-white${hoveredIdx === idx ? ' test-nav-glitch' : ''}`
                      )}
                      style={{ fontFamily: "'Pixel Digivolve', monospace" }}
                    >
                      <span className="relative z-10 inline-block">
                        <span className="invisible" aria-hidden="true">{item.label.toUpperCase()}</span>
                        <span className="absolute inset-0 whitespace-nowrap">{displayLabels[idx] || item.label}</span>
                      </span>
                      {activeIndex === idx && (
                        <span className="absolute inset-0 pointer-events-none overflow-hidden">
                          <span className="absolute inset-x-0 h-10 pointer-events-none animate-[navScanline_2.5s_ease-in-out_infinite]" style={{ top: 0, background: 'linear-gradient(180deg, transparent 0%, rgba(255,59,71,0.35) 65%, rgba(255,59,71,0.95) 100%)' }}>
                            <span className="absolute bottom-0 inset-x-0 h-[2px]" style={{ background: '#FF3B47', boxShadow: '0 0 8px #FF3B47, 0 0 16px #D2042D' }} />
                          </span>
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
              <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#D2042D]/70" />
              <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#D2042D]/70" />
              <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#D2042D]/70" />
              <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#D2042D]/70" />
              <span className="absolute bottom-1 right-2.5 text-[8px] font-mono tracking-widest text-[#D2042D]/50">//nav</span>
            </div>
          </div>
        )}
        <style>{`
          @keyframes scanline {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
          }
          @keyframes navScanline {
            0% { transform: translateY(-100%); }
            40% { transform: translateY(200%); }
            40.01% { transform: translateY(200%); }
            60% { transform: translateY(200%); }
            60.01% { transform: translateY(-100%); }
            100% { transform: translateY(-100%); }
          }
          /* Same glitch language as GlitchScanGridButton: RGB-split slice jitter
             in steps(2), burst first ~400ms then idle, repeating every 2s. */
          @keyframes test-nav-glitch-anim {
            0%, 20% { transform: translate(0, 0); text-shadow: 0 0 8px rgba(255,59,71,0.85); }
            2% { transform: translate(-2px, 1px); text-shadow: 2px 0 0 #FF3B47, -2px 0 0 #00F0FF; }
            4% { transform: translate(2px, -1px); text-shadow: -2px 0 0 #FF3B47, 2px 0 0 #00F0FF; opacity: 0.6; }
            6% { transform: translate(-1px, 0); text-shadow: 1px 0 0 #D2042D, -1px 0 0 #00F0FF; opacity: 1; }
            8% { transform: translate(1px, 1px); text-shadow: -1.5px 0 0 #FF3B47, 1.5px 0 0 #00F0FF; }
            10% { transform: translate(0, 0); text-shadow: 0 0 10px rgba(255,59,71,0.9); }
            12% { transform: translate(-2px, -1px); text-shadow: 2px 0 0 #D2042D, -2px 0 0 #00F0FF; opacity: 0.7; }
            14% { transform: translate(1px, 0); text-shadow: -1px 0 0 #FF3B47, 1px 0 0 #00F0FF; opacity: 1; }
            16% { transform: translate(-1px, 1px); text-shadow: 1.5px 0 0 #FF3B47, -1.5px 0 0 #00F0FF; }
            18%, 100% { transform: translate(0, 0); text-shadow: 0 0 8px rgba(255,59,71,0.85); }
          }
          .test-nav-glitch {
            animation: test-nav-glitch-anim 2s steps(2, jump-start) infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .test-nav-glitch { animation: none; }
          }
          .moving-stripes {
            width: 100%;
            height: 50px;
            background: linear-gradient(
              45deg,
              #8B0000 25%,
              #000000 25%,
              #000000 50%,
              #8B0000 50%,
              #8B0000 75%,
              #000000 75%,
              #000000
            );
            background-size: 40px 40px;
            animation: moveStripes 2s linear infinite;
          }
          @keyframes moveStripes {
            from { background-position: 0 0; }
            to { background-position: 40px 0; }
          }
        `}</style>
        {isMobile && <MobileMenu items={items} activeIndex={activeIndex} onItemClick={handleItemClick} variant="test" />}
      </div>
    )
  }

  return (
    <div className={cn('relative w-full pointer-events-none', className)} style={{ paddingTop: '40px' }}>
      {!isMobile && (
        <div className="flex justify-center">
          <motion.nav
          ref={navRef}
          initial={shouldReduceMotion ? { opacity: 1 } : anim.initial}
          animate={anim.animate}
          transition={anim.transition}
          className={cn(
            'spotlight-nav relative z-50 h-11 rounded-full overflow-hidden pointer-events-auto',
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
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-nav-accent)]',
                  activeIndex === idx
                    ? 'is-active text-[var(--color-nav-accent)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--color-nav-accent)]'
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
              rgba(var(--color-nav-accent-rgb), 0.15) 0%,
              transparent 50%
            )`,
          }}
        />

        {/* 2. The Active State Ambience (Stays on Active) */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 w-full h-[2px] z-[2] transition-opacity duration-200"
style={{
            opacity: 'var(--ambience-show, 0)',
            background: `radial-gradient(
              30px circle at var(--ambience-x) 0%,
              rgba(var(--color-nav-accent-rgb), 1) 0%,
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
      )}

      {isMobile && <MobileMenu items={items} activeIndex={activeIndex} onItemClick={handleItemClick} />}
    </div>
  )
}

export default SpotlightNavbar
