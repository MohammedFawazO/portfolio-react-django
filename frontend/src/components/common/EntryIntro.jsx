import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { useEntryIntro } from '../../context/EntryIntroContext'

const ZOOM_TRAVEL = 700
const ZOOM_EASE = 0.14
const FALLBACK_SPAN = 8
const TRANSITION_MS = 620
const WHEEL_COOLDOWN = 16
const GESTURE_END_MS = 250
const TOUCH_CLICK_GUARD_MS = 700
const TOUCH_SWIPE_FACTOR = 1.1
const CLICK_PX = 120

export default function EntryIntro() {
  const { markDone } = useEntryIntro()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [show, setShow] = useState(() =>
    isHome && !sessionStorage.getItem('entryIntroShown')
  )
  const [revealed, setRevealed] = useState(false)
  const [zoomStarted, setZoomStarted] = useState(false)
  const [covered, setCovered] = useState(false)
  const [exiting, setExiting] = useState(false)
  const touchStartY = useRef(null)
  const videoRef = useRef(null)
  const sceneRef = useRef(null)
  const rectRef = useRef(null)
  const revealedRef = useRef(false)
  const targetRef = useRef(0)
  const shownRef = useRef(0)
  const spanRef = useRef(FALLBACK_SPAN)
  const originRef = useRef('50% 50%')
  const coveredRef = useRef(false)
  const rafRef = useRef(0)
  const finishedRef = useRef(false)
  const exitingRef = useRef(false)
  const lastWheelRef = useRef(0)
  const gestureSpentRef = useRef(false)
  const lastIntentAtRef = useRef(0)
  const lastTouchAtRef = useRef(-Infinity)
  const overflowRef = useRef('')
  const paddingRef = useRef('')
  const revealRef = useRef(null)
  const advanceRef = useRef(null)
  const intentRef = useRef(null)
  const transitionRef = useRef(null)

  useEffect(() => {
    if (!isHome) {
      markDone()
    }
  }, [isHome, markDone])

  const unlockScroll = () => {
    document.body.style.overflow = overflowRef.current
    document.body.style.paddingRight = paddingRef.current
  }

  useEffect(() => {
    if (!show) return
    const video = videoRef.current
    if (video) {
      video.currentTime = 0
      video.play().catch(() => { })
    }
    window.scrollTo(0, 0)
    overflowRef.current = document.body.style.overflow
    paddingRef.current = document.body.style.paddingRight
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`

    const onWheel = (e) => {
      e.preventDefault()
      const now = Date.now()
      if (now - lastWheelRef.current < WHEEL_COOLDOWN) return
      lastWheelRef.current = now
      const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY
      intentRef.current?.(dy)
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    const preventScroll = (e) => e.preventDefault()
    window.addEventListener('touchmove', preventScroll, { passive: false })
    return () => {
      if (!finishedRef.current) unlockScroll()
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchmove', preventScroll)
    }
  }, [show])

  const applyScale = (p) => {
    const el = sceneRef.current
    if (!el) return
    el.style.transformOrigin = originRef.current
    el.style.transform = `scale(${1 + p * spanRef.current})`
  }

  const measureZoom = () => {
    const scene = sceneRef.current
    const rect = rectRef.current
    if (!scene || !rect) return
    const prevTransform = rect.style.transform
    const prevTransition = rect.style.transition
    rect.style.transition = 'none'
    rect.style.transform = 'scaleY(1)'
    const s = scene.getBoundingClientRect()
    const r = rect.getBoundingClientRect()
    rect.style.transform = prevTransform
    rect.style.transition = prevTransition
    const hw = r.width / 2
    const hh = r.height / 2
    if (hw < 2 || hh < 2) {
      spanRef.current = FALLBACK_SPAN
      return
    }
    const cx = (r.left + r.width / 2 - s.left) / s.width
    const cy = (r.top + r.height / 2 - s.top) / s.height
    const ox = cx * s.width
    const oy = cy * s.height
    const needed = Math.max(
      ox / hw,
      (s.width - ox) / hw,
      oy / hh,
      (s.height - oy) / hh,
    )
    originRef.current = `${cx * 100}% ${cy * 100}%`
    spanRef.current = Math.max(1, needed - 1)
    applyScale(shownRef.current)
  }

  const startTransition = () => {
    if (finishedRef.current) return
    finishedRef.current = true
    if (videoRef.current) videoRef.current.pause()
    markDone()
    exitingRef.current = true
    setExiting(true)
    setTimeout(() => {
      setShow(false)
      unlockScroll()
    }, TRANSITION_MS)
  }

  const runZoom = () => {
    const target = targetRef.current
    const next = shownRef.current + (target - shownRef.current) * ZOOM_EASE
    if (Math.abs(target - next) < 0.0005) {
      shownRef.current = target
      applyScale(target)
      rafRef.current = 0
      if (target >= 1) setCovered(true)
      return
    }
    shownRef.current = next
    applyScale(next)
    rafRef.current = requestAnimationFrame(runZoom)
  }

  const advanceZoom = (deltaPx) => {
    if (finishedRef.current || exitingRef.current || coveredRef.current) return
    const before = targetRef.current
    const next = Math.min(1, Math.max(0, before + deltaPx / ZOOM_TRAVEL))
    if (before <= 0 && next > 0) {
      measureZoom()
      if (videoRef.current) videoRef.current.pause()
      setZoomStarted(true)
    }
    if (next === before) return
    targetRef.current = next
    if (next >= 1) {
      coveredRef.current = true
      setCovered(true)
    }
    if (!rafRef.current) rafRef.current = requestAnimationFrame(runZoom)
  }

  const reveal = () => {
    revealedRef.current = true
    setRevealed(true)
  }

  const handleScrollIntent = (deltaPx) => {
    if (finishedRef.current || exitingRef.current) return
    const now = performance.now()
    const newGesture = now - lastIntentAtRef.current >= GESTURE_END_MS
    if (newGesture) gestureSpentRef.current = false
    lastIntentAtRef.current = now
    if (!revealedRef.current) {
      revealRef.current?.()
      gestureSpentRef.current = true
      return
    }
    if (gestureSpentRef.current) return
    if (coveredRef.current) {
      if (newGesture) transitionRef.current?.()
      return
    }
    advanceRef.current?.(deltaPx)
  }

  useEffect(() => {
    revealedRef.current = revealed
    revealRef.current = reveal
    advanceRef.current = advanceZoom
    intentRef.current = handleScrollIntent
    transitionRef.current = startTransition
  })

  return (
    <>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black cursor-pointer select-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: exiting ? 0 : 1 }}
          transition={{ duration: exiting ? TRANSITION_MS / 1000 : 0, ease: [0.4, 0, 0.2, 1] }}
          onClick={() => {
            if (performance.now() - lastTouchAtRef.current < TOUCH_CLICK_GUARD_MS) return
            if (!revealed) reveal()
            else if (coveredRef.current) startTransition()
            else advanceZoom(CLICK_PX)
          }}
          onTouchStart={(e) => {
            lastTouchAtRef.current = performance.now()
            touchStartY.current = e.touches[0].clientY
          }}
          onTouchEnd={(e) => {
            lastTouchAtRef.current = performance.now()
            if (touchStartY.current === null) return
            const deltaY = e.changedTouches[0].clientY - touchStartY.current
            if (deltaY < -40) handleScrollIntent(deltaY * -TOUCH_SWIPE_FACTOR)
            touchStartY.current = null
          }}
        >
          <div
            ref={sceneRef}
            className="w-full h-full"
            style={{
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
          </div>

          <div
            className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none"
            style={{
              opacity: zoomStarted && !covered ? 0 : 1,
              transition: 'opacity 0.3s ease-out',
            }}
          >
            <span className="text-white/70 text-xs uppercase tracking-[0.3em] font-light">
              {!revealed ? 'Click or scroll to reveal' : covered ? 'Scroll again to enter' : 'Scroll to enter'}
            </span>
          </div>
        </motion.div>
      )}
    </>
  )
}