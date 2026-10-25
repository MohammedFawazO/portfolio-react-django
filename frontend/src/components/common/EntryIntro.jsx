import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { useEntryIntro } from '../../context/EntryIntroContext'

const ZOOM_TRAVEL = 700
// Exponential follow rate. The old 0.22 left the rendered scale roughly four
// frames behind the scroll target, and its asymptotic tail kept crawling for
// ~0.3s after the finger/wheel stopped - most noticeable at the end of the
// zoom, where it read as a lag. A higher rate keeps the visual locked to the
// input, and the larger snap threshold ends the invisible tail while the
// black screen is already covering the frame.
const ZOOM_RATE = 0.4
const ZOOM_SNAP = 0.004
const FRAME_MS = 1000 / 60
const FALLBACK_SPAN = 8
const TRANSITION_MS = 620
const HERO_REVEAL_MS = 1000
const TRANSITION_S = TRANSITION_MS / 1000
const TRANSITION_EASE = [0.4, 0, 0.2, 1]
// The overlay covers the viewport width well before it covers the height, so
// the zoom used to keep scaling (up to ~14x on a phone, ~5.7x on a laptop) just
// to reach the top and bottom. That last stretch is where the compositor has to
// re-raster the scaled video layer at a huge size, which is the lag at the end
// of the desktop zoom. Stop scaling at the horizontal fit and grow the
// remaining black area vertically instead - cheap, sharp, and it lands on the
// same full-black frame.
const FILL_MS = 520
const FILL_EASE = 'cubic-bezier(0.33, 1, 0.68, 1)'
const WHEEL_COOLDOWN = 16
const GESTURE_END_MS = 250
const TOUCH_CLICK_GUARD_MS = 700
const TOUCH_SWIPE_FACTOR = 1.1
const TOUCH_TAP_SLOP = 40
const MOBILE_BREAKPOINT = 768
const DESKTOP_INTRO_SRC = '/media/entry-intro.mp4'
const MOBILE_INTRO_SRC = '/media/mobile%20intro%20.mp4'
// Temporary switch: the zoom into the scene is off on a phone while the
// mobile overlays are sized by hand. Set it back to false when they are right.
const MOBILE_ZOOM_OFF = false
// Temporary switch: the touch scroll lock. It is on by default and only the
// scroll driven zoom above is held back on a phone.
const SCROLL_LOCK_OFF = false

export default function EntryIntro() {
  const { markDone } = useEntryIntro()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT
  )

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const introSrc = isMobile ? MOBILE_INTRO_SRC : DESKTOP_INTRO_SRC
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
  const fillRef = useRef(null)
  const fillStartedRef = useRef(false)
  const fillTimeoutRef = useRef(0)
  const widthProgressRef = useRef(1)
  const revealedRef = useRef(false)
  const targetRef = useRef(0)
  const shownRef = useRef(0)
  const spanRef = useRef(FALLBACK_SPAN)
  const originRef = useRef('50% 50%')
  const coveredRef = useRef(false)
  const rafRef = useRef(0)
  const lastFrameRef = useRef(0)
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
      // Leaving the home route mid-intro must take the overlay down with it.
      // `show` is only ever initialised once, so without this the full-screen
      // black intro stays parked over the whole site.
      setShow(false)
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
    // The touch scroll lock. It keeps one finger from dragging the page under
    // the overlay, but it lets a two finger gesture through so the pinch zoom
    // on a phone still works - the overlay's touch-action already makes the
    // browser refuse the pan on its own.
    const preventScroll = (e) => {
      if (SCROLL_LOCK_OFF) return
      if (e.touches.length > 1) return
      e.preventDefault()
    }
    window.addEventListener('touchmove', preventScroll, { passive: false })
    return () => {
      if (!finishedRef.current) unlockScroll()
      cancelAnimationFrame(rafRef.current)
      clearTimeout(fillTimeoutRef.current)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchmove', preventScroll)
    }
  }, [show])

  // The zoom has just reached the point where the black screen overlay spans
  // the full width. Freeze the scale there and let a plain black layer grow
  // from the overlay's current on-screen box up and down to the viewport
  // edges, so the transition finishes vertically without an extra zoom step.
  const beginFill = () => {
    if (fillStartedRef.current) return
    fillStartedRef.current = true
    targetRef.current = Math.min(targetRef.current, widthProgressRef.current)
    const rect = rectRef.current
    const flood = fillRef.current
    if (!rect || !flood) {
      coveredRef.current = true
      setCovered(true)
      return
    }
    const box = rect.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    // Start as a full-width black sheet squashed to exactly the overlay's
    // vertical span, then scale it up about the overlay's centre. Animating
    // transform keeps the fill on the compositor; animating top/height forced
    // a layout and repaint of a full-screen layer every frame, which is what
    // read as jumpy.
    const startScale = Math.max(0.001, box.height / vh)
    flood.style.display = 'block'
    flood.style.transition = 'none'
    flood.style.left = '0px'
    flood.style.top = '0px'
    flood.style.width = `${vw}px`
    flood.style.height = `${vh}px`
    flood.style.transformOrigin = `50% ${box.top + box.height / 2}px`
    flood.style.transform = `scaleY(${startScale})`
    // Flush the starting box before arming the transition, otherwise the
    // browser coalesces both style writes and the layer never animates.
    void flood.offsetHeight
    flood.style.transition = `transform ${FILL_MS}ms ${FILL_EASE}`
    flood.style.transform = 'scaleY(1)'
    fillTimeoutRef.current = setTimeout(() => {
      if (coveredRef.current) return
      coveredRef.current = true
      setCovered(true)
    }, FILL_MS)
  }

  const applyScale = (p) => {
    const el = sceneRef.current
    if (!el) return
    el.style.transformOrigin = originRef.current
    // Temporary: the zoom into the scene is switched off on a phone so the
    // mobile overlays can be sized by hand - zoom the page and read the
    // numbers off. Everything else still runs; only the scale is held at 1.
    if (isMobile && MOBILE_ZOOM_OFF) {
      el.style.transform = 'scale(1)'
      return
    }
    if (widthProgressRef.current < 1 && p >= widthProgressRef.current) {
      el.style.transform = `scale(${1 + widthProgressRef.current * spanRef.current})`
      beginFill()
      return
    }
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
    const neededX = Math.max(ox / hw, (s.width - ox) / hw)
    const neededY = Math.max(oy / hh, (s.height - oy) / hh)
    const needed = Math.max(neededX, neededY)
    originRef.current = `${cx * 100}% ${cy * 100}%`
    spanRef.current = Math.max(1, needed - 1)
    // Fraction of the zoom travel at which the overlay first covers the
    // viewport horizontally. On a phone that is usually only a fifth of the
    // way, which is why the rest is handed over to the vertical fill.
    widthProgressRef.current = Math.min(
      1,
      Math.max(0, (neededX - 1) / spanRef.current),
    )
    applyScale(shownRef.current)
  }

  const startTransition = () => {
    if (finishedRef.current) return
    finishedRef.current = true
    if (videoRef.current) videoRef.current.pause()
    exitingRef.current = true
    cancelAnimationFrame(rafRef.current)
    rafRef.current = 0
    lastFrameRef.current = 0

    // Both layers are full-screen black, so the overlay fade and the Hero curtain
    // overlap into one continuous motion. markDone() fires partway through the fade
    // so the curtain is already moving when the overlay lifts, with no dead beat.
    // Scroll stays locked until the reveal has settled - releasing it early forces
    // a whole-document reflow underneath the animating curtain.
    setExiting(true)
    setTimeout(markDone, TRANSITION_MS * 0.4)
    setTimeout(() => setShow(false), TRANSITION_MS)
    setTimeout(unlockScroll, TRANSITION_MS + HERO_REVEAL_MS)
  }

  const runZoom = (ts) => {
    const target = targetRef.current
    const last = lastFrameRef.current
    lastFrameRef.current = ts
    const dt = last ? Math.min(ts - last, 64) : FRAME_MS

    // Exponential smoothing normalised by elapsed time, so the zoom tracks the
    // target at the same speed on 60Hz and 120Hz and never stalls between ticks.
    const k = 1 - (1 - ZOOM_RATE) ** (dt / FRAME_MS)
    const next = shownRef.current + (target - shownRef.current) * k

    if (Math.abs(target - next) < ZOOM_SNAP) {
      shownRef.current = target
      applyScale(target)
      rafRef.current = 0
      lastFrameRef.current = 0
      // Flip `covered` only once the zoom has visually landed, so the prompt
      // change and the next gesture never land mid-tween.
      if (target >= 1 && !coveredRef.current) {
        coveredRef.current = true
        setCovered(true)
      }
      return
    }
    shownRef.current = next
    applyScale(next)
    rafRef.current = requestAnimationFrame(runZoom)
  }

  const pumpZoom = () => {
    if (rafRef.current) return
    lastFrameRef.current = 0
    rafRef.current = requestAnimationFrame(runZoom)
  }

  const advanceZoom = (deltaPx) => {
    if (finishedRef.current || exitingRef.current || coveredRef.current) return
    if (fillStartedRef.current) return
    const before = targetRef.current
    // Measure before clamping the target: the cap is the horizontal-fit
    // fraction, which is exactly the point where the expensive scaling ends.
    if (before <= 0 && deltaPx > 0) {
      measureZoom()
      if (videoRef.current) videoRef.current.pause()
      setZoomStarted(true)
    }
    const cap = Math.min(1, widthProgressRef.current)
    const next = Math.min(cap, Math.max(0, before + deltaPx / ZOOM_TRAVEL))
    if (next === before) return
    targetRef.current = next
    pumpZoom()
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

  // The "again to enter" step sits over the black panels the reveal just
  // raised, so that hint alone uses light ink. The earlier reveal/zoom hints
  // stay on the site's dark ink because they sit over the bright clip.
  //
  // The hint names the gesture that actually works at each step. A click or a
  // tap only lifts the black panels over the screens - the zoom and the entry
  // are driven by the scroll gesture on both platforms (a wheel on desktop, an
  // upward swipe on a phone).
  const hintLabel = !revealed
    ? isMobile
      ? 'Tap or swipe up to reveal'
      : 'Click or scroll to reveal'
    : covered
      ? isMobile
        ? 'Swipe up again to enter'
        : 'Scroll again to enter'
      : isMobile
        ? 'Swipe up to zoom in'
        : 'Scroll to zoom in'

  return (
    <>
      {show && (
        <motion.div
          className="fixed inset-0 max-h-[100dvh] z-[100] bg-black cursor-pointer select-none"
          style={{
            pointerEvents: exiting ? 'none' : 'auto',
            // pinch-zoom, and nothing else: the browser refuses the one finger
            // pan itself, so the script never has to cancel a touch and the
            // pinch on a phone survives.
            touchAction: 'pinch-zoom',
          }}
          initial={{ opacity: 1 }}
          animate={{ opacity: exiting ? 0 : 1 }}
          transition={{ duration: exiting ? TRANSITION_S : 0, ease: TRANSITION_EASE }}
          onClick={() => {
            if (performance.now() - lastTouchAtRef.current < TOUCH_CLICK_GUARD_MS) return
            // A click only lifts the black panels over the screens. The zoom
            // and the entry belong to the scroll gesture, on both platforms.
            reveal()
          }}
          onTouchStart={(e) => {
            lastTouchAtRef.current = performance.now()
            touchStartY.current = e.touches[0].clientY
          }}
          onTouchEnd={(e) => {
            lastTouchAtRef.current = performance.now()
            if (touchStartY.current === null) return
            const deltaY = e.changedTouches[0].clientY - touchStartY.current
            touchStartY.current = null
            if (deltaY < -TOUCH_TAP_SLOP) {
              handleScrollIntent(deltaY * -TOUCH_SWIPE_FACTOR)
            } else if (Math.abs(deltaY) < TOUCH_TAP_SLOP) {
              // A tap is the phone's version of a click - it lifts the panels.
              reveal()
            }
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
                key={introSrc}
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
                src={introSrc}
              />
            </motion.div>

            {/* Decorative shapes. The desktop clip is a landscape frame, so the
                overlays sit over the two monitors of that composition. The
                mobile clip is a portrait crop of the same room, so it carries its
                own pair of overlays - the desktop ones would land on the wall
                and the floor instead of the screens.

                The boxes are shares of the frame, never pixels. The clip fills
                the frame outright, so a percentage here is a percentage of the
                picture and of the screen at the same time: the panels keep
                their size relative to the screen whatever the window is, and
                only the absolute size follows it. The mobile numbers were cut
                against a 440 x 956 viewport and the desktop ones against a
                laptop. */}
            <svg
              className={`absolute pointer-events-none overflow-visible ${
                isMobile
                  ? 'top-[41.2%] left-[19.2%] w-[14.2%] h-[8.4%]'
                  : 'top-[39.6%] left-[20.8%] w-[12%] h-[20.3%]'
              }`}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              style={{
                transformOrigin: 'bottom center',
                transform: `scaleY(${revealed ? 1 : 0})`,
                opacity: revealed ? 1 : 0,
                // Only the transform is transitioned. An opacity fade would run
                // the panel at partial alpha while it grows, so a black cover
                // reads as a grey wash over the bright room and the code
                // behind it shows through.
                transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {/* Both panels are trapezoids: the top edge stays level and in
                  place while the bottom right corner rides up and the bottom
                  left corner drops and shifts in, the way the screen sits in
                  the clip. A rotation would have swung the top edge with it,
                  so the shape is cut directly instead - the box overflows its
                  viewBox, which is why the svg is allowed to overflow. */}
              <path
                d={isMobile ? 'M12 0 H96 V100 L12 104 Z' : 'M3 0 H100 V96 L4 104 Z'}
                fill="black"
              />
            </svg>
            <div
              ref={rectRef}
              className={`absolute bg-black rounded-sm pointer-events-none ${
                isMobile
                  ? 'top-[41.2%] left-[35.5%] w-[26.2%] h-[7.2%]'
                  : 'top-[39.7%] left-[35.6%] w-[26.5%] h-[17.9%]'
              }`}
              style={{
                transformOrigin: 'bottom center',
                transform: `scaleY(${revealed ? 1 : 0})`,
                opacity: revealed ? 1 : 0,
                transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          </div>

          {/* Grows the horizontal-fit overlay into a full-screen black frame
              instead of zooming the clip past the point where the width fits.
              It is driven imperatively from beginFill so the transition can be
              measured from the overlay's real box. */}
          <div
            ref={fillRef}
            aria-hidden="true"
            className="absolute z-[2] bg-black pointer-events-none"
            style={{ display: 'none' }}
          />

          <div
            className={`absolute inset-x-0 z-[3] flex justify-center px-5 pointer-events-none ${
              isMobile
                ? 'bottom-[calc(env(safe-area-inset-bottom)+1.75rem)]'
                : 'bottom-5'
            }`}
            style={{
              opacity: zoomStarted && !covered ? 0 : 1,
              transition: 'opacity 0.3s ease-out',
            }}
          >
            <span
              className={`max-w-full text-center text-[13px] leading-relaxed uppercase tracking-[0.25em] font-medium sm:text-[14px] sm:tracking-[0.3em] ${
                covered ? 'text-[#F5F7F7]' : isMobile ? 'text-black' : 'text-[#323232]'
              }`}
            >
              {hintLabel}
            </span>
          </div>
        </motion.div>
      )}
    </>
  )
}
