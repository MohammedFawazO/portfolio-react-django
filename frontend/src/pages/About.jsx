import { Helmet } from 'react-helmet-async'
import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import SectionHeading from '../components/ui/SectionHeading'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Container from '../components/ui/Container'
import { StaggerChildren, StaggerItem } from '../components/animations/StaggerChildren'
import { useDesignMode } from '../context/DesignModeContext'
import { MatrixRain } from '../components/ui/MatrixRain'
import { MorphyButton } from '@/components/ui/morphy-button'
import CrayonButton from '@/components/ui/CrayonButton'
import { BlueprintPillButton } from '@/components/ui/blueprint-pill-button'
import { AliveBlueprintBackground } from '@/components/ui/alive-blueprint-background'
import GlitchScanGridButton from '@/components/ui/glitch-scan-grid-button'
import GlitchDescription from '@/components/ui/glitch-description'
import NeonRGBTextEffect from '@/components/ui/neon-rgb-text-effect'
import { RedGlitchHeading } from '@/components/ui/red-glitch-heading'
import TestErrorPopups from '@/components/ui/test-error-popups'
import TestModeBackground from '@/components/ui/test-mode-background'
import TestBugOverlay from '@/components/ui/test-bug-overlay'
import { technologies } from '../components/ui/TechMarquee'
import { Download, ArrowRight, Bug } from 'lucide-react'

const fadeUp = {
  hidden: { y: 30, opacity: 0 },
  visible: (delay) => ({ y: 0, opacity: 1, transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] } }),
}

const ARROW_A = { main: 'M14 3C11 9 21 12 16 18C13 21 19 23 23 26', head: 'M18 19L23 26L16 25', w: 48, h: 44 }
const ARROW_B = { main: 'M10 5C16 1 13 11 22 13C31 15 15 19 24 23C29 26 17 27 27 30', head: 'M22 24L27 30L19 29', w: 58, h: 52 }
const ARROW_C = { main: 'M15 7C11 11 21 12 17 18C14 23 23 22 19 28', head: 'M15 23L19 28L13 27', w: 40, h: 38 }

// The pill-button crosshair, but always on and covering the whole viewport.
// Portaled to <body> so no ancestor stacking context or transform can bury it.
// Lines are written straight to refs on mousemove (same as the buttons) so the
// reticle sits exactly on the cursor tip. Fades out over anything the buttons,
// pills and hero image would react to.
function BlueprintCursorCrosshair() {
  const wrapRef = useRef(null)
  const hLineRef = useRef(null)
  const vLineRef = useRef(null)
  useEffect(() => {
    let hidden = false
    // Same method as BlueprintPillButton's crosshair: position is measured
    // against the CONTAINER's own bounding rect (not raw client coords) and
    // written straight onto the lines in the handler, so the intersection
    // lands exactly on the cursor tip.
    const onMove = (e) => {
      const rect = wrapRef.current ? wrapRef.current.getBoundingClientRect() : { left: 0, top: 0 }
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      if (hLineRef.current) hLineRef.current.style.top = `${y}px`
      if (vLineRef.current) vLineRef.current.style.left = `${x}px`
      const over = !!e.target.closest && e.target.closest('a, button, [role="button"], img, svg, .ct-tag, .about-badge')
      if (over !== hidden && wrapRef.current) {
        hidden = over
        wrapRef.current.style.opacity = over ? '0' : '1'
      }
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])
  return createPortal(
    <div ref={wrapRef} style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none', opacity: 1, transition: 'opacity 0.2s ease' }}>
      <div ref={hLineRef} style={{ position: 'absolute', left: 0, right: 0, height: '1px', background: 'rgba(0,210,255,0.5)', top: 0 }} />
      <div ref={vLineRef} style={{ position: 'absolute', top: 0, bottom: 0, width: '1px', background: 'rgba(0,210,255,0.5)', left: 0 }} />
    </div>,
    document.body
  )
}

function TypingLoader({ text = 'icons/illustrations loading...', className = '' }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let i = 0
    let timer
    const tick = () => {
      i = (i + 1) % (text.length + 1)
      setCount(i)
      timer = setTimeout(tick, i === text.length ? 1200 : 80)
    }
    timer = setTimeout(tick, 300)
    return () => clearTimeout(timer)
  }, [text])
  return (
    <span
      className={`inline-flex items-center text-[13px] tracking-wide text-[#5b6b6e] ${className}`}
      style={{ fontFamily: '"Comic Sans MS", "Comic Sans", "Chalkboard SE", "Comic Neue", cursive' }}
    >
      <span className="whitespace-pre">{text.slice(0, count)}</span>
      <span className="caret-blink ml-0.5 inline-block w-[0.55ch] h-[1.05em] bg-current align-middle" />
    </span>
  )
}

function HoverColorAnnot({ label = 'hover color?', color = '#246bff', style, arrow, arrowStyle }) {
  const { main = ARROW_A.main, head = ARROW_A.head, w = ARROW_A.w, h = ARROW_A.h } = arrow || {}
  return (
    <div
      className="pointer-events-none select-none z-80"
      style={style}
      aria-hidden="true"
    >
      <span
        style={{
          color,
          fontFamily: "'Comic Sans MS', 'Segoe Print', 'Bradley Hand', cursive",
          fontSize: '12px',
          transform: 'rotate(8deg)',
          display: 'inline-block',
        }}
      >
        {label}
      </span>
      <svg
        viewBox="0 0 36 32"
        fill="none"
        style={{ width: w, height: h, color, overflow: 'visible', transform: 'rotate(180deg)', display: 'block', margin: '0 auto', ...arrowStyle }}
      >
        <path d={main} stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" />
        <path d={head} stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

// Skill chips reuse the Home hero's marquee so a skill and its icon can never
// drift apart. The marquee labels a few of them differently than the badge
// does, hence the alias map rather than a straight name lookup.
const SKILL_ICON_ALIAS = {
  HTML: 'HTML5',
  CSS: 'CSS3',
  'Tailwind CSS': 'Tailwind',
}

// Railway and Render ship as white glyphs (Render's is an inline svg rather
// than a URL, which is why the marquee does not just list an image for it).
// They have to be flipped to read on the light beige badges, and left alone
// again once a dark hero mode turns the badges dark.
const WHITE_GLYPH_SKILLS = new Set(['Railway', 'Render'])

const techByName = new Map(technologies.map((tech) => [tech.name, tech]))

function SkillChip({ name }) {
  const tech = techByName.get(SKILL_ICON_ALIAS[name] || name)
  if (!tech) {
    return <Badge variant="light" className="about-badge ct-tag">{name}</Badge>
  }
  const flip = WHITE_GLYPH_SKILLS.has(name) ? ' skill-swap-icon--flip' : ''
  return (
    <Badge variant="light" className="about-badge ct-tag skill-swap" title={name}>
      <span className="skill-swap-label">{name}</span>
      {tech.svg ? (
        <span className={`skill-swap-icon skill-swap-icon--inline${flip}`} data-icon={name} aria-hidden="true">{tech.svg}</span>
      ) : (
        <img className={`skill-swap-icon${flip}`} data-icon={name} src={tech.image} alt="" aria-hidden="true" draggable="false" />
      )}
    </Badge>
  )
}

// The photo's mode buttons orbit it on a ring that is driven from JS (see
// About) so it can be wound back and released without snapping. Timings are
// shared with the CSS slide in index.css: ring wind-back, then the button's
// slide to its resting spot, then the orbit picks up again.
const ORBIT_TURN_SECONDS = 24
const ORBIT_SLIDE_S = 0.65
const ORBIT_SLIDE_MS = ORBIT_SLIDE_S * 1000
// resting spot of the active button, measured up from the photo's bottom edge
const DOCK_OFFSET_REM = 4.875

// Refs for the four mode buttons, module-scoped so their identity is stable
// across renders (they are only read for measurement).
const modeButtonRefs = {
  blueprint: { current: null },
  matrix: { current: null },
  design: { current: null },
  test: { current: null },
}

function About() {
  const [showBlueprint, setShowBlueprint] = useState(false)
  const [showMatrix, setShowMatrix] = useState(false)
  const [showDesign, setShowDesign] = useState(false)
  const [showTest, setShowTest] = useState(false)
  const [introReplayKey, setIntroReplayKey] = useState(0)

  const groupRef = useRef(null)
  const canvasRef = useRef(null)
  const inkCanvasRef = useRef(null)
  const codeCanvasRef = useRef(null)
  const designCanvasRef = useRef(null)
  const testCanvasRef = useRef(null)
  const portraitImgRef = useRef(null)
  const maskRef = useRef(null)
  const inkRef = useRef(null)
  const trailRef = useRef([])
  const rafRef = useRef(null)

  // --- the orbit around the photo -------------------------------------------
  // The ring's angle is a motion value rather than a CSS keyframe : it can be
  // frozen and picked up again at any time without snapping. Picking a mode
  // does not turn the ring at all - the clicked button is handed an offset
  // expressed in the ring's own (tilted) frame, which works out to a straight
  // slide on screen straight from wherever it was clicked.
  const spin = useMotionValue(0)
  const spinLoop = useRef(null)
  const resumeTimer = useRef(null)
  const hoverRef = useRef(false)
  const heldRef = useRef(false)
  const orbitWrapRef = useRef(null)
  const counterSpin = useTransform(spin, (v) => -v)
  const dockX = useMotionValue(0)
  const dockY = useMotionValue(0)
  const dockAnims = useRef([])
  // which button currently carries the dock offset (keeps it attached for the
  // whole slide, in and out, so nothing ever pops)
  const [dockedBtn, setDockedBtn] = useState(null)

  const anyModeOn = showBlueprint || showMatrix || showDesign || showTest

  // Which theme the page below the hero wears. The hero picks the mode, every
  // other section simply inherits it.
  const pageMode = showBlueprint
    ? 'blueprint'
    : showMatrix
      ? 'matrix'
      : showDesign
        ? 'design'
        : showTest
          ? 'test'
          : 'default'

  const clearResumeTimer = () => {
    if (resumeTimer.current) {
      clearTimeout(resumeTimer.current)
      resumeTimer.current = null
    }
  }

  const stopDockAnims = () => {
    dockAnims.current.forEach((a) => a?.stop())
    dockAnims.current = []
  }

  const slideDockTo = useCallback((target) => {
    stopDockAnims()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      dockX.set(target.x)
      dockY.set(target.y)
      return
    }
    // [0.22, 1, 0.36, 1] is easeOutQuint: it covers ~63% of the travel in the
    // first 0.1s and then crawls the last stretch, which reads as a jerk
    // followed by a hang. Material's standard curve eases in and settles.
    dockAnims.current = [
      animate(dockX, target.x, { duration: ORBIT_SLIDE_S, ease: [0.4, 0, 0.2, 1] }),
      animate(dockY, target.y, { duration: ORBIT_SLIDE_S, ease: [0.4, 0, 0.2, 1] }),
    ]
  }, [dockX, dockY])

  const startOrbitLoop = useCallback(() => {
    spinLoop.current?.stop()
    spinLoop.current = animate(spin, spin.get() + 360, {
      duration: ORBIT_TURN_SECONDS,
      ease: 'linear',
      repeat: Infinity,
    })
    // if the pointer is already inside the photo, start it frozen
    if (hoverRef.current) spinLoop.current.pause()
  }, [spin])

// Where the dock point sits in the ring's own (frozen, tilted) frame, given
  // where the button currently is on that ring. Measured after layout, and
  // re-measured while docked, so the resting spot is always the real
  // bottom-centre of the photo and never drifts by a few pixels.
  const measureDockTarget = useCallback(
    (id) => {
      const wrap = orbitWrapRef.current
      const btn = modeButtonRefs[id]?.current
      if (!wrap || !btn) return null
      const rad = (spin.get() * Math.PI) / 180
      const dockRem = parseFloat(getComputedStyle(document.documentElement).fontSize) * DOCK_OFFSET_REM
      const dockYLocal = wrap.clientHeight / 2 - dockRem
      return {
        x: dockYLocal * Math.sin(rad) - (btn.offsetLeft - wrap.clientWidth / 2),
        y: dockYLocal * Math.cos(rad) - (btn.offsetTop - wrap.clientHeight / 2),
      }
    },
    [spin]
  )

  // Freeze the ring where it is and hand the clicked button over to the dock.
  // The ring never turns - the slide is a straight line on screen.
  const parkOrbit = useCallback((id) => {
    clearResumeTimer()
    spinLoop.current?.stop()
    spinLoop.current = null
    heldRef.current = true

    if (dockedBtn && dockedBtn !== id) {
      // Switching straight from one docked button to another pops: the
      // outgoing button loses its offset on the same frame the incoming one
      // gains it at its still-rotated spot. Slide the old one home first and
      // dock the new one when it lands.
      slideDockTo({ x: 0, y: 0 })
      resumeTimer.current = setTimeout(() => {
        resumeTimer.current = null
        setDockedBtn(id)
      }, ORBIT_SLIDE_MS)
      return
    }

    stopDockAnims()
    // Aim and launch here rather than leaving it to the [dockedBtn] effect:
    // this runs inside the click handler, so the tween is already in flight
    // when React commits the mode switch and repaints the hero underneath it.
    // The effect re-aims to the same destination afterwards, which is a no-op
    // at that distance.
    const target = measureDockTarget(id)
    if (target) slideDockTo(target)
    setDockedBtn(id)
  }, [dockedBtn, measureDockTarget, slideDockTo])

  // Release : slide back to zero (the exact spot it was clicked from), let go
  // of the offset, then pick the orbit up again.
  const releaseOrbit = useCallback(() => {
    clearResumeTimer()
    slideDockTo({ x: 0, y: 0 })
    heldRef.current = false
    resumeTimer.current = setTimeout(() => {
      resumeTimer.current = null
      setDockedBtn(null)
      startOrbitLoop()
    }, ORBIT_SLIDE_MS)
  }, [startOrbitLoop, slideDockTo])

  // Runs after the render that attaches the offset, so the slide starts from
  // the button's real position rather than a half-advanced value.
  useEffect(() => {
    if (!dockedBtn) return
    const target = measureDockTarget(dockedBtn)
    if (!target) return
    slideDockTo(target)

    // Anything that moves the layout while it sits docked (photo or webfont
    // landing, resize, scrollbar, zoom) re-places it instead of leaving it
    // where it used to be. A ResizeObserver always reports once on observe -
    // that first report must be ignored, or it would cancel the slide and
    // snap the button straight to the dock.
    const wrap = orbitWrapRef.current
    const btn = modeButtonRefs[dockedBtn]?.current
    let lastSize = ''
    let primed = false
    const ro = new ResizeObserver((entries) => {
      const size = entries.map((e) => `${e.target.offsetWidth}x${e.target.offsetHeight}`).join('|')
      if (!primed) {
        // ResizeObserver always delivers one report the moment you observe.
        // It carries no layout change, so it must only seed the baseline -
        // acting on it would stop the tween the line above just started and
        // snap the button straight to the dock.
        primed = true
        lastSize = size
        return
      }
      if (size === lastSize) return
      lastSize = size
      const next = measureDockTarget(dockedBtn)
      if (!next) return
      // Re-aim the tween instead of hard-setting the values: the photo can
      // resize while the button is still travelling (image decode, webfont
      // swap, scrollbar), and a set() there cut the slide dead.
      slideDockTo(next)
    })
    if (wrap) ro.observe(wrap)
    if (btn) ro.observe(btn)

    return () => ro.disconnect()
  }, [dockedBtn, dockX, dockY, measureDockTarget, slideDockTo])

  // Hovering (or focusing) the photo freezes the ring where it is, and it
  // picks straight back up the moment the pointer leaves again.
  const holdOrbit = useCallback(() => {
    hoverRef.current = true
    spinLoop.current?.pause()
  }, [])
  const letOrbitRun = useCallback(() => {
    hoverRef.current = false
    if (!heldRef.current) spinLoop.current?.play()
  }, [])

  // One hero mode at a time. The four buttons used to flip their own flag
  // independently, so turning one on left the others on : two buttons read as
  // `is-active` while `pageMode` (and therefore the whole body theme below)
  // silently resolved to whichever came first in the ternary.
  const stopInk = () => {
    trailRef.current = []
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }

  const toggleMode = useCallback((id) => {
    const on = {
      blueprint: showBlueprint,
      matrix: showMatrix,
      design: showDesign,
      test: showTest,
    }[id]
    const next = !on
    stopInk()
    setShowBlueprint(next && id === 'blueprint')
    setShowMatrix(next && id === 'matrix')
    setShowDesign(next && id === 'design')
    setShowTest(next && id === 'test')
    if (next) parkOrbit(id)
    else releaseOrbit()
  }, [showBlueprint, showMatrix, showDesign, showTest, parkOrbit, releaseOrbit])

  const deactivateMode = useCallback(() => {
    if (showBlueprint || showMatrix || showDesign || showTest) {
      setShowBlueprint(false)
      setShowMatrix(false)
      setShowDesign(false)
      setShowTest(false)
      releaseOrbit()
      stopInk()
    }
  }, [showBlueprint, showMatrix, showDesign, showTest, releaseOrbit])

  useEffect(() => {
    startOrbitLoop()
    return () => {
      clearResumeTimer()
      spinLoop.current?.stop()
      stopDockAnims()
    }
  }, [startOrbitLoop])

  const navigate = useNavigate()
  const { designModeActive, setDesignModeActive } = useDesignMode()

  // Soft fade spots layered over the design-mode grid (without altering
  // the grid itself) so the graph paper looks unevenly inked. On the light
  // hero background these white, blurred blobs are invisible on their own
  // but locally erase the blue grid lines, producing "fade spots".
  const gridFadeSpots = useMemo(() => {
    const spots = []
    for (let i = 0; i < 16; i++) {
      spots.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 200 + Math.random() * 280,
        opacity: 0.7 + Math.random() * 0.3,
      })
    }
    // A larger fade spot near the about photo (right column)
    spots.push({ x: 76, y: 52, size: 340, opacity: 0.85 })
    return spots
  }, [])

  const handleResumeDownload = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const a = document.createElement('a')
    a.href = '/media/resume.pdf'
    a.download = 'Mohammed-Fawaz-O-Resume.pdf'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const STROKE_LIFE = 750

  useEffect(() => {
    const preload = (src, store) => {
      const img = new Image()
      img.src = src
      // Eagerly decode, then rasterize into an offscreen canvas we hold a
      // reference to. A decoded <img> that isn't actively used can have its
      // bitmap evicted and re-decode on first drawImage (the switch lag);
      // a held canvas bitmap stays warm and never re-decodes.
      const warm = (attempt = 0) => {
        img.decode().then(() => {
          const c = document.createElement('canvas')
          c.width = img.naturalWidth
          c.height = img.naturalHeight
          c.getContext('2d').drawImage(img, 0, 0)
          store.current = c
          if (!rafRef.current && trailRef.current.length) {
            rafRef.current = requestAnimationFrame(renderInk)
          }
        }).catch(() => {
          if (attempt < 5) setTimeout(() => warm(attempt + 1), 120)
        })
      }
      warm()
    }
    preload('/media/blueprint.png', inkCanvasRef)
    preload('/media/code.png', codeCanvasRef)
    preload('/media/design.png', designCanvasRef)
    preload('/media/test.png', testCanvasRef)
    const pt = new Image()
    pt.src = '/media/about default.png'
    portraitImgRef.current = pt
    maskRef.current = document.createElement('canvas')
    inkRef.current = document.createElement('canvas')
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (showBlueprint) {
      root.style.setProperty('--color-primary-light', '#00d2ff')
      root.style.setProperty('--color-primary-light-rgb', '0, 210, 255')
    } else if (showMatrix) {
      root.style.setProperty('--color-primary-light', '#03A062')
      root.style.setProperty('--color-primary-light-rgb', '3, 160, 98')
      root.style.removeProperty('--text-secondary')
    } else {
      root.style.removeProperty('--color-primary-light')
      root.style.removeProperty('--color-primary-light-rgb')
      root.style.removeProperty('--text-secondary')
    }
    return () => {
      root.style.removeProperty('--color-primary-light')
      root.style.removeProperty('--color-primary-light-rgb')
      root.style.removeProperty('--text-secondary')
    }
  }, [showBlueprint, showMatrix])

  // Toggle a body class while in code (matrix) mode so the global navbar can
  // adopt the terminal/code theme. Scoped via CSS to only affect the navbar
  // in this mode - design, blueprint and test modes never set this class.
  useEffect(() => {
    const root = document.documentElement
    if (showMatrix) root.classList.add('about-matrix-nav')
    else root.classList.remove('about-matrix-nav')
    return () => root.classList.remove('about-matrix-nav')
  }, [showMatrix])

  // Toggle a body class while in blueprint mode so the global navbar can
  // adopt the blueprint hero-button theme. Scoped via CSS to only affect the
  // navbar in this mode - design, matrix and test modes never set this class.
  useEffect(() => {
    const root = document.documentElement
    if (showBlueprint) root.classList.add('about-blueprint-nav')
    else root.classList.remove('about-blueprint-nav')
    return () => root.classList.remove('about-blueprint-nav')
  }, [showBlueprint])

  useEffect(() => {
    const root = document.documentElement
    if (showTest) root.classList.add('about-test-nav')
    else root.classList.remove('about-test-nav')
    return () => root.classList.remove('about-test-nav')
  }, [showTest])

  useEffect(() => {
    setDesignModeActive(showDesign)
    return () => setDesignModeActive(false)
  }, [showDesign, setDesignModeActive])

  useEffect(() => {
    if (!showDesign) return
    const id = setInterval(() => {
      setIntroReplayKey((k) => k + 1)
    }, 5000)
    return () => clearInterval(id)
  }, [showDesign])

  const drawInkCover = (ctx, cw, ch, src, scaleMul = 1, offX = 0) => {
    if (!src || !src.width) return
    const sw = src.naturalWidth || src.width
    const sh = src.naturalHeight || src.height
    const scale = Math.max(cw / sw, ch / sh) * scaleMul
    const w = sw * scale
    const h = sh * scale
    const MM = 3.7795
    const offY = 4.4 * MM
    ctx.drawImage(src, (cw - w) / 2 + offX, (ch - h) / 2 + offY, w, h)
  }

  // Replicates the static design overlay exactly:
  //   absolute left-[54%] top-[53%] -translate-x-1/2 -translate-y-1/2
  //   w-[calc(100%-4.5rem)] h-[calc(100%-4.5rem)] origin-right
  //   scale-x-[1.15] scale-y-[1.12] object-cover
  // CSS transform order (Tailwind) is translate * scale about transform-origin
  // (right edge, vertical center). Canvas affine equivalent per local point:
  //   x' = 1.15*x + (0.54*cw - 0.65*bw)
  //   y' = 1.12*y + (0.53*ch - 0.56*bh)
  const drawDesignInk = (ctx, cw, ch, src) => {
    if (!src || !src.width) return
    const sw = src.naturalWidth || src.width
    const sh = src.naturalHeight || src.height
    const margin = 64
    const bw = cw - margin
    const bh = ch - margin
    const cover = Math.max(bw / sw, bh / sh)
    const iw = sw * cover
    const ih = sh * cover
    const a = 1.15
    const d = 1.12
    const e = 0.54 * cw - 0.65 * bw
    const f = 0.53 * ch - 0.56 * bh + ch * 0.02
    const tan = Math.tan((2.3 * Math.PI) / 180)
    const b = tan * a
    const s = 0.95
    const a2 = s * a
    const e2 = e + (1 - s) * a * ((bw + iw) / 2)
    const f2 = f - tan * a * ((bw + iw) / 2)
    ctx.save()
    ctx.transform(a2, b, 0, d, e2, f2)
    ctx.drawImage(src, (bw - iw) / 2, (bh - ih) / 2, iw, ih)
    ctx.restore()
  }

  const drawPortraitCover = (ctx, cw, ch) => {
    const img = portraitImgRef.current
    if (!img || !img.complete || !img.naturalWidth) return
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
    const w = img.naturalWidth * scale
    const h = img.naturalHeight * scale
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h)
  }

  const renderInk = () => {
    const canvas = canvasRef.current
    const mask = maskRef.current
    const ink = inkRef.current
    if (!canvas || !canvas.isConnected || !mask || !ink) {
      // Canvas was unmounted (mode switch) while this loop was scheduled on
      // the old element - stop so a fresh loop can start on the new canvas.
      rafRef.current = null
      return
    }
    const ctx = canvas.getContext('2d')
    const mctx = mask.getContext('2d')
    const ictx = ink.getContext('2d')
    const cw = canvas.clientWidth
    const ch = canvas.clientHeight
    const now = performance.now()

    const dpr = window.devicePixelRatio || 1
    if (canvas.width !== cw * dpr) {
      canvas.width = cw * dpr
      canvas.height = ch * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      mask.width = cw * dpr
      mask.height = ch * dpr
      mctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ink.width = cw * dpr
      ink.height = ch * dpr
      ictx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    ctx.clearRect(0, 0, cw, ch)
    mctx.clearRect(0, 0, cw, ch)
    ictx.clearRect(0, 0, cw, ch)

    // base layer: the portrait, so the rest of the photo stays visible
    drawPortraitCover(ctx, cw, ch)

    const pts = trailRef.current
    if (pts.length) {
      // soft ink-pen stroke that follows the cursor (tip-anchored) and disperses in water
      mctx.lineCap = 'round'
      mctx.lineJoin = 'round'
      mctx.shadowColor = 'rgba(255,255,255,1)'
      mctx.shadowBlur = 14
      for (let i = 1; i < pts.length; i++) {
        const p0 = pts[i - 1]
        const p1 = pts[i]
        const age = now - p1.birth
        const t = Math.max(0, 1 - age / STROKE_LIFE)
        const a = Math.pow(t, 0.6)
        mctx.strokeStyle = `rgba(255,255,255,${a})`
        mctx.lineWidth = 20 + 46 * t
        mctx.beginPath()
        mctx.moveTo(p0.x, p0.y)
        mctx.lineTo(p1.x, p1.y)
        mctx.stroke()
      }
      // build the revealed region: a solid backdrop (hides the portrait in the
      // gaps the source PNG doesn't cover) with the source drawn on top
      const activeImg = showDesign
        ? designCanvasRef.current
        : showMatrix
        ? codeCanvasRef.current
        : showTest
        ? testCanvasRef.current
        : inkCanvasRef.current
      ictx.clearRect(0, 0, cw, ch)
      ictx.fillStyle = showDesign ? '#ffffff' : showMatrix ? '#000000' : showTest ? '#070204' : '#001428'
      ictx.fillRect(0, 0, cw, ch)
      if (showDesign) drawDesignInk(ictx, cw, ch, activeImg)
      else drawInkCover(ictx, cw, ch, activeImg, showTest ? 0.92 : showMatrix ? 0.95 : 1.07, 0)
      ictx.globalCompositeOperation = 'destination-in'
      ictx.drawImage(mask, 0, 0, cw, ch)
      ictx.globalCompositeOperation = 'source-over'
      // paint it over the portrait so the revealed area hides the about image there
      ctx.drawImage(ink, 0, 0, cw, ch)
    }

    trailRef.current = pts.filter((p) => now - p.birth <= STROKE_LIFE)
    if (trailRef.current.length) {
      rafRef.current = requestAnimationFrame(renderInk)
    } else {
      rafRef.current = null
      // no stroke: leave just the portrait visible
      ctx.clearRect(0, 0, cw, ch)
      drawPortraitCover(ctx, cw, ch)
    }
  }

    const handleMove = (e) => {
    if (!showBlueprint && !showMatrix && !showDesign && !showTest) return
    const canvas = canvasRef.current
    if (!canvas) return
    const r = canvas.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    const starting = trailRef.current.length === 0
    trailRef.current.push({ x, y, birth: performance.now() })
    if (!rafRef.current) rafRef.current = requestAnimationFrame(renderInk)
  }

  const handleLeave = () => {
    trailRef.current = []
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    const canvas = canvasRef.current
    if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
    // pointer left the photo : let the ring pick up its rotation again
    letOrbitRun()
  }

  // Touch has no hover, so mirror the pointer experience while a finger is on
  // the photo: freeze the orbit and feed the touch point into the same ink
  // trail. The group's `touch-action: none` (mobile CSS) keeps the page from
  // scrolling under the drag, which is what makes the effect usable.
  const handleTouchStart = (event) => {
    const touch = event.touches[0]
    if (!touch) return
    holdOrbit()
    handleMove(touch)
  }

  const handleTouchMove = (event) => {
    const touch = event.touches[0]
    if (!touch) return
    handleMove(touch)
  }

  const handleTouchEnd = (event) => {
    if (event.touches.length) return
    handleLeave()
  }

  // Kept in step with the Home hero's tech marquee
  // (components/ui/TechMarquee.jsx) so the two never contradict each other.
  // Three groups, not five: he builds whole applications end to end rather than
  // specialising in one tier, so backend and frontend are one continuous stack
  // and splitting them left two items stranded next to seven. "Data" and
  // "Shipping" stay apart because they answer a different question - what the
  // data lives in, and where the code is tracked and runs.
  const skills = {
    Development: ['Python', 'Django', 'React', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS'],
    Data: ['PostgreSQL', 'SQLite', 'Supabase'],
    Shipping: ['GitHub', 'Render', 'Railway'],
  }

  const philosophy = [
    { title: 'Problem-Solving Mindset', description: "I don't just write code : I solve problems. Every feature starts with understanding the problem, not jumping to implementation." },
    { title: 'Love for Learning', description: "I learn by building. Every project teaches me something new. I apply what I learn to real projects, not tutorial clones." },
    { title: 'Backend-First Approach', description: 'A strong backend makes everything else easier. I focus on clean architecture, validation, and scalable database design.' },
    { title: 'Attention to Detail', description: 'Error handling, edge cases, performance, and UX : these details separate good software from great software.' },
    { title: 'Real-World Applications', description: "I've built applications for real businesses and understand the difference between a demo and a production app." },
    { title: 'Clean Code', description: 'I write code other developers can read and maintain, following best practices and keeping my codebase organized.' },
  ]

  const swooshShadow =
    '10px 10px 0px #07bccc, 15px 15px 0px #e601c0, 20px 20px 0px #e9019a, 25px 25px 0px #f40468, 45px 45px 10px #f40468'
  const swooshClass =
    'relative z-70 inline-block cursor-pointer font-[family-name:Poppins] font-bold italic text-xl md:text-2xl tracking-widest text-[#0A3332] transition-all duration-200'

  return (
    <>
      <Helmet>
        <title>About · Meet Mohammed Fawaz O | Python Full Stack Developer</title>
        <meta name="description" content="Learn about Mohammed Fawaz O, a Python Full Stack Developer building production-ready web applications with Django and React." />
      </Helmet>


      {/* Hero */}
      {showBlueprint && <BlueprintCursorCrosshair />}
      <section
        id="about-hero-section"
        onClick={deactivateMode}
        className={"relative pt-6 lg:pt-8 pb-7 lg:pb-0.5 overflow-hidden transition-colors duration-700 ease-out " + (showMatrix ? "bg-black matrix-mode" : showBlueprint ? "bg-[#001428]" : showTest ? "bg-[#070204]" : "bg-[#F5F5DC]")}>
        {/* Design-mode graph-paper grid covering the whole hero */}
        {showDesign && (
          <div className="design-hero-grid absolute inset-0 z-0 pointer-events-none" />
        )}
        {/* Fade spots over the grid for an uneven, hand-inked look */}
        {showDesign && gridFadeSpots.map((s, i) => (
          <div
            key={i}
            className="absolute z-0 pointer-events-none"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              transform: 'translate(-50%, -50%)',
              filter: 'blur(12px)',
              background: `radial-gradient(circle, rgba(255, 255, 255, ${s.opacity}) 0%, transparent 70%)`,
            }}
          />
        ))}
        <style>{`
          .design-hero-grid {
            background-image:
              linear-gradient(to right, rgba(36,107,255,0.10) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(36,107,255,0.10) 1px, transparent 1px);
            background-size: 22px 22px;
          }
        `}</style>
        {designModeActive && (
          <div
            className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-80 pointer-events-none select-none opacity-60"
            aria-hidden="true"
          >
            <div className="design-select-frame relative w-9 h-9">
              <div className="relative w-full h-full border-2 border-black overflow-hidden">
                <span
                  aria-hidden="true"
                  className="design-select-fill absolute inset-0"
                  style={{ backgroundColor: '#1e40af' }}
                />
                <span
                  className="absolute inset-0 flex items-center justify-center text-3xl font-bold"
                  style={{
                    fontFamily: '"Times New Roman", Times, serif',
                    WebkitTextStroke: '1.5px #000',
                    color: 'transparent',
                  }}
                >
                  T
                </span>
              </div>
              <span className="absolute -left-1 -top-1 w-2 h-2 bg-white border border-black" />
              <span className="absolute -right-1 -top-1 w-2 h-2 bg-white border border-black" />
              <span className="absolute -left-1 -bottom-1 w-2 h-2 bg-white border border-black" />
              <span className="absolute -right-1 -bottom-1 w-2 h-2 bg-white border border-black" />
            </div>
          </div>
        )}
        {designModeActive && (
          <HoverColorAnnot label="try logo here?" arrow={ARROW_A} style={{ position: 'absolute', left: '2rem', top: '3.5rem' }} />
        )}
        <div
          className="absolute pointer-events-none"
          style={{ top: '-15%', right: '-5%', width: 'min(650px, 120vw)', height: 'min(650px, 120vw)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(35,105,102,0.10) 0%, transparent 70%)' }}
        />
        <div className={"absolute inset-0 z-45 pointer-events-none overflow-hidden transition-opacity duration-500 ease-out " + (showMatrix ? "opacity-100" : "opacity-0")}>
          {showMatrix && <MatrixRain variant="cyan" fixedColor="#03A062" />}
        </div>
        <AnimatePresence>
          {showBlueprint && (
            <motion.div
              key="blueprint-bg"
              className="absolute inset-0 z-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <AliveBlueprintBackground className="absolute inset-0 min-h-0! flex-none!" />
            </motion.div>
          )}
          {showTest && (
            <motion.div
              key="test-bg"
              className="absolute inset-0 z-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <TestModeBackground className="absolute inset-0 min-h-0! flex-none!" />
            </motion.div>
          )}
        </AnimatePresence>
        {showTest && <TestErrorPopups />}
        <Container size="lg" className="px-4! sm:px-6! lg:px-8!">
          <div className="grid gap-5 lg:grid-cols-2 lg:gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className={"relative z-70 pt-20 md:pt-0 max-lg:text-center transition-[padding,margin] duration-700 ease-out" + (showMatrix || showBlueprint ? " lg:pl-12 max-lg:px-4" : "") + (showBlueprint ? " bp-hero-copy mt-8 lg:mt-16" : "")}>
              {designModeActive && (
                <div className="absolute left-1 top-0 -translate-y-full z-80 flex items-center pointer-events-none">
                  <TypingLoader />
                </div>
              )}
              {designModeActive ? (
                <svg
                  viewBox="0 0 1200 350"
                  className="w-full max-w-130 sm:max-w-145 md:max-w-157.5 lg:max-w-170 h-auto overflow-visible shrink-0"
                  aria-label="Mohammed Fawaz O"
                >
                  <defs>
                    <pattern
                      id="blueprintHatch"
                      width="9"
                      height="9"
                      patternUnits="userSpaceOnUse"
                      patternTransform="rotate(0)"
                    >
                      <line
                        x1="0"
                        y1="9"
                        x2="9"
                        y2="0"
                        stroke="#263238"
                        strokeWidth="1.2"
                      />
                    </pattern>

                    <filter id="roughText">
                      <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.025"
                        numOctaves="2"
                        seed="4"
                        result="noise"
                      />
                      <feDisplacementMap
                        in="SourceGraphic"
                        in2="noise"
                        scale="1.4"
                      />
                    </filter>
                    <filter id="markerRough" filterUnits="userSpaceOnUse" x="0" y="0" width="1200" height="350">
                      <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.012 0.06"
                        numOctaves="3"
                        seed="7"
                        result="noise"
                      />
                      <feDisplacementMap
                        in="SourceGraphic"
                        in2="noise"
                        scale="7"
                        xChannelSelector="R"
                        yChannelSelector="G"
                        result="disp"
                      />
                      <feGaussianBlur in="disp" stdDeviation="0.5" />
                    </filter>
                    <filter id="mohammFill" x="-20%" y="-20%" width="140%" height="140%">
                      <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="4" result="rn" />
                      <feDisplacementMap in="SourceGraphic" in2="rn" scale="1.6" result="rough" />
                      <feTurbulence type="fractalNoise" baseFrequency="0.45" numOctaves="2" seed="5" result="n" />
                      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 8 -3.5" result="mask" />
                      <feFlood floodColor="#ffffff" result="white" />
                      <feComposite in="white" in2="mask" operator="in" result="spots" />
                      <feComposite in="spots" in2="rough" operator="in" result="spotsIn" />
                      <feMerge>
                        <feMergeNode in="rough" />
                        <feMergeNode in="spotsIn" />
                      </feMerge>
                    </filter>
                    <filter id="mohammSolid" x="-20%" y="-20%" width="140%" height="140%">
                      <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="4" result="rn" />
                      <feDisplacementMap in="SourceGraphic" in2="rn" scale="1.6" />
                    </filter>
                  </defs>

                  <line
                    x1="15"
                    y1="10"
                    x2="1185"
                    y2="10"
                    stroke="#B7C2C7"
                    strokeWidth="1"
                    strokeDasharray="5 5"
                  />

                  <text
                    x="20"
                    y="140"
                    fontFamily="var(--font-display)"
                    fontSize="120"
                    fontWeight="800"
                    letterSpacing="1.5"
                    fill="#28282B"
                    stroke="#263238"
                    strokeWidth="4"
                    paintOrder="stroke"
                    filter="url(#mohammFill)"
                  >
                    <tspan fill="#28282B">MOHAM</tspan><tspan fill="#A9A9A9">MED</tspan>
                  </text>
                  <text
                    x="20"
                    y="140"
                    fontFamily="var(--font-display)"
                    fontSize="120"
                    fontWeight="800"
                    letterSpacing="1.5"
                    fill="#28282B"
                    stroke="#263238"
                    strokeWidth="4"
                    paintOrder="stroke"
                    filter="url(#mohammSolid)"
                  >
                    MOH
                  </text>
                  <path
                    d="M740 150 C 850 157, 960 145, 1040 153 S 1120 147, 1160 150"
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="25"
                    strokeLinecap="square"
                    opacity="0.82"
                    filter="url(#markerRough)"
                  />

                  <text
                    x="20"
                    y="315"
                    fontFamily="var(--font-display)"
                    fontSize="130"
                    fontWeight="800"
                    letterSpacing="2.5"
                    fill="none"
                    stroke="#9CA3AF"
                    strokeWidth="0.5"
                    paintOrder="stroke"
                  >
                    FAWAZ O
                  </text>

                  <rect
                    x="12"
                    y="16"
                    width="1176"
                    height="318"
                    fill="none"
                    stroke="#AAB6BC"
                    strokeWidth="1"
                    strokeDasharray="4 5"
                  />

                  <rect x="7" y="11" width="10" height="10" fill="#FFFFFF" stroke="#2477D4" />
                  <rect x="1183" y="11" width="10" height="10" fill="#FFFFFF" stroke="#2477D4" />
                  <rect x="7" y="329" width="10" height="10" fill="#FFFFFF" stroke="#2477D4" />
                  <rect x="1183" y="329" width="10" height="10" fill="#FFFFFF" stroke="#2477D4" />

                </svg>
              ) : showTest ? (
                <div className="p-0 min-h-0">
                  <RedGlitchHeading
                    text="MOHAMMED FAWAZ O"
                    variants={[
                      'मोहम्मद फ़वाज़ ओ',
                      'മുഹമ്മദ് ഫവാസ് ഒ',
                      'محمد فواز أو',
                      'モハメド・ファワズ・オ',
                    ]}
                  />
                </div>
              ) : (
                <h1 className={"font-(family-name:--font-display) leading-[1.02]! font-semibold tracking-tight uppercase lg:whitespace-nowrap max-lg:text-balance transition-[color,font-size,letter-spacing,opacity] duration-700 ease-out " + (showMatrix ? "text-[27px] max-lg:sm:text-[36px] lg:text-[66px] text-white blueprint-hero-type hero-heading" : showBlueprint ? "text-[30px] max-lg:sm:text-[42px] lg:text-[42px] text-white blueprint-hero-type" : "text-[30px] max-lg:sm:text-[42px] lg:text-[42px] text-[#001428]")}>
                  Mohammed Fawaz O
                </h1>
              )}
              {showTest ? (
                <NeonRGBTextEffect
                  key={introReplayKey}
                  className="font-light mt-2 max-w-xl leading-relaxed font-mono max-lg:mx-auto max-lg:mt-3 max-lg:text-pretty"
                >
                  Python Full Stack Developer from{' '}
                  <span className="relative inline-block whitespace-nowrap">
                    Kerala, India
                    {designModeActive && (
                      <motion.svg
                        className="kerala-oval"
                        viewBox="0 0 200 80"
                        fill="none"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        style={{
                          position: 'absolute',
                          inset: '-10px -22px',
                          width: 'calc(100% + 44px)',
                          height: 'calc(100% + 20px)',
                          zIndex: -1,
                          pointerEvents: 'none',
                        }}
                      >
                        <motion.path
                          d="M12 60 C40 36 70 26 100 32 C132 38 162 30 188 22"
                          stroke="#54B7E8"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                        />
                        <motion.path
                          d="M30 36 C72 16 132 12 172 23"
                          stroke="#54B7E8"
                          strokeWidth="1.6"
                          strokeLinecap="square"
                          strokeLinejoin="round"
                          fill="none"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        />
                      </motion.svg>
                    )}
                  </span>
                  , building production-ready web applications with Django, React, and clean architecture.
                </NeonRGBTextEffect>
              ) : (
              <p key={introReplayKey} className={"text-[16px] lg:text-[20px] font-light mt-2 max-w-xl leading-relaxed max-lg:mx-auto max-lg:mt-3 max-lg:text-pretty transition-[color,font-size,margin,letter-spacing,opacity] duration-700 ease-out " + (showMatrix ? "text-white/80 blueprint-hero-type hero-description" : showBlueprint ? "bp-hero-desc text-white/80 blueprint-hero-type max-md:text-[15px]" : "text-[#323232]")}>
                {showBlueprint ? (<span className="inline-block border border-dashed border-[#00d2ff] px-2 py-0.5 text-[#00d2ff]">Python</span>) : showMatrix ? (<span className="keyword">Python</span>) : 'Python'} Full Stack Developer from{' '}
                <span className="relative inline-block whitespace-nowrap">
                  Kerala, India
                  {designModeActive && (
                    <motion.svg
                      className="kerala-oval"
                      viewBox="0 0 200 80"
                      fill="none"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        position: 'absolute',
                        inset: '-10px -22px',
                        width: 'calc(100% + 44px)',
                        height: 'calc(100% + 20px)',
                        overflow: 'visible',
                        pointerEvents: 'none',
                      }}
                    >
                      <motion.path
                        d="M20 46 C10 24 58 8 104 10 C158 12 193 26 183 49 C174 71 130 75 90 70 C48 65 14 62 24 42"
                        stroke="#54B7E8"
                        strokeWidth="2.2"
                        strokeLinecap="square"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1] }}
                      />
                      <motion.path
                        d="M62 73 C112 80 166 73 185 47"
                        stroke="#54B7E8"
                        strokeWidth="1.6"
                        strokeLinecap="square"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                      />
                      <motion.path
                        d="M30 36 C72 16 132 12 172 23"
                        stroke="#54B7E8"
                        strokeWidth="1.6"
                        strokeLinecap="square"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                      />
                    </motion.svg>
                  )}
                </span>
                , building{' '}
                <span className="relative inline-block">
                  {designModeActive && (
                    <motion.span
                      aria-hidden="true"
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                      style={{
                        position: 'absolute',
                        left: '-4px',
                        right: '-4px',
                        top: '32%',
                        height: '58%',
                        background:
                          'linear-gradient(105deg, rgba(255, 215, 0, 0) 0%, rgba(250, 204, 21, 0.75) 6%, rgba(255, 226, 80, 0.88) 50%, rgba(245, 185, 20, 0.7) 94%, rgba(245, 185, 20, 0) 100%)',
                        transform: 'rotate(-1deg)',
                        transformOrigin: 'left center',
                        borderRadius: '2px 4px 3px 5px',
                        mixBlendMode: 'multiply',
                        pointerEvents: 'none',
                        zIndex: 0,
                        boxShadow: '0 1px 4px rgba(250, 204, 21, 0.3)',
                      }}
                    />
                  )}
                  <span className="relative" style={{ zIndex: 1 }}>production-ready</span>
                </span>{' '}
                web applications
                with{' '}
                <span className="relative inline-block">
                  {showBlueprint ? (
                    <span className="inline-block border border-dashed border-[#00d2ff] px-2 py-0.5 text-[#00d2ff]">Django,</span>
                  ) : showMatrix ? (
                    <span className="keyword">Django,</span>
                  ) : (
                    <span className="relative inline-block">
                      Django,
                      {designModeActive && (
                        <motion.span
                          aria-hidden="true"
                          initial={{ scaleX: 0, opacity: 0 }}
                          animate={{ scaleX: 1, opacity: 1 }}
                          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                          style={{
                            position: 'absolute',
                            left: '2px',
                            right: '2px',
                            bottom: '2px',
                            height: '2.5px',
                            background: '#246bff',
                            transform: 'rotate(-0.8deg) skewX(-8deg)',
                            transformOrigin: 'left center',
                            borderRadius: '1px',
                            pointerEvents: 'none',
                          }}
                        />
                      )}
                    </span>
                  )}
                  {' '}
                  {showBlueprint ? (
                    <span className="inline-block border border-dashed border-[#00d2ff] px-2 py-0.5 text-[#00d2ff]">React,</span>
                  ) : showMatrix ? (
                    <span className="keyword">React,</span>
                  ) : (
                    <span className="relative inline-block">
                      React,
                      {designModeActive && (
                        <motion.span
                          aria-hidden="true"
                          initial={{ scaleX: 0, opacity: 0 }}
                          animate={{ scaleX: 1, opacity: 1 }}
                          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                          style={{
                            position: 'absolute',
                            left: '2px',
                            right: '2px',
                            bottom: '2px',
                            height: '2.5px',
                            background: '#246bff',
                            transform: 'rotate(-0.8deg) skewX(-8deg)',
                            transformOrigin: 'left center',
                            borderRadius: '1px',
                            pointerEvents: 'none',
                          }}
                        />
                      )}
                    </span>
                  )}
                </span>
                 and clean architecture.
              </p>
              )}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className={"mt-5 transition-[margin] duration-700 ease-out max-lg:flex max-lg:justify-center max-lg:mt-5" + (showMatrix || showBlueprint ? " -ml-4 lg:-ml-12 max-lg:-mx-4" : "")}
              >
                <AnimatePresence mode="wait">
                  {showDesign ? (
                    <motion.div
                      key="design"
                      className="flex flex-wrap items-center gap-3 lg:gap-4 mt-4 lg:mt-6 max-lg:justify-center"
                      initial={{ opacity: 0, scale: 1.45, filter: 'blur(8px)', x: -24 }}
                      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', x: 0 }}
                      exit={{ opacity: 0, scale: 0.65, filter: 'blur(10px)', x: 24 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 1.45, filter: 'blur(8px)', x: -24 }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', x: 0 }}
                        exit={{ opacity: 0, scale: 0.65, filter: 'blur(10px)', x: 24 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <CrayonButton label="View My Work" href="/projects" note="hover color?" />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, scale: 1.45, filter: 'blur(8px)', x: -24 }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', x: 0 }}
                        exit={{ opacity: 0, scale: 0.65, filter: 'blur(10px)', x: 24 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <CrayonButton label="Resume" href="/media/resume.pdf" download accent="pink" note="outline color?" hoverDownload className="crayon-resume" />
                      </motion.div>
                    </motion.div>
                  ) : (
                      <motion.div
key="default"
                      className="flex flex-wrap items-center gap-3 lg:gap-0"
                        initial={{ opacity: 0, y: 16, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -12, scale: 0.82, filter: 'blur(5px)' }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <AnimatePresence mode="wait" initial={false}>
                          {showTest ? (
                            <motion.div
                              key="test"
                              className="flex flex-wrap items-center gap-3 lg:gap-6 max-lg:justify-center"
                              initial={{ opacity: 0, scale: 0.97, filter: 'blur(6px)' }}
                              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                              exit={{ opacity: 0, scale: 0.97, filter: 'blur(6px)' }}
                              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                            >
<GlitchScanGridButton
label="./view-projects"
                                badge="RUN // 01"
                                index={1}
                                icon={<ArrowRight size={17} strokeWidth={2.4} />}
                                onClick={(e) => { e.stopPropagation(); navigate('/projects'); }}
                              />
                              <GlitchScanGridButton
                                label="RESUME.EXE"
                                badge="GET//PDF"
                                index={2}
                                icon={<Download size={17} strokeWidth={2.4} />}
                                onClick={(e) => { e.stopPropagation(); handleResumeDownload(e); }}
                              />
                            </motion.div>
                          ) : showBlueprint ? (
                            <motion.div
                              key="bp"
                              className="about-bp-actions flex flex-wrap items-center -mt-4 gap-3 lg:gap-0 max-lg:justify-center"
                              initial={{ opacity: 0, scale: 0.97, filter: 'blur(6px)' }}
                              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                              exit={{ opacity: 0, scale: 0.97, filter: 'blur(6px)' }}
                              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                            >
                              <span style={{ transform: 'scale(0.85) translateY(-6px)', transformOrigin: 'center' }} className="bp-action inline-block">
                                <BlueprintPillButton label="VIEW_MY_WORK" onClick={(e) => { e.stopPropagation(); navigate('/projects'); }} />
                              </span>
                              <div className="w-0 lg:w-12" />
                              <span className="bp-action lg:-ml-20 inline-block" style={{ transform: 'scale(0.85) translateY(-6px)', transformOrigin: 'center' }}>
                                <BlueprintPillButton label="RESUME" onClick={handleResumeDownload} heightOnRight hoverIcon={<Download />} />
                              </span>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="def"
                              className={"flex items-center justify-end gap-4 max-lg:flex-wrap max-lg:justify-center" + (showMatrix ? " ml-12 max-lg:mx-12 max-lg:ml-0" : "")}
                              initial={{ opacity: 0, scale: 0.97, filter: 'blur(6px)' }}
                              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                              exit={{ opacity: 0, scale: 0.97, filter: 'blur(6px)' }}
                              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                            >
                              <MorphyButton onClick={(e) => { e.stopPropagation(); navigate('/projects'); }} className={showMatrix ? " btn-matrix" : ""} morphStyle="icon" morphDir="down-left" activeIcon={<ArrowRight />} blueprint={showBlueprint} disableMorph={showMatrix} nudgeAxis="x" hoverNarrow>
                                {showMatrix ? (
                                  <>
                                    <span className="matrix-btn-label">View My Work</span>
                                    <span className="matrix-dl-wrap">
                                      <ArrowRight className="matrix-dl-icon matrix-dl-icon--flat" />
                                    </span>
                                  </>
                                ) : "View My Work"}
                              </MorphyButton>
                              <MorphyButton onClick={handleResumeDownload} className={showMatrix ? " btn-matrix" : ""} morphStyle="icon" activeIcon={<Download />} morphDir="down-left" blueprint={showBlueprint} disableMorph={showMatrix} hoverNarrow>
                                {showMatrix ? (
                                  <>
                                    <span className="matrix-btn-label">Resume</span>
                                    <span className="matrix-dl-wrap">
                                      <Download className="matrix-dl-icon" />
                                    </span>
                                  </>
                                ) : "Resume"}
                              </MorphyButton>
                            </motion.div>
                          )}
                      </AnimatePresence>
                      </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>

            {/* This column is the tall one, so the hero's height is set by the
                space above the photo. Trimming that slack shortens the hero for
                real - the section below simply follows, with nothing overlaid. */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-60 flex justify-end mt-0 max-lg:-mx-4 lg:mt-[7mm]"
            >
              <div
                ref={groupRef}
                className={"about-photo-group group relative w-full max-w-135" + (showBlueprint ? " bp-on" : "") + (anyModeOn ? " is-mode-on" : "")}
                onMouseMove={handleMove}
                onMouseLeave={handleLeave}
                onMouseEnter={holdOrbit}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
                onFocus={holdOrbit}
                onBlur={letOrbitRun}
              >
                <div
                  className={"about-photo-card relative min-h-95 sm:min-h-105 lg:min-h-100 " + (!showBlueprint && !showMatrix && !showDesign && !showTest ? 'rounded-2xl p-2 bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5),0_18px_36px_-18px_rgba(0,0,0,0.4)]' : '')}
                  style={{
                    perspective: '1000px',
                    transition: 'box-shadow 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
                    ...((!showBlueprint && !showMatrix && !showDesign && !showTest)
                      ? {
                          maskImage: 'linear-gradient(to bottom, #000 0%, #000 80%, rgba(0, 0, 0, 0.6) 95%, transparent 100%)',
                          WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, #000 80%, rgba(0, 0, 0, 0.6) 95%, transparent 100%)',
                        }
                      : {}),
                  }}
                  >
                    <div
                      className={"relative overflow-hidden min-h-95 sm:min-h-105 lg:min-h-100 rounded-xl transition-colors duration-500 ease-out"}
                    >
                  {(showBlueprint || showMatrix || showDesign || showTest) && (
                    <canvas
                      ref={canvasRef}
                      className="blueprint-ink absolute inset-0 w-full h-full z-25 pointer-events-none"
                      aria-hidden="true"
                    />
                  )}
                  <img
                    src="/media/about%20default.png"
                    alt="Mohammed Fawaz O"
                    className="relative z-20 w-full h-full min-h-95 sm:min-h-105 lg:min-h-100 object-cover cursor-pointer"
                  />
                  <div
                    aria-hidden="true"
                    className={
                      "pointer-events-none absolute inset-x-0 bottom-0 z-21 h-4 bg-linear-to-t from-white via-white/70 to-transparent transition-opacity duration-700 ease-out " +
                      (showBlueprint || showMatrix || showDesign || showTest
                        ? "opacity-0"
                        : "opacity-100")
                    }
                  />
                  </div>
                </div>
                <div className="about-photo-orbit">
                <motion.div className="about-photo-orbit-spin" ref={orbitWrapRef} style={{ rotate: spin }}>
                <motion.button
                  ref={modeButtonRefs.blueprint}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); toggleMode('blueprint') }}
                  aria-label="Toggle blueprint"
                  aria-pressed={showBlueprint}
                  className={
                    // Blueprint mode is cyan wireframe on transparent everywhere
                    // else - the nav, the RESUME pill, the floating CTA - so this
                    // toggle is drawn from the same sheet: the theme's own paper
                    // colour and grid, a cyan rule, a dashed survey circle and
                    // the corner crop marks of a drawing. No solid blue chip, no
                    // white dot grid.
                    'about-photo-btn about-photo-btn--blueprint w-11 h-11 rounded-full overflow-hidden ' +
                    'flex items-center justify-center border border-[#00d2ff]/70 text-[#00d2ff] ' +
                    // #001428 is the blueprint surface (.about-mode-blueprint),
                    // with the same cyan grid the sections are drawn on.
                    'bg-[#001428] backdrop-blur-md ' +
                    'shadow-[0_0_15px_rgba(0,210,255,0.15)] ' +
                    'hover:shadow-[0_0_26px_rgba(0,210,255,0.45)] hover:scale-110' +
                    // Engaged: the theme's card fill (rgba(0,52,102,.35)) over
                    // the paper, with the cyan rule at full strength.
                    (showBlueprint
                      ? ' is-active bg-[rgba(0,52,102,0.45)] border-[#00d2ff] shadow-[0_0_26px_rgba(0,210,255,0.55)] ring-2 ring-[#00d2ff]/60 scale-105'
                      : '') +
                    (showMatrix || showDesign || showTest
                      ? ' opacity-0 scale-50 pointer-events-none is-hidden'
                      : '')
                  }
                  style={{
                    rotate: counterSpin,
                    ...(dockedBtn === 'blueprint' ? { x: dockX, y: dockY } : {}),
                    // Blueprint paper: the theme's own cyan grid, at half its
                    // cell so a 44px chip still shows a few lines.
                    backgroundImage:
                      'linear-gradient(to right, rgba(0,210,255,0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,210,255,0.14) 1px, transparent 1px)',
                    backgroundSize: '14px 14px, 14px 14px',
                    backgroundPosition: '0 0, 0 0',
                    backgroundRepeat: 'repeat, repeat',
                  }}
                >
                  {/* The drafting marks on the sheet: a crosshair through the
                      centre, a dashed survey circle and the four crop marks in
                      the corners. */}
                  <svg viewBox="0 0 44 44" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full">
                    <line x1="4" y1="22" x2="40" y2="22" stroke="#00d2ff" strokeWidth="0.6" opacity="0.45" />
                    <line x1="22" y1="4" x2="22" y2="40" stroke="#00d2ff" strokeWidth="0.6" opacity="0.45" />
                    <circle cx="22" cy="22" r="9.5" fill="none" stroke="#00d2ff" strokeWidth="0.8" strokeDasharray="3 2.5" opacity="0.9" />
                    <path d="M7 12 V7 H12 M32 7 H37 V12 M37 32 V37 H32 M12 37 H7 V32" fill="none" stroke="#00d2ff" strokeWidth="0.9" opacity="0.75" />
                  </svg>
                </motion.button>
                <motion.button
                  ref={modeButtonRefs.matrix}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); toggleMode('matrix') }}
                  aria-label="Toggle matrix rain"
                  aria-pressed={showMatrix}
                  style={{ rotate: counterSpin, ...(dockedBtn === 'matrix' ? { x: dockX, y: dockY } : {}) }}
                  className={"about-photo-btn about-photo-btn--code w-11 h-11 rounded-full overflow-hidden backdrop-blur-md bg-black border border-[#03A062]/60 text-[#03A062] flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.25)] hover:bg-white/10 hover:scale-110" + (showMatrix ? " is-active ring-2 ring-[#4ade80] scale-105" : "") + (showBlueprint || showDesign || showTest ? " opacity-0 scale-50 pointer-events-none is-hidden" : "")}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-full h-full" fontFamily="'Courier New', monospace" fontSize="3.8" fontWeight="700" textAnchor="middle">
                    {[
                      { x: 1.8, chars: ['ﾑ', 'ｦ', 'ｼ', 'ﾅ', 'ﾁ', 'ﾂ'] },
                      { x: 5.2, chars: ['ﾈ', 'Z', '2', '8', 'ﾎ', '4'] },
                      { x: 8.6, chars: ['ﾊ', 'ﾐ', 'ﾑ', 'ｼ', 'ﾝ', 'ﾛ'] },
                      { x: 12, chars: ['ﾂ', 'ﾊ', 'ﾐ', 'ﾑ', 'ｼ', 'ﾝ'] },
                      { x: 15.4, chars: ['0', '7', 'ｦ', '9', 'ｼ', 'ﾄ'] },
                      { x: 18.8, chars: ['3', 'ﾑ', 'ﾈ', '2', 'Z', '8'] },
                      { x: 22.2, chars: ['6', 'ﾐ', 'ｼ', 'ﾝ', 'ﾛ', 'ｦ'] },
                    ].map((col, ci) =>
                      col.chars.map((ch, i) => (
                        <text key={`${ci}-${i}`} x={col.x} y={3.5 + i * 3.9} fill="currentColor" opacity={0.5 + i * 0.07}>
                          {ch}
                        </text>
                      ))
                    )}
</svg>
                </motion.button>
                <motion.button
                  ref={modeButtonRefs.design}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMode('design')
                  }}
                  aria-label="Toggle design"
                  aria-pressed={showDesign}
                  style={{ rotate: counterSpin, ...(dockedBtn === 'design' ? { x: dockX, y: dockY } : {}) }}
                  className={"about-photo-btn about-photo-btn--design w-11 h-11 rounded-full backdrop-blur-md bg-white/15 border border-white/50 flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.25)] hover:bg-white/30 hover:scale-110" + (showDesign ? " is-active ring-2 ring-white scale-105 bg-white/25" : "") + (showBlueprint || showMatrix || showTest ? " opacity-0 scale-50 pointer-events-none is-hidden" : "")}
                >
                  <svg viewBox="0 0 38 57" aria-hidden="true" className="w-5.5 h-8.25">
                    <path fill="#1abcfe" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" />
                    <path fill="#0acf83" d="M0 47.5a9.5 9.5 0 0 1 9.5-9.5H19v9.5a9.5 9.5 0 1 1-19 0z" />
                    <path fill="#ff7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" />
                    <path fill="#f24e1e" d="M0 9.5A9.5 9.5 0 0 1 9.5 0H19v19H9.5A9.5 9.5 0 0 1 0 9.5z" />
                    <path fill="#a259ff" d="M0 28.5A9.5 9.5 0 0 1 9.5 19H19v19H9.5A9.5 9.5 0 0 1 0 28.5z" />
                  </svg>
                </motion.button>
                <motion.button
                  ref={modeButtonRefs.test}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); toggleMode('test') }}
                  aria-label="Toggle test overlay"
                  aria-pressed={showTest}
                  style={{ rotate: counterSpin, ...(dockedBtn === 'test' ? { x: dockX, y: dockY } : {}) }}
                  className={"about-photo-btn about-photo-btn--red w-11 h-11 rounded-full backdrop-blur-md bg-[#D2042D]/80 border border-white/50 text-[#F5F7F7] flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.25)] hover:bg-transparent hover:scale-110" + (showTest ? " is-active ring-2 ring-white scale-105" : "") + (showBlueprint || showMatrix || showDesign ? " opacity-0 scale-50 pointer-events-none is-hidden" : "")}
                >
                  <Bug size={19} strokeWidth={2.4} className="drop-shadow-[0_0_8px_#FF3B47]" />
                </motion.button>
                </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
        {designModeActive && (
          <div className="absolute bottom-28 left-[60%] -translate-x-1/2 z-80 pointer-events-none select-none">
            <div className="relative inline-flex flex-col items-center">
              <motion.span
                initial={{ opacity: 0, scale: 0.75, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.15 }}
                style={{
                  color: '#e6019a',
                  fontFamily: "'Comic Sans MS', 'Segoe Print', 'Bradley Hand', cursive",
                  fontSize: '16px',
                  transform: 'rotate(-4deg)',
                  whiteSpace: 'nowrap',
                }}
              >
                background idea?
              </motion.span>
              <svg
                viewBox="0 0 36 32"
                fill="none"
                aria-hidden="true"
                style={{
                  width: '32px',
                  height: '29px',
                  color: '#e6019a',
                  overflow: 'visible',
                  transform: 'translateX(-60%) rotate(-4deg)',
                  display: 'block',
                  margin: '0 auto',
                }}
              >
                <motion.path
                  d="M14 3C11 9 21 12 16 18C13 21 19 23 23 26"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="square"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                />
                <motion.path
                  d="M18 19L23 26L16 25"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="square"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.35, ease: "easeOut", delay: 0.75 }}
                />
              </svg>
            </div>
          </div>
        )}
        {showTest && (
          <>
            <TestBugOverlay />
            <motion.div
              initial={{ opacity: 0, scaleX: 0.4, filter: 'blur(6px)' }}
              animate={{ opacity: 1, scaleX: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: 'left center' }}
              className="absolute bottom-18 left-17 w-60 h-5 overflow-hidden z-75 pointer-events-none"
            >
              <div className="moving-stripes w-full h-full" />
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to right, rgba(0,0,0,1) 0%, transparent 20%, transparent 80%, rgba(0,0,0,1) 100%)' }} />
            </motion.div>
            <motion.span
              initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.45, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-13 left-17 text-[10px] font-mono tracking-widest text-[#D2042D] uppercase z-75 pointer-events-none"
            >//DEBUG_CONSOLE</motion.span>
            <style>{`
              .moving-stripes {
                width: 100%;
                height: 50px;
                background: linear-gradient(45deg, #8B0000 25%, #000000 25%, #000000 50%, #8B0000 50%, #8B0000 75%, #000000 75%, #000000);
                background-size: 40px 40px;
                animation: moveStripes 2s linear infinite;
              }
              @keyframes moveStripes {
                from { background-position: 0 0; }
                to { background-position: 40px 0; }
              }
            `}</style>
          </>
        )}
        {/* Blueprint mode : the GET_RESUME pill is the hero's topmost layer -
            declared last and above every hero layer (photo z-60, copy z-70,
            test/debug chrome z-75) - and it stops the hero's click-to-reset
            from firing when pressed. The design-mode CTA is a different
            component and lives in MainLayout. */}
        {showBlueprint && (
          <div className="absolute right-5 top-4 z-90 pointer-events-auto md:right-6 md:top-2" onClick={(e) => e.stopPropagation()}>
            <span className="bp-hero-resume inline-block" style={{ transform: 'scale(0.85)', transformOrigin: 'top right' }}>
              <BlueprintPillButton
                label="GET_RESUME"
                heightOnRight={false}
                hoverIcon={<Download />}
                onClick={handleResumeDownload}
              />
            </span>
          </div>
        )}
      </section>

      {/* Everything below the hero wears the hero's mode theme */}
      <div className={"about-body about-mode-" + pageMode} onClick={deactivateMode}>
      {/* Two columns of two blocks each: the narrative column (About +
          Experience) beside the reference column (Quick Info + Skills). The
          four blocks sit in a GRID rather than in two column wrappers, so the
          second row starts at one height - the Work Experience heading and the
          Skills heading then land on the same line on desktop, in every mode
          and in the default, because the row follows the taller of the two
          blocks above it whatever the mode does to the type. Below md the grid
          is a single column and the blocks stack in this order: A Little About
          Me, Quick Info, Work Experience, Skills. */}
      <section className="about-section about-section--main bg-[#F5F5DC] pt-16 pb-4 md:pt-20 md:pb-6">
        <Container size="lg" className="px-8!">
          <div className="grid md:grid-cols-2 items-start gap-x-12 gap-y-12 mb-20">
            {/* Below md this is a single full-width column, so on large phones
                and in landscape the prose would run to ~88 characters a line.
                max-w-prose (65ch) caps the measure and centres it; from md up
                the grid owns the width and the cap is dropped. */}
            <motion.div
              custom={0.1}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="order-1 md:order-0 md:col-start-1 md:row-start-1 max-w-prose mx-auto md:max-w-none md:mx-0"
            >
              <h3 className="about-body-title text-[20px] font-medium text-black mb-5 font-(family-name:--font-display)">A Little About Me</h3>
              <div className="about-body-copy space-y-4 text-[#323232] leading-[1.85] text-[16px]">
                <p>
                  I'm someone who enjoys figuring things out, asking questions, and understanding how things work. I like the feeling of turning a confusing problem into something simple and useful, and I'm usually more interested in understanding <em>why</em> something works than just knowing that it does.
                </p>
                <p>
                  That curiosity is what drew me to programming. What started with Python gradually became an interest in building complete applications and seeing an idea take shape into something people can actually use.
                </p>
                <p>
                  I'm still learning, experimenting, and finding better ways to approach problems. I don't expect to know everything, but I value being willing to learn, taking the time to understand things properly, and improving with every challenge. I'd rather work through a problem and learn something meaningful than take a shortcut I don't understand.
                </p>
                <p>
                  Today, I build with Django and React, with a particular interest in creating practical, reliable applications. Beyond the technologies, I want my work to reflect how I approach things: with curiosity, patience, attention to detail, and a genuine desire to build something useful.
                </p>
              </div>
            </motion.div>

            <motion.div
              custom={0.15}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="order-3 md:order-0 md:col-start-1 md:row-start-2 max-w-prose mx-auto md:max-w-none md:mx-0"
            >
              <h3 className="about-body-title text-[20px] font-medium text-black mb-5 font-(family-name:--font-display)">Work Experience</h3>
              <div className="about-body-copy space-y-4 text-[#323232] leading-[1.85] text-[16px]">
                <p>
                  Over the past year I've worked as a freelance web developer, building web applications for people who needed them built. It's the kind of work I've learned the most from, because every project arrives with its own problem, its own users, and its own definition of what finished actually means.
                </p>
                <p>
                  The work runs end to end. Before anything is written there's a lot of understanding : what the client really needs, what the data has to hold, how the pieces fit together. Then the building, the testing, the deployment, and the quieter part afterwards where you maintain what you shipped. I've learned more from that whole cycle than from any single step of it.
                </p>
                <p>
                  What I enjoy is the variety. No two projects ask the same question, and each one means understanding something I didn't know before. I also get to see a real person actually use the thing I helped make, which is a lot more satisfying than a project that only exists on my own machine.
                </p>
                <p>
                  I'm still early in my career and honest about that. What I bring is a willingness to learn properly, patience with problems that don't have an obvious answer, and care about the details that decide whether software feels good to use or doesn't. Freelancing taught me to be that kind of developer, and I'd like to carry it into a full-time role.
                </p>
              </div>
            </motion.div>

            <motion.div
              custom={0.2}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="order-2 md:order-0 md:col-start-2 md:row-start-1"
            >
              <h3 className="about-body-title text-[20px] font-medium text-black mb-5 font-(family-name:--font-display)">Quick Info</h3>
              <div className="space-y-4">
                {[
                  { label: 'Name', value: 'Mohammed Fawaz O' },
                  { label: 'Location', value: 'Fujairah, UAE' },
                  { label: 'Education', value: 'Bachelor of Computer Applications (BCA)' },
                  { label: 'Experience', value: 'Freelance Web Developer, 1+ year' },
                  { label: 'Languages', value: 'English, Malayalam, Tamil, Hindi' },
                ].map((info) => (
                  <Card key={info.label} variant="light" className="about-card-light ct-panel p-5!">
                    <p className="about-info-label text-[11px] text-[#666] uppercase tracking-[0.18em] font-mono mb-1">{info.label}</p>
                    <p className="about-info-value text-[#323232] font-medium">{info.value}</p>
                  </Card>
                ))}
              </div>
            </motion.div>

            <div className="order-4 md:order-0 md:col-start-2 md:row-start-2">
              <SectionHeading tone="beige" className="about-section-heading mb-5!" subtitleClassName="mt-5" title="Skills" subtitle="Technologies I work with across the stack." alignment="left" />
              <StaggerChildren className="grid gap-4">
                {Object.entries(skills).map(([category, items]) => (
                  <StaggerItem key={category}>
                    <Card variant="light" className="about-card-light ct-panel p-6! h-full">
                      <h4 className="about-skill-title text-[11px] font-medium text-[#2d8cf0] mb-4 uppercase tracking-[0.18em] font-mono">{category}</h4>
                      <div className="flex flex-wrap gap-2">
                        {items.map((skill) => (
                          <SkillChip key={skill} name={skill} />
                        ))}
                      </div>
                    </Card>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </div>
          </div>

          {/* Philosophy */}
          <div>
            <SectionHeading tone="beige" className="about-section-heading mb-5!" subtitleClassName="mt-5" title="What I bring to the table" subtitle="Principles that shape how I build software." alignment="center" />
            <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {philosophy.map((item, index) => (
                <StaggerItem key={index}>
                  <Card variant="teal" className="about-card-teal ct-card p-6! h-full">
                    <h4 className="about-card-teal-title text-[18px] font-medium text-black mb-2 font-(family-name:--font-display)">{item.title}</h4>
                    <p className="about-card-teal-text text-[#323232] text-[14px] leading-[1.7]">{item.description}</p>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </Container>
      </section>

      {/* Mission : light-blue feature band, the same surface the contact form
          card uses. Inset with rounded corners rather than full-bleed, and
          the hard rule above it is gone.
          The eyebrow line ("My Mission") is gone; the title sits at the top of
          the band now, so it carries no top margin - the band's own pt-/pb-
          hold the space. Those utilities are used on purpose: utilities.css
          redefines .py-20 and .py-12 against --space-20 / --space-12, and
          variables.css only defines --space-1..--space-8, so those two
          utilities are invalid and resolve to zero. There is no .pt-* or .pb-*
          override to collide with. */}
      <section className="about-section about-section--mission page-tail-fade bg-[#ADD8E6] rounded-t-none rounded-b-3xl pt-10 pb-10 md:pt-14 md:pb-14">
        <Container size="lg" className="px-8!">
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="about-mission-title font-(family-name:--font-display) text-[34px] md:text-[44px] leading-[1.1] font-semibold text-black mb-5">
              Software that actually works.
            </h3>
            <p className="about-mission-copy text-[#323232] text-[18px] font-light leading-[1.7]">
              To build web applications that solve real problems for real users in real businesses. Not
              demo projects or tutorial clones : production-ready code that delivers.
            </p>
          </div>
        </Container>
      </section>
      </div>
    </>
  )
}

export default About
