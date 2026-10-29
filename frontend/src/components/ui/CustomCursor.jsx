import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
function vec2(x, y) {
  return {
    x, y,
    clone() { return vec2(this.x, this.y) },
    sub(v) { return vec2(this.x - v.x, this.y - v.y) },
    lerp(target, amount) {
      this.x += (target.x - this.x) * amount
      this.y += (target.y - this.y) * amount
    },
    copy(v) {
      this.x = v.x
      this.y = v.y
    }
  }
}

function qAxisAngle(ax, ay, az, angle) {
  const h = angle / 2
  const s = Math.sin(h)
  return { w: Math.cos(h), x: ax * s, y: ay * s, z: az * s }
}

function qMul(a, b) {
  return {
    w: a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z,
    x: a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
    y: a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x,
    z: a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w
  }
}

function qNormalize(q) {
  const l = Math.hypot(q.w, q.x, q.y, q.z) || 1
  return { w: q.w / l, x: q.x / l, y: q.y / l, z: q.z / l }
}

function qToMatrix3d(q) {
  const { w, x, y, z } = q
  const xx = x * x, yy = y * y, zz = z * z
  const xy = x * y, xz = x * z, yz = y * z
  const wx = w * x, wy = w * y, wz = w * z
  const r00 = 1 - 2 * (yy + zz)
  const r01 = 2 * (xy - wz)
  const r02 = 2 * (xz + wy)
  const r10 = 2 * (xy + wz)
  const r11 = 1 - 2 * (xx + zz)
  const r12 = 2 * (yz - wx)
  const r20 = 2 * (xz - wy)
  const r21 = 2 * (yz + wx)
  const r22 = 1 - 2 * (xx + yy)
  return `matrix3d(${r00},${r10},${r20},0,${r01},${r11},${r21},0,${r02},${r12},${r22},0,0,0,0,1)`
}

// The cube is a desktop-only pointer effect: a phone or tablet has no pointer
// to follow, and the `cursor: none` rule below would only strip the native
// cursor from a device that never had one to spare. 768 matches the mobile
// breakpoint used elsewhere (EntryIntro), the pointer query catches touch-only
// tablets and laptops in the 768+ range.
function isCursorSupported() {
  if (typeof window === 'undefined') return false
  if (window.innerWidth < 768) return false
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return false
  return true
}

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const ctaRef = useRef(null)
  const menuBtnRef = useRef(null)
  const [enabled, setEnabled] = useState(isCursorSupported)

  // Re-evaluate on resize / rotation so a window dragged across the desktop
  // breakpoint boundary (or a phone turning landscape) picks the cursor up or
  // drops it without a reload.
  useEffect(() => {
    const update = () => setEnabled(isCursorSupported())
    update()
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])

  useEffect(() => {
    // Disabled means the refs below were never rendered, so bail before
    // touching them.
    if (!enabled) return undefined
    class CursorClass {
      constructor(targetEl) {
        this.el = targetEl
        this.position = {
          previous: vec2(-100, -100),
          current: vec2(-100, -100),
          target: vec2(-100, -100),
          lerpAmount: 0.1
        }
        this.scale = {
          previous: 1,
          current: 1,
          target: 1,
          lerpAmount: 0.1
        }
        this.isHovered = false
        this.hoverEl = null
        this.hoverActive = false
        this.rollEl = this.el.querySelector('.spinner')
        this.quat = qNormalize(qMul(
          qAxisAngle(0, 1, 0, -25 * (Math.PI / 180)),
          qAxisAngle(1, 0, 0, -20 * (Math.PI / 180))
        ))
        const cx = window.innerWidth / 2
        const cy = window.innerHeight / 2
        const introShown = typeof sessionStorage !== 'undefined' && sessionStorage.getItem('cubeIntroShown')
        this.intro = {
          active: !introShown,
          start: introShown ? 0 : performance.now(),
          duration: 800,
          from: introShown ? vec2(cx, cy) : vec2(cx, -80),
          to: vec2(cx, cy)
        }
        if (introShown) {
          this.position.previous.copy(vec2(cx, cy))
          this.position.current.copy(vec2(cx, cy))
          this.position.target.copy(vec2(cx, cy))
        } else {
          this.position.previous.copy(this.intro.from)
          this.position.current.copy(this.intro.from)
          this.position.target.copy(this.intro.from)
        }
        this.addListeners()
      }

      update() {
        if (this.intro.active) {
          let t = (performance.now() - this.intro.start) / this.intro.duration
          if (t > 1) t = 1
          const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
          this.position.current.x =
            this.intro.from.x + (this.intro.to.x - this.intro.from.x) * e
          this.position.current.y =
            this.intro.from.y + (this.intro.to.y - this.intro.from.y) * e
          if (t >= 1) {
            this.intro.active = false
            // Private browsing / blocked storage: the flag is best-effort only.
            try { sessionStorage.setItem('cubeIntroShown', '1') } catch { /* ignore */ }
            this.position.target.x = this.intro.to.x
            this.position.target.y = this.intro.to.y
            this.position.previous.x = this.position.current.x
            this.position.previous.y = this.position.current.y
          }
        } else {
          this.position.current.lerp(this.position.target, this.position.lerpAmount)
        }
        this.scale.current = gsap.utils.interpolate(
          this.scale.current,
          this.scale.target,
          this.scale.lerpAmount
        )
        const delta = this.position.current.clone().sub(this.position.previous)
        this.position.previous.copy(this.position.current)
        this.scale.previous = this.scale.current
        gsap.set(this.el, {
          x: this.position.current.x,
          y: this.position.current.y
        })
        if (this.rollEl) {
          const dist = Math.sqrt(delta.x * delta.x + delta.y * delta.y)
          if (dist > 0.001) {
            let ax = -delta.y
            let ay = delta.x
            const al = Math.sqrt(ax * ax + ay * ay) || 1
            ax /= al
            ay /= al
            const angle = dist / 30
            this.quat = qNormalize(qMul(qAxisAngle(ax, ay, 0, angle), this.quat))
          }
          this.rollEl.style.transform = qToMatrix3d(this.quat)
        }
      }

      setHover(active) {
        if (this.hoverActive === active) return
        this.hoverActive = active
        this.el.classList.toggle('hovered', active)
        gsap.to(this.el, {
          scaleX: active ? 0.5 : 1,
          scaleY: active ? 0.5 : 1,
          duration: 0.25,
          ease: 'sine.inOut',
          overwrite: 'auto'
        })
      }

      // The cube always tracks the real pointer. Hovering only changes its
      // size (shrink on enter, restore on leave); it never gets magnetised
      // toward the centre of the hovered element, which used to yank it away
      // from the pointer and fight the click target underneath.
      updateTargetPosition(x, y) {
        this.position.target.x = x
        this.position.target.y = y
        this.setHover(Boolean(this.isHovered && this.hoverEl))
      }

      addListeners() {
        gsap.utils.toArray('[data-hover]').forEach((hoverEl) => {
          const hoverBoundsEl = hoverEl.querySelector('[data-hover-bounds]')
          if (hoverBoundsEl) {
            hoverBoundsEl.addEventListener('pointerover', () => {
              this.isHovered = true
              this.hoverEl = hoverBoundsEl
            })
            hoverBoundsEl.addEventListener('pointerout', () => {
              this.isHovered = false
              this.hoverEl = null
            })
          }
          const xTo = gsap.quickTo(hoverEl, 'x', {
            duration: 1,
            ease: 'elastic.out(1, 0.3)'
          })
          const yTo = gsap.quickTo(hoverEl, 'y', {
            duration: 1,
            ease: 'elastic.out(1, 0.3)'
          })
          hoverEl.addEventListener('pointermove', (event) => {
            const { clientX: cx, clientY: cy } = event
            const { height, width, left, top } = hoverEl.getBoundingClientRect()
            const x = cx - (left + width / 2)
            const y = cy - (top + height / 2)
            xTo(x * 0.2)
            yTo(y * 0.2)
          })
          hoverEl.addEventListener('pointerout', () => {
            xTo(0)
            yTo(0)
          })
        })

        const hoverSelector =
          'a, button, [role="button"], input, textarea, select, [data-hover], [data-hover-bounds], [class*="hover:"], [class*="cursor-pointer"]'

        this.onPointerOver = (event) => {
          const target = event.target
          if (!(target instanceof Element)) return
          const hoverTarget = target.closest(hoverSelector)
          if (hoverTarget) {
            this.isHovered = true
            this.hoverEl = hoverTarget
            this.setHover(true)
          }
        }

        this.onPointerOut = (event) => {
          if (!this.isHovered || !this.hoverEl) return
          const target = event.target
          if (!(target instanceof Element)) return
          const hoverTarget = target.closest(hoverSelector)
          if (hoverTarget !== this.hoverEl) return
          const related = event.relatedTarget
          const next =
            related instanceof Element ? related.closest(hoverSelector) : null
          if (!next) {
            this.isHovered = false
            this.hoverEl = null
            this.setHover(false)
          }
        }

        document.addEventListener('pointerover', this.onPointerOver)
        document.addEventListener('pointerout', this.onPointerOut)
      }
    }

    const cursor = new CursorClass(cursorRef.current)
    const cta = ctaRef.current
    const menuBtn = menuBtnRef.current

    function update() {
      cursor.update()
    }

    function onMouseMove(event) {
      if (cursor.intro.active) return
      const x = event.clientX
      const y = event.clientY
      cursor.updateTargetPosition(x, y)
    }

    function onResize() {
      if (menuBtn) {
        const { x, y, width, height } = menuBtn.getBoundingClientRect()
        gsap.set(cta, {
          left: x - width,
          top: y + height
        })
      }
    }

    function onWheel(event) {
      const angle = event.deltaY * 0.015
      cursor.quat = qNormalize(qMul(qAxisAngle(1, 0, 0, angle), cursor.quat))
    }

    function init() {
      gsap.ticker.add(update)
      window.addEventListener('pointermove', onMouseMove)
      window.addEventListener('resize', onResize)
      window.addEventListener('wheel', onWheel, { passive: true })
      onResize()

      function onFirstScroll() {
        const shown = typeof sessionStorage !== 'undefined' && sessionStorage.getItem('cubeIntroShown')
        if (shown) return
        if (!cursor.intro.active && !cursor.intro.start) {
          cursor.intro.start = performance.now()
          cursor.intro.active = true
          cursor.position.previous.copy(cursor.intro.from)
          cursor.position.current.copy(cursor.intro.from)
          cursor.position.target.copy(cursor.intro.from)
        }
      }
      window.addEventListener('wheel', onFirstScroll, { passive: true, once: true })
      window.addEventListener('scroll', onFirstScroll, { passive: true, once: true })

      return () => {
        gsap.ticker.remove(update)
        window.removeEventListener('pointermove', onMouseMove)
        window.removeEventListener('resize', onResize)
        window.removeEventListener('wheel', onWheel)
        if (cursor.onPointerOver) {
          document.removeEventListener('pointerover', cursor.onPointerOver)
        }
        if (cursor.onPointerOut) {
          document.removeEventListener('pointerout', cursor.onPointerOut)
        }
      }
    }

    return init()
  }, [enabled])

  // Nothing at all on mobile: no markup, no stylesheet, so the native cursor
  // and the native hover styles stay untouched.
  if (!enabled) {
    // Hide native cursor even before the cube appears, so nothing leaks.
    return (
      <style>{`
        @media (min-width: 768px) {
          *, *::before, *::after { cursor: none !important; }
        }
      `}</style>
    )
  }

  return (
    <>
      <style>{`
        @media (min-width: 768px) {
          *, *::before, *::after { cursor: none !important; }
        }
        .cursor {
          width: 70.4px; height: 70.4px;
          margin-left: -35.2px; margin-top: -35.2px;
          display: flex; align-items: center; justify-content: center;
          position: fixed; left: 0; top: 0;
          pointer-events: none; z-index: 9999;
          perspective: 600px;
          transform-style: preserve-3d;
        }
        .spinner {
          width: 60px;
          height: 60px;
          position: relative;
          --depth: 60px;
          transform-style: preserve-3d;
          transform-origin: 50% 50%;
        }
        .spinner > div {
          position: absolute;
          left: 50%;
          top: 50%;
          backface-visibility: hidden;
          transform-style: preserve-3d;
        }
        .spinner > div > .face {
          position: absolute;
          inset: 0;
          border: 2px solid rgba(0, 0, 0, 0.92);
          background-color: #fff;
          opacity: 1;
          backface-visibility: hidden;
        }
        /* front & back */
        .spinner > div:nth-of-type(1) {
          width: 60px; height: 60px;
          transform: translate(-50%, -50%) translateZ(30px);
        }
        .spinner > div:nth-of-type(2) {
          width: 60px; height: 60px;
          transform: translate(-50%, -50%) translateZ(-30px) rotateY(180deg);
        }
        .spinner > div:nth-of-type(2) > .face {
          -webkit-backdrop-filter: contrast(3) saturate(1.4);
          backdrop-filter: contrast(3) saturate(1.4);
          -webkit-backdrop-filter: url(#ct-posterize);
          backdrop-filter: url(#ct-posterize);
        }
        /* right & left */
        .spinner > div:nth-of-type(3) {
          width: var(--depth); height: 60px;
          transform: translate(-50%, -50%) rotateY(90deg) translateZ(30px);
        }
        .spinner > div:nth-of-type(4) {
          width: var(--depth); height: 60px;
          transform: translate(-50%, -50%) rotateY(-90deg) translateZ(30px);
        }
        .spinner > div:nth-of-type(4) > .face {
          -webkit-backdrop-filter: blur(3px) contrast(3) saturate(1.5);
          backdrop-filter: blur(3px) contrast(3) saturate(1.5);
          -webkit-backdrop-filter: url(#ct-pixelate);
          backdrop-filter: url(#ct-pixelate);
        }
        /* top & bottom */
        .spinner > div:nth-of-type(5) {
          width: 60px; height: var(--depth);
          transform: translate(-50%, -50%) rotateX(90deg) translateZ(30px);
        }
        .spinner > div:nth-of-type(5) > .face {
          -webkit-backdrop-filter: saturate(3) contrast(2);
          backdrop-filter: saturate(3) contrast(2);
          -webkit-backdrop-filter: url(#ct-glitch);
          backdrop-filter: url(#ct-glitch);
        }
        .spinner > div:nth-of-type(6) {
          width: 60px; height: var(--depth);
          transform: translate(-50%, -50%) rotateX(-90deg) translateZ(30px);
        }
        .cta { width: 100px; position: fixed; top: -999px; left: -999px; pointer-events: none; }
      `}</style>
      <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
        <defs>
          <filter id="ct-posterize" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
            <feComponentTransfer>
              <feFuncR type="discrete" tableValues="0 0.25 0.5 0.75 1" />
              <feFuncG type="discrete" tableValues="0 0.25 0.5 0.75 1" />
              <feFuncB type="discrete" tableValues="0 0.25 0.5 0.75 1" />
            </feComponentTransfer>
          </filter>
          <filter id="ct-pixelate" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
            <feFlood x="10" y="10" width="6" height="6" />
            <feComposite width="20" height="20" />
            <feTile result="tiles" />
            <feComposite in="SourceGraphic" in2="tiles" operator="in" result="pixelated" />
            <feMorphology in="pixelated" operator="dilate" radius="10" result="blocks" />
            <feComponentTransfer in="blocks">
              <feFuncR type="discrete" tableValues="0 0.25 0.5 0.75 1" />
              <feFuncG type="discrete" tableValues="0 0.25 0.5 0.75 1" />
              <feFuncB type="discrete" tableValues="0 0.25 0.5 0.75 1" />
            </feComponentTransfer>
          </filter>
          <filter id="ct-glitch" x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.02 0.8" numOctaves="2" seed="7" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="7" xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feOffset in="displaced" dx="5" dy="1" result="rShift" />
            <feColorMatrix in="rShift" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />
            <feOffset in="displaced" dx="-5" dy="-1" result="bShift" />
            <feColorMatrix in="bShift" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />
            <feColorMatrix in="displaced" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />
            <feBlend in="red" in2="green" mode="screen" result="rg" />
            <feBlend in="rg" in2="blue" mode="screen" result="glitched" />
            <feComponentTransfer in="glitched">
              <feFuncR type="linear" slope="1.5" intercept="-0.25" />
              <feFuncG type="linear" slope="1.5" intercept="-0.25" />
              <feFuncB type="linear" slope="1.5" intercept="-0.25" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>
      <div ref={cursorRef} className="cursor hidden md:block">
        <div className="spinner">
          <div><div className="face" /></div>
          <div><div className="face" /></div>
          <div><div className="face" /></div>
          <div><div className="face" /></div>
          <div><div className="face" /></div>
          <div><div className="face" /></div>
        </div>
      </div>
      <svg ref={ctaRef} className="cta" viewBox="0 0 52 43" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.3417 42.0204C12.2328 42.0204 12.1486 41.9882 12.0891 41.9238C12.0297 41.8644 12 41.7133 12 41.4706C12 41.2478 12.0396 40.958 12.1189 40.6014C12.1981 40.2399 12.3046 39.8387 12.4383 39.3979C12.572 38.9572 12.7231 38.5015 12.8915 38.031C13.0599 37.5556 13.2357 37.09 13.4189 36.6344C13.6071 36.1738 13.7879 35.7528 13.9612 35.3714C14.0256 35.2328 14.0925 35.1362 14.1618 35.0817C14.2312 35.0272 14.3129 35 14.407 35C14.4714 35 14.5258 35.0198 14.5704 35.0594C14.6199 35.0941 14.6447 35.1535 14.6447 35.2377C14.6447 35.2674 14.6125 35.364 14.5481 35.5275C14.4887 35.6909 14.4045 35.9063 14.2955 36.1738C14.1915 36.4412 14.0752 36.7409 13.9464 37.0727C13.8176 37.4045 13.6864 37.7537 13.5527 38.1202C13.4189 38.4867 13.2926 38.8556 13.1738 39.2271C13.0549 39.5936 12.9534 39.9452 12.8692 40.282C12.785 40.6188 12.728 40.9209 12.6983 41.1883C12.8172 41.0447 12.9534 40.8614 13.1069 40.6386C13.2604 40.4157 13.4239 40.1755 13.5972 39.918C13.7706 39.6604 13.9464 39.4054 14.1247 39.1528C14.303 38.9002 14.4788 38.6699 14.6521 38.4619C14.8255 38.2539 14.9864 38.088 15.135 37.9642C15.2886 37.8354 15.4223 37.771 15.5362 37.771C15.7244 37.771 15.8754 37.8304 15.9893 37.9493C16.1082 38.0632 16.1676 38.2514 16.1676 38.5139C16.1676 38.6625 16.1379 38.8408 16.0785 39.0488C16.024 39.2568 15.9596 39.4747 15.8853 39.7025C15.8111 39.9304 15.7442 40.1483 15.6848 40.3563C15.6303 40.5643 15.603 40.7426 15.603 40.8912C15.603 41.0942 15.6798 41.1958 15.8333 41.1958C16.0711 41.1958 16.3088 41.1437 16.5465 41.0397C16.7892 40.9357 17.0195 40.807 17.2374 40.6534C17.4553 40.495 17.6559 40.3365 17.8392 40.178C18.0224 40.0145 18.1784 39.8759 18.3072 39.762C18.4459 39.6381 18.5622 39.5762 18.6563 39.5762C18.7752 39.5762 18.8346 39.6381 18.8346 39.762C18.8346 39.7966 18.8272 39.8363 18.8124 39.8808C18.7975 39.9254 18.7579 39.9824 18.6935 40.0517C18.6142 40.1408 18.5003 40.2572 18.3518 40.4009C18.2081 40.5445 18.0397 40.698 17.8466 40.8614C17.6584 41.0249 17.4529 41.1784 17.23 41.322C17.0121 41.4657 16.7867 41.5845 16.554 41.6786C16.3261 41.7678 16.1033 41.8124 15.8853 41.8124C15.5882 41.8124 15.3579 41.7282 15.1945 41.5598C15.036 41.3864 14.9567 41.1487 14.9567 40.8466C14.9567 40.6584 14.9864 40.4306 15.0459 40.1631C15.1053 39.8957 15.1796 39.6134 15.2687 39.3162C15.3628 39.0141 15.4569 38.7194 15.551 38.4322C15.3926 38.5411 15.2192 38.7046 15.031 38.9225C14.8478 39.1355 14.6546 39.3781 14.4516 39.6505C14.2485 39.918 14.0454 40.1904 13.8424 40.4677C13.6443 40.7451 13.4511 41.0026 13.2629 41.2403C13.0797 41.4731 12.9088 41.6613 12.7503 41.8049C12.5918 41.9486 12.4556 42.0204 12.3417 42.0204Z" fill="black" />
      </svg>
    </>
  )
}
