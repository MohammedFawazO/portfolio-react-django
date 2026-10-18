import { useEffect, useRef, useState } from 'react'

const SCRAMBLE_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/\\~0123456789ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄ'

const ACTIVE = {
  duration: 380,
  sliceCount: 10,
  velocity: 20,
  minHeight: 0.02,
  maxHeight: 0.22,
  maxOffset: 42,
  shakeAmplitude: 0.24,
  spanStart: 0.15,
  spanEnd: 0.92,
  scrambleInterval: 35,
  peakAt: 0.35,
  rogueMultiplier: 3.8,
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
  const threshold = ((index + 1) / (o.sliceCount + 1)) * 0.9
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
      opacity: '1',
      transform: `translate3d(${(jolt(o, t) * push * scale).toFixed(2)}%,0,0)`,
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
    const x = jolt(o, t) * o.shakeAmplitude * 100
    const y = jolt(o, t) * o.shakeAmplitude * 100
    out.push({ transform: `translate3d(${x.toFixed(2)}%,${y.toFixed(2)}%,0)` })
  }
  return out
}

const RED = '#D2042D'
const DARK = '#7A0218'
const HOT = '#FF3B47'
const LAYER_COLORS = [
  '#D2042D',
  '#FF3B47',
  '#7A0218',
  '#FF6B6B',
  '#D2042D',
  '#FF3B47',
  '#7A0218',
  '#FF6B6B',
  '#D2042D',
  '#FF3B47',
]

export function RedGlitchHeading({
  text = 'MOHAMMED FAWAZ O',
  variants = [
    'मोहम्मद फ़वाज़ ओ',
    'മുഹമ്മദ് ഫവാസ് ഒ',
    'محمد فواز أو',
    'モハメド・ファワズ・オ',
  ],
  className = '',
  interval = 3200,
}) {
  const pool = [text, ...variants]
  const hostRef = useRef(null)
  const baseRef = useRef(null)
  const layersRef = useRef([])
  const cycleTimer = useRef(null)
  const currentIndexRef = useRef(0)
  const [displayText, setDisplayText] = useState(text)

  useEffect(() => {
    const host = hostRef.current
    const base = baseRef.current
    const layers = layersRef.current.filter(Boolean)
    if (!host || !base) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let scrambleTimer = null
    let cycleStart = 0

    const setWord = (s) => {
      setDisplayText(s)
      const baseSlot = base.querySelector('[data-rg-text]') ?? base
      baseSlot.textContent = s
      for (const el of layers) {
        const slot = el.querySelector('[data-rg-text]') ?? el
        slot.textContent = s
      }
    }

    const stepEasing = `steps(${Math.max(1, Math.floor((ACTIVE.velocity * ACTIVE.duration) / 1000) + 1)}, jump-start)`
    const timing = { duration: ACTIVE.duration, iterations: 1, easing: stepEasing, fill: 'none' }

    const runBurst = () => {
      if (reduced) return
      const rogue = Math.floor(Math.random() * ACTIVE.sliceCount)
      base.animate(shakeFrames(ACTIVE), timing)
      layers.slice(0, ACTIVE.sliceCount).forEach((el, i) => {
        el.animate(sliceFrames(ACTIVE, i, rogue), timing)
      })
    }

    const startScramble = (targetWord) => {
      if (scrambleTimer !== null) window.clearInterval(scrambleTimer)
      cycleStart = performance.now()

      const targetChars = Array.from(targetWord)
      const targetLen = targetChars.length

      const tick = () => {
        const o = ACTIVE
        const elapsed = performance.now() - cycleStart
        const progress = Math.min(1, elapsed / o.duration)

        if (progress >= 1) {
          setWord(targetWord)
          if (scrambleTimer !== null) {
            window.clearInterval(scrambleTimer)
            scrambleTimer = null
          }
          return
        }

        // Progressive unscramble / cyber decode effect
        const resolvedCount = Math.floor(progress * targetLen)
        const scrambled = targetChars
          .map((ch, idx) => {
            if (ch === ' ' || ch === '・') return ch
            if (idx < resolvedCount) return ch
            if (Math.random() < 0.75) {
              return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
            }
            return ch
          })
          .join('')

        setWord(scrambled)
      }

      tick()
      scrambleTimer = window.setInterval(tick, ACTIVE.scrambleInterval)
    }

    const stopScramble = (targetWord) => {
      if (scrambleTimer !== null) {
        window.clearInterval(scrambleTimer)
        scrambleTimer = null
      }
      if (targetWord) {
        setWord(targetWord)
      }
    }

    const fire = () => {
      currentIndexRef.current = (currentIndexRef.current + 1) % pool.length
      const nextWord = pool[currentIndexRef.current]

      runBurst()
      startScramble(nextWord)

      cycleTimer.current = window.setTimeout(() => {
        stopScramble(nextWord)
        for (const el of layers) {
          el.style.opacity = '0'
          el.style.transform = 'none'
          el.style.clipPath = 'none'
        }
        base.style.transform = 'none'
        cycleTimer.current = window.setTimeout(fire, interval)
      }, ACTIVE.duration + 40)
    }

    const startDelay = window.setTimeout(fire, 1200)

    return () => {
      clearTimeout(startDelay)
      if (cycleTimer.current) clearTimeout(cycleTimer.current)
      if (scrambleTimer !== null) window.clearInterval(scrambleTimer)
      for (const el of layers) {
        try {
          el.getAnimations?.().forEach((a) => a.cancel())
        } catch {}
        el.style.opacity = '0'
        el.style.transform = 'none'
        el.style.clipPath = 'none'
      }
      try {
        base.getAnimations?.().forEach((a) => a.cancel())
      } catch {}
      base.style.transform = 'none'
    }
  }, [text, interval, pool.length])

  const TEXT =
    'leading-[1.05] font-semibold tracking-tight uppercase lg:whitespace-nowrap ' +
    'text-[22px] sm:text-[30px] lg:text-[60px] ' +
    className

  const fontStyle = {
    fontFamily:
      'var(--font-display), "Geist", "Noto Sans Devanagari", "Noto Sans Malayalam", "Noto Sans Arabic", "Noto Sans JP", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: RED,
  }

  // Equalize visual length across different scripts without breaking letterforms
  const getScriptStyle = (str) => {
    if (!str) return {}
    // Arabic script (shorter character count, elegant elongation)
    if (/[\u0600-\u06FF]/.test(str)) {
      return {
        transform: 'scale(2)',
        transformOrigin: 'left center',
        display: 'inline-block',
      }
    }
    // Devanagari / Hindi script
    if (/[\u0900-\u097F]/.test(str)) {
      return {
        transform: 'scale(1.18)',
        letterSpacing: '0.03em',
        transformOrigin: 'left center',
        display: 'inline-block',
      }
    }
    // Malayalam script
    if (/[\u0D00-\u0D7F]/.test(str)) {
      return {
        transform: 'scale(0.78)',
        letterSpacing: '0.02em',
        transformOrigin: 'left center',
        display: 'inline-block',
      }
    }
    // Japanese Katakana / Hiragana
    if (/[\u30A0-\u30FF\u3040-\u309F]/.test(str)) {
      return {
        transform: 'scale(0.8)',
        letterSpacing: '0.05em',
        transformOrigin: 'left center',
        display: 'inline-block',
      }
    }
    return {
      transform: 'scale(1)',
      letterSpacing: '0.02em',
      transformOrigin: 'left center',
      display: 'inline-block',
    }
  }

  const currentScriptStyle = getScriptStyle(displayText)

  return (
    <h1
      ref={hostRef}
      className={'relative inline-block select-none ' + TEXT}
      style={fontStyle}
      dir="auto"
    >
      <span className="relative grid items-center">
        {/* Invisible placeholder matching default text */}
        <span aria-hidden="true" className="invisible col-start-1 row-start-1 pointer-events-none">
          <span data-rg-text style={{ display: 'inline-block', letterSpacing: '0.02em' }}>{text}</span>
        </span>

        {/* Base text */}
        <span
          ref={baseRef}
          data-rg-base
          className="col-start-1 row-start-1 relative z-10"
          style={{
            textShadow: `0 0 14px rgba(210,4,45,0.55), 0 0 2px ${RED}`,
          }}
        >
          <span data-rg-text style={currentScriptStyle}>{displayText}</span>
        </span>

        {/* RGB Glitch Slice Layers */}
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            ref={(el) => (layersRef.current[i] = el)}
            data-rg-layer
            aria-hidden="true"
            style={{
              opacity: 0,
              color: LAYER_COLORS[i % LAYER_COLORS.length],
              textShadow:
                i % 2 === 0
                  ? `1.5px 0 0 ${HOT}`
                  : `-1.5px 0 0 ${DARK}`,
              mixBlendMode: 'screen',
            }}
            className="col-start-1 row-start-1 pointer-events-none relative z-10"
          >
            <span data-rg-text style={currentScriptStyle}>{displayText}</span>
          </span>
        ))}
      </span>
    </h1>
  )
}

export default RedGlitchHeading