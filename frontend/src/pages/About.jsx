import { Helmet } from 'react-helmet-async'
import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
import { Download, ArrowRight } from 'lucide-react'

const fadeUp = {
  hidden: { y: 30, opacity: 0 },
  visible: (delay) => ({ y: 0, opacity: 1, transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] } }),
}

const ARROW_A = { main: 'M14 3C11 9 21 12 16 18C13 21 19 23 23 26', head: 'M18 19L23 26L16 25', w: 48, h: 44 }
const ARROW_B = { main: 'M10 5C16 1 13 11 22 13C31 15 15 19 24 23C29 26 17 27 27 30', head: 'M22 24L27 30L19 29', w: 58, h: 52 }
const ARROW_C = { main: 'M15 7C11 11 21 12 17 18C14 23 23 22 19 28', head: 'M15 23L19 28L13 27', w: 40, h: 38 }

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
      <span className="caret-blink ml-[2px] inline-block w-[0.55ch] h-[1.05em] bg-current align-middle" />
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

function About() {
  const [showBlueprint, setShowBlueprint] = useState(false)
  const [showMatrix, setShowMatrix] = useState(false)
  const [showDesign, setShowDesign] = useState(false)
  const [showTest, setShowTest] = useState(false)

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

  const handleResumeDownload = () => {
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
  // in this mode — design, blueprint and test modes never set this class.
  useEffect(() => {
    const root = document.documentElement
    if (showMatrix) root.classList.add('about-matrix-nav')
    else root.classList.remove('about-matrix-nav')
    return () => root.classList.remove('about-matrix-nav')
  }, [showMatrix])

  // Toggle a body class while in blueprint mode so the global navbar can
  // adopt the blueprint hero-button theme. Scoped via CSS to only affect the
  // navbar in this mode — design, matrix and test modes never set this class.
  useEffect(() => {
    const root = document.documentElement
    if (showBlueprint) root.classList.add('about-blueprint-nav')
    else root.classList.remove('about-blueprint-nav')
    return () => root.classList.remove('about-blueprint-nav')
  }, [showBlueprint])

  useEffect(() => {
    setDesignModeActive(showDesign)
    return () => setDesignModeActive(false)
  }, [showDesign, setDesignModeActive])

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
      // the old element — stop so a fresh loop can start on the new canvas.
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
      ictx.fillStyle = showDesign ? '#ffffff' : showMatrix ? '#000000' : '#001428'
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
  }

  const skills = {
    Backend: ['Python', 'Django', 'Django REST Framework', 'REST APIs'],
    Frontend: ['React', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap'],
    Databases: ['PostgreSQL', 'MySQL', 'SQLite', 'Supabase'],
    Tools: ['Git', 'GitHub', 'Postman', 'Vite'],
    Deployment: ['Render', 'Railway', 'Cloudflare', 'WhiteNoise'],
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
      <section className={"relative pt-6 md:pt-8 pb-0 md:pb-0.5 overflow-hidden transition-colors duration-700 ease-out " + (showMatrix ? "bg-black matrix-mode" : showBlueprint ? "bg-[#001428]" : "bg-[#F5F7F7]")}>
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
            <div className="relative w-9 h-9 border-2 border-black">
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
              <span className="absolute -left-1.5 -top-1.5 w-2.5 h-2.5 bg-white border border-black" />
              <span className="absolute -right-1.5 -top-1.5 w-2.5 h-2.5 bg-white border border-black" />
              <span className="absolute -left-1.5 -bottom-1.5 w-2.5 h-2.5 bg-white border border-black" />
              <span className="absolute -right-1.5 -bottom-1.5 w-2.5 h-2.5 bg-white border border-black" />
            </div>
          </div>
        )}
        {designModeActive && (
          <HoverColorAnnot label="try logo here?" arrow={ARROW_A} style={{ position: 'absolute', left: '2rem', top: '3.5rem' }} />
        )}
        <div
          className="absolute pointer-events-none"
          style={{ top: '-15%', right: '-5%', width: '650px', height: '650px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(35,105,102,0.10) 0%, transparent 70%)' }}
        />
        <div className={"absolute inset-0 z-45 pointer-events-none overflow-hidden transition-opacity duration-500 ease-out " + (showMatrix ? "opacity-100" : "opacity-0")}>
          <MatrixRain variant="cyan" fixedColor="#03A062" />
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
        </AnimatePresence>
        <Container size="lg">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className={"relative z-70 transition-[padding,margin] duration-700 ease-out" + (showMatrix || showBlueprint || showTest ? " pl-6 md:pl-12" : "") + (showBlueprint ? " mt-16" : "")}>
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
              ) : (
                <h1 className={"font-(family-name:--font-display) leading-[1.02] font-semibold tracking-tight uppercase whitespace-nowrap transition-[color,font-size,letter-spacing,opacity] duration-700 ease-out " + (showMatrix ? "text-[34px] sm:text-[50px] md:text-[66px] text-white blueprint-hero-type hero-heading" : showBlueprint ? "text-[24px] sm:text-[36px] md:text-[48px] text-white blueprint-hero-type" : "text-[22px] sm:text-[32px] md:text-[42px] text-[#0A3332]")}>
                  Mohammed Fawaz O
                </h1>
              )}
              <p className={"text-[18px] md:text-[20px] font-light mt-2 max-w-xl leading-relaxed transition-[color,font-size,margin,letter-spacing,opacity] duration-700 ease-out " + (showMatrix ? "text-white/80 blueprint-hero-type hero-description" : showBlueprint ? "text-white/80 blueprint-hero-type" : "text-[#405354]")}>
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className={"mt-5 transition-[margin] duration-700 ease-out" + (showMatrix || showBlueprint || showTest ? " -ml-6 md:-ml-12" : "")}
              >
                <AnimatePresence mode="wait">
                  {showDesign ? (
                    <motion.div
                      key="design"
                      className="flex flex-wrap items-center gap-4 mt-6"
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
                        className="flex items-center gap-0"
                        initial={{ opacity: 0, y: 16, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -12, scale: 0.82, filter: 'blur(5px)' }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <AnimatePresence mode="wait" initial={false}>
                          {showBlueprint ? (
                            <motion.div
                              key="bp"
                              className="flex items-center -mt-4"
                              initial={{ opacity: 0, scale: 0.97, filter: 'blur(6px)' }}
                              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                              exit={{ opacity: 0, scale: 0.97, filter: 'blur(6px)' }}
                              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                            >
                              <BlueprintPillButton label="VIEW_MY_WORK" onClick={() => navigate('/projects')} />
                              <div className="w-12" />
                              <span className="-ml-2"><BlueprintPillButton label="RESUME" onClick={handleResumeDownload} heightOnRight hoverIcon={<Download />} /></span>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="def"
                              className={"flex items-center justify-end gap-4" + (showMatrix ? " ml-12" : "")}
                              initial={{ opacity: 0, scale: 0.97, filter: 'blur(6px)' }}
                              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                              exit={{ opacity: 0, scale: 0.97, filter: 'blur(6px)' }}
                              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                            >
                              <MorphyButton onClick={() => navigate('/projects')} className={"px-4" + (showMatrix ? " btn-matrix" : "")} morphStyle="icon" morphDir="down-left" activeIcon={<ArrowRight />} blueprint={showBlueprint} disableMorph={showMatrix}>
                                {showMatrix ? <span className="matrix-btn-label">View My Work</span> : "View My Work"}
                              </MorphyButton>
                              <MorphyButton onClick={handleResumeDownload} className={"px-4 -ml-3" + (showMatrix ? " btn-matrix" : "")} morphStyle="icon" activeIcon={<Download />} morphDir="down" blueprint={showBlueprint} disableMorph={showMatrix}>
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-60 flex justify-end mt-10 md:mt-[17.4mm]"
            >
              <div
                ref={groupRef}
                className={"about-photo-group group relative w-full max-w-125" + (showBlueprint ? " bp-on" : "")}
                onMouseMove={handleMove}
                onMouseLeave={handleLeave}
              >
                <div className="relative overflow-hidden min-h-100">
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
                    onClick={() => {
                      setShowBlueprint(false);
                      setShowMatrix(false);
                      setShowDesign(false);
                      setShowTest(false);
                      trailRef.current = [];
                      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
                    }}
                    className="relative z-20 w-full h-full min-h-100 object-cover cursor-pointer"
                  />
                  <div
                    aria-hidden="true"
                    className={
                      "pointer-events-none absolute bottom-0 left-0 right-0 z-21 h-1 bg-linear-to-r from-transparent via-[#0A3332] to-transparent transition-opacity duration-700 ease-out " +
                      (showBlueprint || showMatrix || showDesign || showTest
                        ? "opacity-0"
                        : "opacity-100 animate-[photoBorderIn_0.8s_ease-out]")
                    }
                  />
                </div>
                <button
                  type="button"
                  onClick={() => { setShowBlueprint((v) => !v); trailRef.current = []; if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null } }}
                  aria-label="Toggle blueprint"
                  aria-pressed={showBlueprint}
                  className={"about-photo-btn about-photo-btn--blueprint w-11 h-11 rounded-full backdrop-blur-md bg-[#0041BA]/75 border border-white/50 text-[#F5F7F7] flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.25)] hover:bg-[#0041BA] hover:scale-110" + (showBlueprint ? " is-active ring-2 ring-white scale-105" : "") + (showMatrix || showDesign || showTest ? " opacity-0 scale-50 pointer-events-none is-hidden" : "")}
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 14px 14px, rgba(255,255,255,1) 1.2px, transparent 1.4px), radial-gradient(circle at 28px 14px, rgba(255,255,255,1) 1.2px, transparent 1.4px), radial-gradient(circle at 14px 28px, rgba(255,255,255,1) 1.2px, transparent 1.4px), radial-gradient(circle at 28px 28px, rgba(255,255,255,1) 1.2px, transparent 1.4px), linear-gradient(to right, rgba(255,255,255,0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.45) 1px, transparent 1px)',
                    backgroundSize:
                      '49px 49px, 49px 49px, 49px 49px, 49px 49px, 7px 7px, 7px 7px',
                    backgroundPosition: '0 0, 0 0, 0 0, 0 0, 0 0, 0 0',
                    backgroundRepeat: 'repeat, repeat, repeat, repeat, repeat, repeat',
                  }}
                >
                </button>
                <button
                  type="button"
                  onClick={() => { setShowMatrix((v) => !v); trailRef.current = []; if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null } }}
                  aria-label="Toggle matrix rain"
                  aria-pressed={showMatrix}
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
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDesign((v) => !v)
                    trailRef.current = []
                    if (rafRef.current) {
                      cancelAnimationFrame(rafRef.current)
                      rafRef.current = null
                    }
                  }}
                  aria-label="Toggle design"
                  aria-pressed={showDesign}
                  className={"about-photo-btn about-photo-btn--design w-11 h-11 rounded-full backdrop-blur-md bg-white/15 border border-white/50 flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.25)] hover:bg-white/30 hover:scale-110" + (showDesign ? " is-active ring-2 ring-white scale-105 bg-white/25" : "") + (showBlueprint || showMatrix || showTest ? " opacity-0 scale-50 pointer-events-none is-hidden" : "")}
                >
                  <svg viewBox="0 0 38 57" aria-hidden="true" className="w-5.5 h-8.25">
                    <path fill="#1abcfe" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" />
                    <path fill="#0acf83" d="M0 47.5a9.5 9.5 0 0 1 9.5-9.5H19v9.5a9.5 9.5 0 1 1-19 0z" />
                    <path fill="#ff7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" />
                    <path fill="#f24e1e" d="M0 9.5A9.5 9.5 0 0 1 9.5 0H19v19H9.5A9.5 9.5 0 0 1 0 9.5z" />
                    <path fill="#a259ff" d="M0 28.5A9.5 9.5 0 0 1 9.5 19H19v19H9.5A9.5 9.5 0 0 1 0 28.5z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => { setShowTest((v) => !v); trailRef.current = []; if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null } }}
                  aria-label="Toggle test overlay"
                  aria-pressed={showTest}
                  className={"about-photo-btn about-photo-btn--red w-11 h-11 rounded-full backdrop-blur-md bg-[#D2042D]/80 border border-white/50 text-[#F5F7F7] flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.25)] hover:bg-[#B00325] hover:scale-110" + (showTest ? " is-active ring-2 ring-white scale-105" : "") + (showBlueprint || showMatrix || showDesign ? " opacity-0 scale-50 pointer-events-none is-hidden" : "")}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" strokeLinejoin="round" aria-hidden="true" className="w-5.5 h-5.5">
                    <ellipse cx="12" cy="14" rx="5" ry="7" />
                    <path d="M12 7 V21" />
                    <circle cx="12" cy="5" r="2.2" />
                    <path d="M10.3 3.4 L8 1.2 M13.7 3.4 L16 1.2" />
                    <path d="M7 11 L3 9 M7 14 L3 14 M7 17 L3 20 M17 11 L21 9 M17 14 L21 14 M17 17 L21 20" />
                  </svg>
                </button>
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
      </section>

      {/* Story + Quick Info */}
      <section className="bg-[#F5F7F7] py-16 md:py-20">
        <Container size="lg">
          <div className="grid md:grid-cols-2 gap-12 mb-20">
            <motion.div custom={0.1} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h3 className="text-[20px] font-medium text-[#0A3332] mb-5 font-(family-name:--font-display)">My Story</h3>
              <div className="space-y-4 text-[#405354] leading-[1.85] text-[16px]">
                <p>
                  I started my programming journey with Python because I enjoyed solving logical problems. There was something satisfying about writing code that actually did something useful.
                </p>
                <p>
                  As I learned web development, I became interested in building complete applications instead of just websites. I wanted to understand how things worked end-to-end : from the database to the user interface.
                </p>
                <p>
                  I focused on Django because it forced me to learn backend architecture properly. Authentication, APIs, databases, deployment : I wanted to understand all of it, not just one piece.
                </p>
                <p>
                  After becoming comfortable with Django, I started learning React to build modern frontend applications. Instead of following tutorials, I built this portfolio entirely with Django REST Framework and React to understand how real full-stack applications work.
                </p>
              </div>
            </motion.div>

            <motion.div custom={0.2} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h3 className="text-[20px] font-medium text-[#0A3332] mb-5 font-(family-name:--font-display)">Quick Info</h3>
              <div className="space-y-4">
                {[
                  { label: 'Name', value: 'Mohammed Fawaz O' },
                  { label: 'Location', value: 'Kerala, India' },
                  { label: 'Education', value: 'Bachelor of Computer Applications (BCA)' },
                  { label: 'Focus', value: 'Django, React, REST APIs, Production Applications' },
                ].map((info) => (
                  <Card key={info.label} variant="light" className="p-5!">
                    <p className="text-[11px] text-[#718082] uppercase tracking-[0.18em] font-mono mb-1">{info.label}</p>
                    <p className="text-[#0A3332] font-medium">{info.value}</p>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Skills */}
          <div className="mb-20">
            <SectionHeading tone="light" eyebrow="Capabilities" title="Skills" subtitle="Technologies I work with across the stack." alignment="left" />
            <StaggerChildren className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.entries(skills).map(([category, items]) => (
                <StaggerItem key={category}>
                  <Card variant="light" className="p-6! h-full">
                    <h4 className="text-[11px] font-medium text-[#236966] mb-4 uppercase tracking-[0.18em] font-mono">{category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {items.map((skill) => (
                        <Badge key={skill} variant="light">{skill}</Badge>
                      ))}
                    </div>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>

          {/* Philosophy */}
          <div className="mb-4">
            <SectionHeading tone="light" eyebrow="Why Me" title="What I bring to the table" subtitle="Principles that shape how I build software." alignment="left" />
            <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {philosophy.map((item, index) => (
                <StaggerItem key={index}>
                  <Card variant="teal" className="p-6! h-full">
                    <h4 className="text-[18px] font-medium text-[#F5F7F7] mb-2 font-(family-name:--font-display)">{item.title}</h4>
                    <p className="text-[#B8F2FA] text-[14px] leading-[1.7]">{item.description}</p>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </Container>
      </section>

      {/* Mission : Teal feature band */}
      <section className="bg-[#0A3332] py-20 md:py-24">
        <Container size="lg">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-[11px] font-mono text-[#6FE7FF] uppercase tracking-[0.3em] font-medium">
              My Mission
            </span>
            <h3 className="font-(family-name:--font-display) text-[34px] md:text-[44px] leading-[1.1] font-semibold text-[#F5F7F7] mt-4 mb-5">
              Software that actually works.
            </h3>
            <p className="text-[#B8F2FA] text-[18px] font-light leading-[1.7]">
              To build web applications that solve real problems for real users in real businesses. Not
              demo projects or tutorial clones : production-ready code that delivers.
            </p>
          </div>
        </Container>
      </section>
    </>
  )
}

export default About
