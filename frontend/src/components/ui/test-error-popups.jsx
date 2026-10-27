import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STATUS_ROWS = [
  { label: 'Unit Tests:', value: 'Fail' },
  { label: 'Integration Tests:', value: 'Fail' },
  { label: 'UI Tests:', value: 'Fail' },
  { label: 'Performance:', value: 'Warning' },
]

const ERROR_LINES = [
  { time: '[12:45:10]', level: 'ERROR', text: 'NullReferenceException' },
  { time: '[12:45:10]', level: 'ERROR', text: 'TimeoutException' },
  { time: '[12:45:11]', level: 'WARN ', text: 'DataValidationFailed' },
  { time: '[12:45:12]', level: 'ERROR', text: 'UnknownTypeError' },
  { time: '[12:45:13]', level: 'INFO ', text: 'Retry attempt 1/3...' },
  { time: '[12:45:14]', level: 'ERROR', text: 'SocketTimeoutException: read timed out' },
  { time: '[12:45:15]', level: 'WARN ', text: 'Heap usage above threshold (87%)' },
  { time: '[12:45:16]', level: 'ERROR', text: 'NullReferenceException at /api/users/42' },
  { time: '[12:45:17]', level: 'INFO ', text: 'Disposing connection pool entry' },
  { time: '[12:45:18]', level: 'ERROR', text: 'TimeoutException: 30s exceeded' },
  { time: '[12:45:19]', level: 'WARN ', text: 'DataValidationFailed: missing "email"' },
  { time: '[12:45:20]', level: 'ERROR', text: 'UnknownTypeError: cannot cast String' },
  { time: '[12:45:21]', level: 'INFO ', text: 'Re-running suite...' },
  { time: '[12:45:22]', level: 'ERROR', text: 'AssertionError: expected true, got false' },
  { time: '[12:45:23]', level: 'WARN ', text: 'Slow response from /api/projects (2.4s)' },
  { time: '[12:45:24]', level: 'ERROR', text: 'NullReferenceException in Modal.tsx:118' },
  { time: '[12:45:25]', level: 'INFO ', text: 'Stack trace captured to /logs' },
  { time: '[12:45:26]', level: 'ERROR', text: 'TimeoutException: handshake failed' },
]

const LEVEL_COLORS = {
  ERROR: '#ff4b4b',
  WARN: '#ffb84d',
  INFO: '#9adcff',
}

const POPUP_W = 300
const POPUP_W_MIN = 180
const POP_GAP = 16

// The popups are positioned against the hero, but their width was a hard 340px,
// so on a phone any x put the card past the right edge and the section's
// overflow-hidden clipped it. Measure the hero instead and shrink the card to
// whatever is left between the gutters - on desktop 340px still fits, so the
// clamp never engages and the layout is unchanged.
function heroBox() {
  if (typeof document === 'undefined') return { w: 800, h: 600 }
  const hero = document.getElementById('about-hero-section')
  if (!hero) return { w: window.innerWidth, h: 600 }
  return { w: Math.min(hero.clientWidth, window.innerWidth), h: hero.clientHeight }
}

function fitWidth(w) {
  return Math.min(w, Math.max(POPUP_W_MIN, heroBox().w - POP_GAP * 2))
}

function maxX() {
  return Math.max(0, heroBox().w - fitWidth(POPUP_W) - POP_GAP)
}

function randomPos() {
  const { h } = heroBox()
  const spanX = maxX()
  const maxY = Math.max(60, h - 360)
  const x = POP_GAP + Math.random() * spanX
  const y = POP_GAP + Math.random() * maxY
  return { x, y }
}

function ErrorPopup({ title, lines, status, accent = '#D2042D', delay = 0, reopenDelay = 7000, totalCloses, onClose, disabled }) {
  const [open, setOpen] = useState(delay === 0)
  const [minimized, setMinimized] = useState(false)
  const [openTick, setOpenTick] = useState(0)
  const [pos, setPos] = useState(() => randomPos())
  const [logCount, setLogCount] = useState(lines.length)
  const [jitter, setJitter] = useState({ x: 0, y: 0 })

  const dragRef = useRef(null)
  const offsetRef = useRef({ x: 0, y: 0 })
  const draggingRef = useRef(false)

  useEffect(() => {
    if (open || disabled) return
    const t = setTimeout(() => {
      setPos(randomPos())
      setMinimized(false)
      setOpen(true)
    }, reopenDelay)
    return () => clearTimeout(t)
  }, [open, reopenDelay, openTick, disabled])

  useEffect(() => {
    if (delay <= 0 || openTick > 0 || disabled) return
    const t = setTimeout(() => {
      setMinimized(false)
      setOpen(true)
    }, delay)
    return () => clearTimeout(t)
  }, [delay, openTick, disabled])

  useEffect(() => {
    if (!open) return
    const t = setInterval(() => {
      const next = ERROR_LINES[Math.floor(Math.random() * ERROR_LINES.length)]
      setLogCount((c) => c + 1)
      lines.push(next)
    }, 900)
    return () => clearInterval(t)
  }, [open, lines])

  useEffect(() => {
    if (!open) return
    const t = setInterval(() => {
      setJitter({
        x: (Math.random() - 0.5) * 1.2,
        y: (Math.random() - 0.5) * 1.2,
      })
    }, 90)
    return () => clearInterval(t)
  }, [open])

  const heroRect = () => {
    const hero = typeof document !== 'undefined' ? document.getElementById('about-hero-section') : null
    return hero ? hero.getBoundingClientRect() : { left: 0, top: 0 }
  }
  const onPointerDown = (e) => {
    if (e.target.closest('button')) return
    draggingRef.current = true
    const r = heroRect()
    offsetRef.current = {
      x: e.clientX - r.left - pos.x,
      y: e.clientY - r.top - pos.y,
    }
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e) => {
    if (!draggingRef.current) return
    const r = heroRect()
    const hero = typeof document !== 'undefined' ? document.getElementById('about-hero-section') : null
    const isMobile = window.innerWidth < 768
    // Mobile: allow free drag within viewport with generous padding
    const limitX = isMobile ? Math.max(20, window.innerWidth - fitWidth(minimized ? POPUP_W_MIN : POPUP_W) - 20) : maxX()
    const maxY = isMobile ? Math.max(60, window.innerHeight - 320) : (hero ? Math.max(60, hero.clientHeight - fitWidth(POPUP_W)) : 400)
    setPos({
      x: Math.min(Math.max(0, e.clientX - r.left - offsetRef.current.x), limitX),
      y: Math.min(Math.max(0, e.clientY - r.top - offsetRef.current.y), maxY),
    })
  }
  const onPointerUp = () => {
    draggingRef.current = false
    if (typeof document !== 'undefined' && window.innerWidth < 768) {
      document.body.style.overflow = ''
    }
  }

  // Prevent page scroll while interacting with popups on mobile
  useEffect(() => {
    if (!open || typeof document === 'undefined' || window.innerWidth >= 768) return
    // Lock scroll when popup is open on mobile
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  if (!open) return null

  return (
    <AnimatePresence>
      <motion.div
        ref={dragRef}
        initial={{ opacity: 0, scale: 0.92, y: -8 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: jitter.y,
          x: jitter.x,
        }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          left: pos.x,
          top: pos.y,
          zIndex: 90,
          width: fitWidth(minimized ? POPUP_W_MIN : POPUP_W),
        }}
        onPointerDown={(e) => { e.stopPropagation(); onPointerDown(e) }}
        onPointerMove={onPointerMove}
        onPointerUp={(e) => { e.stopPropagation(); onPointerUp(e) }}
        onClick={(e) => e.stopPropagation()}
        className="cursor-grab active:cursor-grabbing select-none"
      >
        <div
          className="relative rounded-md overflow-hidden border shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7)]"
          style={{
            background: 'rgba(8,8,10,0.92)',
            borderColor: accent,
            fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
          }}
        >
          <div
            className="flex items-center justify-between px-2.5 py-1.5 border-b"
            style={{
              background: `linear-gradient(90deg, ${accent}33 0%, transparent 100%)`,
              borderColor: `${accent}55`,
            }}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="inline-block w-2 h-2 rounded-full animate-pulse"
                style={{
                  background: accent,
                  boxShadow: `0 0 6px ${accent}`,
                }}
              />
              <span
                className="text-[11px] font-semibold tracking-wide truncate"
                style={{ color: '#ff6b6b' }}
              >
                {title}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Minimize"
                onClick={(e) => { e.stopPropagation(); setMinimized((v) => !v) }}
                className="w-4 h-4 grid place-items-center rounded-sm hover:bg-white/10 text-[10px] leading-none"
                style={{ color: '#ffb84d' }}
              >
                {minimized ? '▢' : '-'}
              </button>
              <button
                type="button"
                aria-label="Close"
                onClick={(e) => {
                  e.stopPropagation()
                  setOpen(false)
                  setOpenTick((n) => n + 1)
                  onClose?.()
                }}
                className="w-4 h-4 grid place-items-center rounded-sm hover:bg-white/10 text-[10px] leading-none"
                style={{ color: '#ff4b4b' }}
              >
                ✕
              </button>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {!minimized && (
              <motion.div
                key="body"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                {status && (
                  <div className="px-3 py-2 border-b border-white/5">
                    <div
                      className="text-[10px] font-semibold tracking-widest mb-1.5"
                      style={{ color: '#ff6b6b' }}
                    >
                      TEST SUITE STATUS
                    </div>
                    <div className="space-y-0.5">
                      {status.map((row) => (
                        <div
                          key={row.label}
                          className="flex items-center justify-between text-[10.5px]"
                        >
                          <span className="text-white/70">{row.label}</span>
                          <span
                            className="font-semibold px-1.5 py-px rounded-sm"
                            style={{
                              color: row.value === 'Fail' ? '#ff4b4b' : '#ffb84d',
                              background:
                                row.value === 'Fail'
                                  ? 'rgba(255,75,75,0.12)'
                                  : 'rgba(255,184,77,0.12)',
                              border:
                                row.value === 'Fail'
                                  ? '1px solid rgba(255,75,75,0.35)'
                                  : '1px solid rgba(255,184,77,0.35)',
                            }}
                          >
                            {row.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="px-3 py-2">
                  <div
                    className="text-[10px] font-semibold tracking-widest mb-1"
                    style={{ color: '#ff6b6b' }}
                  >
                    ERROR LOG SUMMARY
                  </div>
                  <div
                    className="max-h-32 overflow-hidden relative"
                    style={{
                      maskImage:
                        'linear-gradient(to bottom, transparent 0%, #000 12%, #000 100%)',
                      WebkitMaskImage:
                        'linear-gradient(to bottom, transparent 0%, #000 12%, #000 100%)',
                    }}
                  >
                    <div className="space-y-px">
                      {lines.slice(-8).map((l, i) => (
                        <div
                          key={`${logCount}-${i}`}
                          className="text-[10px] flex items-start gap-1.5"
                          style={{
                            color: LEVEL_COLORS[l.level?.trim()] || '#ff4b4b',
                          }}
                        >
                          <span className="text-white/40 shrink-0">{l.time}</span>
                          <span
                            className="shrink-0 font-semibold"
                            style={{ minWidth: 38 }}
                          >
                            {l.level}
                          </span>
                          <span className="text-white/85 break-all">
                            {l.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span
                      className="inline-block w-1.5 h-3 animate-pulse"
                      style={{ background: accent }}
                    />
                    <span className="text-[10px] text-white/40">
                      streaming · {logCount} events
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function TestErrorPopups() {
  const [logs1, setLogs1] = useState(() => ERROR_LINES.slice(0, 8))
  const [logs2, setLogs2] = useState(() => ERROR_LINES.slice(4, 14))
  const [totalCloses, setTotalCloses] = useState(0)
  const disabled = totalCloses >= 4

  const handleClose = () => setTotalCloses((n) => n + 1)

  return (
    <>
      <ErrorPopup
        title="test-runner.exe"
        lines={logs1}
        status={STATUS_ROWS}
        accent="#D2042D"
        delay={6000}
        disabled={disabled}
        onClose={handleClose}
      />
      <ErrorPopup
        title="ci-pipeline.log"
        lines={logs2}
        status={null}
        accent="#FFA500"
        delay={3000}
        disabled={disabled}
        onClose={handleClose}
      />
    </>
  )
}
