import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'

const SCRAMBLE_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/\\~0123456789ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿ'

const ACTIVE = {
  duration: 380,
  sliceCount: 8,
  velocity: 20,
  minHeight: 0.04,
  maxHeight: 0.25,
  maxOffset: 16,
  shakeAmplitude: 0.12,
  spanStart: 0.12,
  spanEnd: 0.92,
  scrambleInterval: 35,
  peakAt: 0.35,
  rogueMultiplier: 3.2,
}

function envelope(o, t) {
  if (t < o.spanStart) return 0
  const span = o.spanEnd - o.spanStart
  if (t > o.spanEnd) {
    const tail = (t - o.spanEnd) / (span * 0.14)
    return tail < 1 ? -0.22 * (1 - tail) : 0
  }
  const peak = o.spanStart + span * o.peakAt
  return t < peak
    ? (t - o.spanStart) / (peak - o.spanStart)
    : (o.spanEnd - t) / (o.spanEnd - peak)
}

function jolt(o, t) {
  return (Math.random() - 0.5) * 2 * envelope(o, t)
}

function band(o) {
  const range = o.maxHeight - o.minHeight
  const heightRatio = Math.random()
  const h = o.minHeight + heightRatio * range
  const y = Math.random() * (1 - h)
  const top = (y * 100).toFixed(2)
  const bot = ((y + h) * 100).toFixed(2)
  return {
    path: `polygon(0% ${top}%, 100% ${top}%, 100% ${bot}%, 0% ${bot}%)`,
    heightRatio,
  }
}

function sliceFrames(o, index, rogue) {
  const steps = Math.max(1, Math.floor((o.velocity * o.duration) / 1000) + 1)
  const threshold = ((index + 1) / (o.sliceCount + 1)) * 0.85
  const push = index === rogue ? o.maxOffset * o.rogueMultiplier : o.maxOffset
  const out = []
  for (let i = 0; i < steps; i++) {
    const t = i / steps
    const e = envelope(o, t)
    if (Math.abs(e) < threshold) {
      out.push({ opacity: '0', transform: 'none', clipPath: 'unset' })
      continue
    }
    const b = band(o)
    const scale = 0.35 + b.heightRatio * 0.65
    out.push({
      opacity: '0.85',
      transform: `translate3d(${(jolt(o, t) * push * scale).toFixed(2)}px, 0, 0)`,
      clipPath: b.path,
    })
  }
  return out
}

function shakeFrames(o) {
  const steps = Math.max(1, Math.floor((o.velocity * o.duration) / 1000) + 1)
  const out = []
  for (let i = 0; i < steps; i++) {
    const t = i / steps
    const x = jolt(o, t) * o.shakeAmplitude * 10
    const y = jolt(o, t) * o.shakeAmplitude * 6
    out.push({ transform: `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)` })
  }
  return out
}

const RED = '#D2042D'
const HOT = '#FF3B47'
const DARK = '#7A0218'
const LAYER_COLORS = [
  '#FF3B47',
  '#00F0FF',
  '#D2042D',
  '#FF6B6B',
  '#00F0FF',
  '#FF3B47',
  '#7A0218',
  '#FFFFFF',
]

export default function GlitchScanGridButton({
  label = 'VIEW MY WORK',
  icon = null,
  onClick,
  badge,
  index = null,
  iconPosition = 'right',
  className = '',
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [displayText, setDisplayText] = useState(label.toUpperCase())
  const baseRef = useRef(null)
  const layersRef = useRef([])
  const hoverIntervalRef = useRef(null)
  const scrambleTimerRef = useRef(null)
  const cycleTimeoutRef = useRef(null)

  const setAllText = useCallback((text) => {
    setDisplayText(text)
    if (baseRef.current) {
      const slot = baseRef.current.querySelector('[data-glitch-slot]') ?? baseRef.current
      slot.textContent = text
    }
    layersRef.current.filter(Boolean).forEach((el) => {
      const slot = el.querySelector('[data-glitch-slot]') ?? el
      slot.textContent = text
    })
  }, [])

  const fireGlitchBurst = useCallback(() => {
    const base = baseRef.current
    const layers = layersRef.current.filter(Boolean)
    if (!base) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!reduced) {
      const stepEasing = `steps(${Math.max(1, Math.floor((ACTIVE.velocity * ACTIVE.duration) / 1000) + 1)}, jump-start)`
      const timing = { duration: ACTIVE.duration, iterations: 1, easing: stepEasing, fill: 'none' }
      const rogue = Math.floor(Math.random() * ACTIVE.sliceCount)

      base.animate(shakeFrames(ACTIVE), timing)
      layers.slice(0, ACTIVE.sliceCount).forEach((el, i) => {
        el.animate(sliceFrames(ACTIVE, i, rogue), timing)
      })
    }

    // Text scramble decode
    if (scrambleTimerRef.current) clearInterval(scrambleTimerRef.current)
    const target = label.toUpperCase()
    const targetChars = Array.from(target)
    const startTime = performance.now()

    scrambleTimerRef.current = window.setInterval(() => {
      const elapsed = performance.now() - startTime
      const progress = Math.min(1, elapsed / ACTIVE.duration)

      if (progress >= 1) {
        setAllText(target)
        if (scrambleTimerRef.current) {
          clearInterval(scrambleTimerRef.current)
          scrambleTimerRef.current = null
        }
        return
      }

      const resolvedCount = Math.floor(progress * targetChars.length)
      const scrambled = targetChars
        .map((ch, idx) => {
          if (ch === ' ' || ch === '_' || ch === '-') return ch
          if (idx < resolvedCount) return ch
          return Math.random() < 0.75 ? SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)] : ch
        })
        .join('')

      setAllText(scrambled)
    }, ACTIVE.scrambleInterval)

    if (cycleTimeoutRef.current) clearTimeout(cycleTimeoutRef.current)
    cycleTimeoutRef.current = window.setTimeout(() => {
      setAllText(target)
      layers.forEach((el) => {
        if (el) {
          el.style.opacity = '0'
          el.style.transform = 'none'
          el.style.clipPath = 'none'
        }
      })
      if (base) base.style.transform = 'none'
    }, ACTIVE.duration + 50)
  }, [label, setAllText])

  const handleMouseEnter = () => {
    setIsHovered(true)
    fireGlitchBurst()

    // Trigger glitch burst repeatedly every 2 seconds while hovering
    if (hoverIntervalRef.current) clearInterval(hoverIntervalRef.current)
    hoverIntervalRef.current = window.setInterval(() => {
      fireGlitchBurst()
    }, 2000)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (hoverIntervalRef.current) {
      clearInterval(hoverIntervalRef.current)
      hoverIntervalRef.current = null
    }
    if (scrambleTimerRef.current) {
      clearInterval(scrambleTimerRef.current)
      scrambleTimerRef.current = null
    }
    if (cycleTimeoutRef.current) {
      clearTimeout(cycleTimeoutRef.current)
      cycleTimeoutRef.current = null
    }

    const base = baseRef.current
    const layers = layersRef.current.filter(Boolean)
    if (base) {
      try { base.getAnimations?.().forEach((a) => a.cancel()) } catch {}
      base.style.transform = 'none'
    }
    layers.forEach((el) => {
      try { el.getAnimations?.().forEach((a) => a.cancel()) } catch {}
      el.style.opacity = '0'
      el.style.transform = 'none'
      el.style.clipPath = 'none'
    })

    setAllText(label.toUpperCase())
  }

  useEffect(() => {
    setAllText(label.toUpperCase())
    return () => {
      if (hoverIntervalRef.current) clearInterval(hoverIntervalRef.current)
      if (scrambleTimerRef.current) clearInterval(scrambleTimerRef.current)
      if (cycleTimeoutRef.current) clearTimeout(cycleTimeoutRef.current)
    }
  }, [label, setAllText])

  const autoBadge = badge ?? (label.toLowerCase().includes('resume') ? 'PDF' : 'RUN')

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`group relative inline-flex items-center justify-center px-7 py-3.5 sm:px-8 sm:py-4 cursor-pointer select-none rounded-none bg-[#080204]/95 backdrop-blur-md border transition-all duration-300 ease-out overflow-hidden ${
        isHovered
          ? 'border-[#FF3B47] shadow-[0_0_24px_rgba(255,59,71,0.35),inset_0_0_15px_rgba(255,59,71,0.18)]'
          : 'border-[#D2042D]/40 shadow-[0_4px_14px_rgba(0,0,0,0.5),inset_0_0_10px_rgba(210,4,45,0.06)]'
      } ${className}`}
      style={{
        borderRadius: 0,
        fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace)',
      }}
    >
      <style>{`
        @keyframes rgb-icon-glitch-anim {
          0%, 100% { transform: translateX(0); opacity: 1; filter: drop-shadow(0 0 6px #FF3B47); }
          15% { transform: translateX(-3px); opacity: 1; }
          17% { transform: translateX(3px); opacity: 0.4; }
          19% { transform: translateX(-2px); opacity: 1; }
          21% { transform: translateX(0); }
          50% { transform: translateX(0); opacity: 1; }
          52% { transform: translateX(2px); opacity: 1; }
          54% { transform: translateX(-3px); opacity: 0.5; }
          56% { transform: translateX(1px); opacity: 1; }
          58% { transform: translateX(0); }
          82% { transform: translateX(0); opacity: 1; }
          84% { transform: translateX(-2px); opacity: 0.6; }
          86% { transform: translateX(2px); opacity: 1; }
            88% { transform: translateX(0); }
        }
        .rgb-icon-glitch-on { animation: rgb-icon-glitch-anim 2s steps(2, jump-start) infinite; }
      `}</style>
      {/* Radial Hover Core Glow */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ease-out ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(255,59,71,0.22) 0%, rgba(210,4,45,0.1) 50%, transparent 75%)`,
        }}
      />

      {/* Animated Laser Scanline on Hover */}
      <div
        aria-hidden="true"
        className={`absolute inset-x-0 pointer-events-none transition-opacity duration-200 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          top: 0,
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <motion.div
          animate={isHovered ? { y: ['-100%', '200%'] } : { y: '-100%' }}
          transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
          className="absolute inset-x-0 h-10 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(255,59,71,0.25) 70%, rgba(255,59,71,0.85) 100%)',
          }}
        >
          <div
            className="absolute bottom-0 inset-x-0 h-0.5"
            style={{
              background: '#FF3B47',
              boxShadow: '0 0 8px #FF3B47, 0 0 16px #D2042D',
            }}
          />
        </motion.div>
      </div>

      {/* Sharp 90-Degree Corner Targeting Brackets */}
      {/* Top Left */}
      <span
        aria-hidden="true"
        className={`absolute top-0 left-0 pointer-events-none transition-all duration-300 ease-out ${
          isHovered
            ? 'w-4 h-4 border-t-2 border-l-2 border-[#FF3B47] drop-shadow-[0_0_6px_#FF3B47]'
            : 'w-2.5 h-2.5 border-t border-l border-[#D2042D]/70'
        }`}
      />
      {/* Top Right */}
      <span
        aria-hidden="true"
        className={`absolute top-0 right-0 pointer-events-none transition-all duration-300 ease-out ${
          isHovered
            ? 'w-4 h-4 border-t-2 border-r-2 border-[#FF3B47] drop-shadow-[0_0_6px_#FF3B47]'
            : 'w-2.5 h-2.5 border-t border-r border-[#D2042D]/70'
        }`}
      />
      {/* Bottom Left */}
      <span
        aria-hidden="true"
        className={`absolute bottom-0 left-0 pointer-events-none transition-all duration-300 ease-out ${
          isHovered
            ? 'w-4 h-4 border-b-2 border-l-2 border-[#FF3B47] drop-shadow-[0_0_6px_#FF3B47]'
            : 'w-2.5 h-2.5 border-b border-l border-[#D2042D]/70'
        }`}
      />
      {/* Bottom Right */}
      <span
        aria-hidden="true"
        className={`absolute bottom-0 right-0 pointer-events-none transition-all duration-300 ease-out ${
          isHovered
            ? 'w-4 h-4 border-b-2 border-r-2 border-[#FF3B47] drop-shadow-[0_0_6px_#FF3B47]'
            : 'w-2.5 h-2.5 border-b border-r border-[#D2042D]/70'
        }`}
      />

      {/* Mini Diagnostic Top Status Tag */}
      <div
        aria-hidden="true"
        className={`absolute top-1 left-3 flex items-center gap-1 pointer-events-none transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-60'
        }`}
      >
        <span
          className={`inline-block w-1.5 h-1.5 rounded-none ${
            isHovered ? 'bg-[#FF3B47] shadow-[0_0_6px_#FF3B47] animate-pulse' : 'bg-[#D2042D]'
          }`}
        />
        <span className="text-[8px] tracking-wider text-[#FF6B6B] font-mono select-none whitespace-nowrap">
          {autoBadge}
        </span>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex items-center justify-center gap-2.5 pt-1.5 sm:pt-1">
        {iconPosition === 'left' && icon && (
          <div
            className={`flex items-center justify-center transition-all duration-300 ease-out ${
              isHovered
                ? 'text-[#FF3B47] -translate-x-1 drop-shadow-[0_0_8px_#FF3B47] scale-110 rgb-icon-glitch-on'
                : 'text-[#D2042D] translate-x-0 opacity-80'
            }`}
          >
            {icon}
          </div>
        )}

        {/* Layer Glitch Text Stack */}
        <div className="relative inline-block select-none">
          {/* Invisible spacer matching target text */}
          <span aria-hidden="true" className="invisible block text-[14px] sm:text-[15px] font-bold tracking-[0.14em] uppercase">
            {label.toUpperCase()}
          </span>

          {/* Base Text Layer */}
          <span
            ref={baseRef}
            className={`absolute inset-0 block text-[14px] sm:text-[15px] font-bold tracking-[0.14em] uppercase transition-colors duration-300 ${
              isHovered
                ? 'text-white drop-shadow-[0_0_8px_rgba(255,59,71,0.85)]'
                : 'text-[#E5E7EB] drop-shadow-[0_0_5px_rgba(210,4,45,0.4)]'
            }`}
          >
            <span data-glitch-slot>{displayText}</span>
          </span>

          {/* Multi-Layer RGB Slice Aberrations (Triggered on hover every 2s) */}
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              ref={(el) => (layersRef.current[i] = el)}
              aria-hidden="true"
              className="absolute inset-0 block text-[14px] sm:text-[15px] font-bold tracking-[0.14em] uppercase pointer-events-none select-none"
              style={{
                opacity: 0,
                color: LAYER_COLORS[i % LAYER_COLORS.length],
                textShadow:
                  i % 2 === 0
                    ? `1.5px 0 0 ${HOT}`
                    : `-1.5px 0 0 ${DARK}`,
                mixBlendMode: 'screen',
                willChange: 'transform, clip-path, opacity',
              }}
            >
              <span data-glitch-slot>{displayText}</span>
            </span>
          ))}
        </div>

        {iconPosition === 'right' && icon && (
          <div
            className={`flex items-center justify-center transition-all duration-300 ease-out ${
              isHovered
                ? 'text-[#FF3B47] translate-x-1 drop-shadow-[0_0_8px_#FF3B47] scale-110 rgb-icon-glitch-on'
                : 'text-[#D2042D] translate-x-0 opacity-80'
            }`}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Bottom Right Micro Index Code */}
      <span
        aria-hidden="true"
        className={`absolute bottom-1 right-2.5 text-[8px] font-mono tracking-widest pointer-events-none select-none transition-colors duration-300 ${
          isHovered ? 'text-[#FF6B6B]' : 'text-[#D2042D]/50'
        }`}
      >
        {index === 1 ? '//01' : index === 2 ? '//02' : index === 3 ? '//03' : badge?.includes('PDF') ? '//exe' : '//03'}
      </span>

      {/* Bottom Left Status Code - only for index 3 (GET_RESUME.EXE in navbar) */}
      {index === 3 && (
        <span
          aria-hidden="true"
          className={`absolute bottom-1 left-2.5 text-[8px] font-mono tracking-widest pointer-events-none select-none transition-colors duration-300 ${
            isHovered ? 'text-[#FF6B6B]' : 'text-[#D2042D]/50'
          }`}
        >
          //unstable
        </span>
      )}
    </motion.button>
  )
}
