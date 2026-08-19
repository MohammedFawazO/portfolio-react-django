import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useVideoScrubber({
  videoRef,
  heroRef,
  pinRef,
  options = {}
}) {
  const {
    scrub = 0.5,
    scrollMultiplier = 1500
  } = options

  const ctxRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    const hero = heroRef.current
    const pin = pinRef.current

    if (!video || !hero || !pin) return

    let targetTime = 0
    let lastWritten = -1
    let rafQueued = false
    let rafId = null
    let ready = false
    let disposed = false
    let duration = 0
    let lastWriteTime = 0

    const EPSILON = 0.005
    const MIN_INTERVAL = 1000 / 30

    function clampTime(t) {
      return Math.max(0, Math.min(t, duration - 0.001))
    }

    function seek(time) {
      const clamped = clampTime(time)
      const delta = Math.abs(clamped - lastWritten)
      if (delta < EPSILON) return
      video.currentTime = clamped
      lastWritten = clamped
    }

    function tick(now) {
      rafId = null
      rafQueued = false

      if (disposed || !ready) return

      if (now - lastWriteTime < MIN_INTERVAL) {
        rafQueued = true
        rafId = requestAnimationFrame(tick)
        return
      }

      lastWriteTime = now
      seek(targetTime)
    }

    function notify(newTime) {
      targetTime = newTime
      if (!rafQueued && ready && !disposed) {
        rafQueued = true
        rafId = requestAnimationFrame(tick)
      }
    }

    function onCanPlay() {
      if (ready || disposed) return

      duration = video.duration
      video.currentTime = 0
      lastWritten = 0
      ready = true

      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: hero,
          start: 'top top',
          end: () => `+=${duration * scrollMultiplier}`,
          scrub: scrub,
          pin: pin,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,

          onUpdate: (self) => {
            if (disposed || !ready) return
            notify(self.progress * duration)
          },

          onLeave: () => {
            if (disposed || !ready) return
            seek(duration)
          },

          onLeaveBack: () => {
            if (disposed || !ready) return
            seek(0)
          }
        })
      }, hero)

      ctxRef.current = ctx
    }

    video.addEventListener('canplay', onCanPlay, { once: true })
    video.pause()

    return () => {
      disposed = true

      if (rafId !== null) {
        cancelAnimationFrame(rafId)
        rafId = null
        rafQueued = false
      }

      video.removeEventListener('canplay', onCanPlay)

      if (ctxRef.current) {
        ctxRef.current.revert()
        ctxRef.current = null
      }

      video.pause()
    }
  }, [videoRef, heroRef, pinRef, scrub, scrollMultiplier])
}
