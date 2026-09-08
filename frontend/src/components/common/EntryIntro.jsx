import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { useEntryIntro } from '../../context/EntryIntroContext'

export default function EntryIntro() {
  const { markDone } = useEntryIntro()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [show, setShow] = useState(() =>
    isHome && !sessionStorage.getItem('entryIntroShown')
  )
  const touchStartY = useRef(null)
  const videoRef = useRef(null)
  const [revealed, setRevealed] = useState(false)
  const [zoomProgress, setZoomProgress] = useState(0)
  const [zoomOrigin, setZoomOrigin] = useState('center')
  const sceneRef = useRef(null)
  const rectRef = useRef(null)
  const revealedRef = useRef(false)
  revealedRef.current = revealed
  const progressRef = useRef(0)
  const finishedRef = useRef(false)
  const lastWheelRef = useRef(0)
  const overflowRef = useRef('')
  const revealTimeRef = useRef(0)

  const WHEEL_STEP = 0.08
  const CLICK_STEP = 0.08
  const ZOOM_COMPLETE = 0.6
  const WHEEL_COOLDOWN = 16
  const SHAPE_REVEAL_MS = 750
  const OVERLAY_REMOVE_MS = 120
  const TRANSITION_DONE = 3500
  const MAX_ZOOM = 1

  useEffect(() => {
    if (!isHome) {
      markDone()
    }
  }, [isHome, markDone])

  useEffect(() => {
    if (!show) return
    const video = videoRef.current
    if (video) {
      video.currentTime = 0
      video.play().catch(() => { })
    }
    window.scrollTo(0, 0)
    overflowRef.current = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onWheel = (e) => {
      e.preventDefault()
      const now = Date.now()
      const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY
      const ady = Math.abs(dy)
      const isTrackpad = e.deltaMode === 0 && ady < 50
      const since = now - lastWheelRef.current
      if (since < WHEEL_COOLDOWN && !(isTrackpad && since < 80)) return
      lastWheelRef.current = now
      if (!revealedRef.current) {
        revealRef.current?.()
      } else if (now - revealTimeRef.current >= SHAPE_REVEAL_MS) {
        const intensity = isTrackpad
          ? Math.min(1, ady / 30)
          : Math.min(1, ady / 100)
        const step = isTrackpad
          ? WHEEL_STEP * (0.5 + intensity * 0.8)
          : WHEEL_STEP * (0.4 + intensity * 0.6)
        advanceRef.current?.(Math.sign(dy) * step)
      }
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    const preventScroll = (e) => e.preventDefault()
    window.addEventListener('touchmove', preventScroll, { passive: false })
    return () => {
      if (!finishedRef.current) document.body.style.overflow = overflowRef.current
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchmove', preventScroll)
    }
  }, [show])

  const computeOrigin = () => {
    const scene = sceneRef.current
    const rect = rectRef.current
    if (scene && rect) {
      const s = scene.getBoundingClientRect()
      const r = rect.getBoundingClientRect()
      const cx = ((r.left + r.right) / 2 - s.left) / s.width * 100
      const cy = ((r.top + r.bottom) / 2 - s.top) / s.height * 100
      setZoomOrigin(`${cx}% ${cy}%`)
    }
  }

  const advanceZoom = (amount) => {
    if (finishedRef.current) return
    const next = Math.min(1, Math.max(0, progressRef.current + amount))
    if (progressRef.current === 0 && next > 0) {
      computeOrigin()
      if (videoRef.current) videoRef.current.pause()
    }
    progressRef.current = next
    setZoomProgress(next)
  }
  const advanceRef = useRef(advanceZoom)
  advanceRef.current = advanceZoom

  const reveal = () => {
    if (!show) return
    setRevealed(true)
    revealTimeRef.current = Date.now()
  }
  const revealRef = useRef(reveal)
  revealRef.current = reveal

  useEffect(() => {
    if (revealed && zoomProgress >= ZOOM_COMPLETE && !finishedRef.current) {
      finishedRef.current = true
      const v = videoRef.current
      if (v) v.pause()
      markDone()
      document.body.style.overflow = 'hidden'
      setTimeout(() => setShow(false), OVERLAY_REMOVE_MS)
      setTimeout(() => { document.body.style.overflow = overflowRef.current }, TRANSITION_DONE)
    }
  }, [zoomProgress, revealed, markDone])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black cursor-pointer select-none"
          initial={{ opacity: 1 }}
          onClick={() => {
            if (!revealed) reveal()
            else if (Date.now() - revealTimeRef.current >= SHAPE_REVEAL_MS) advanceZoom(CLICK_STEP)
          }}
          onTouchStart={(e) => {
            touchStartY.current = e.touches[0].clientY
          }}
          onTouchEnd={(e) => {
            if (touchStartY.current === null) return
            const deltaY = e.changedTouches[0].clientY - touchStartY.current
            if (deltaY < -40) {
              if (!revealed) reveal()
              else if (Date.now() - revealTimeRef.current >= SHAPE_REVEAL_MS) advanceZoom(WHEEL_STEP)
            }
            touchStartY.current = null
          }}
        >
          <div
            ref={sceneRef}
            className="w-full h-full"
            style={{
              transformOrigin: zoomOrigin,
              transform: `scale(${1 + Math.min(zoomProgress, ZOOM_COMPLETE) * 18})`,
              transition: 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
              willChange: 'transform',
              backfaceVisibility: 'hidden',
            }}
          >
            <motion.div
              className="w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <video
                ref={videoRef}
                className="w-full h-full object-fill"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                onEnded={(e) => {
                  e.currentTarget.currentTime = 0
                  e.currentTarget.play().catch(() => { })
                }}
                src="/media/entry-intro.mp4"
              />
            </motion.div>

            {/* Decorative shapes */}
            <svg
              className="absolute bottom-[calc(55%_-_6.5rem)] left-[20.5%] w-44 h-40 pointer-events-none"
              viewBox="0 0 176 160"
              preserveAspectRatio="none"
              style={{
                transformOrigin: 'bottom center',
                transform: `scaleY(${revealed ? 1 : 0})`,
                opacity: revealed ? 1 : 0,
                transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.7s ease-out',
              }}
            >
              <path
                d="M14 32 L162 34 L162 136 L14 140 Z"
                fill="black"
                stroke="black"
                strokeWidth="10"
                strokeLinejoin="round"
              />
            </svg>
            <div
              ref={rectRef}
              className="absolute bottom-[43%] right-[38.3%] w-89 h-25.5 bg-black rounded-sm pointer-events-none"
              style={{
                transformOrigin: 'bottom center',
                transform: `scaleY(${revealed ? 1 : 0})`,
                opacity: revealed ? 1 : 0,
                transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.7s ease-out',
              }}
            />

          <div
            className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none"
            style={{ opacity: zoomProgress > 0.02 ? 0 : 1, transition: 'opacity 0.3s ease-out' }}
          >
            <span className="text-white/70 text-xs uppercase tracking-[0.3em] font-light">
              {!revealed ? 'Click or scroll to reveal' : zoomProgress < 1 ? 'Scroll to enter' : ''}
            </span>
          </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
