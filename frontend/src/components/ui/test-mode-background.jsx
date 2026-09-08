import { useEffect, useRef } from 'react'
import { Bug } from 'lucide-react'

const LASER_DURATION_MS = 6000 // 6.0s sweep cycle (slower)
const GRID_SIZE = 16 // 16px fine grid
const TRAIL_HEIGHT = 160 // Sleek, compact height of revealed grid band behind laser

function applyLaserReveal(el, laserY, now) {
  if (!el) return
  const centerY = el.offsetTop + el.offsetHeight / 2
  let target = parseFloat(el.dataset.rt ?? '0')
  if (Number.isNaN(target)) target = 0
  if (laserY < centerY - 60) {
    target = 0
    el.dataset.rd = '0'
  } else if (target === 0 && el.dataset.rd !== '1' && laserY >= centerY + 14) {
    target = 1
    el.dataset.ra = String(now)
  } else if (target === 1 && now - parseFloat(el.dataset.ra ?? '0') > 2000) {
    target = 0
    el.dataset.rd = '1'
  }
  el.dataset.rt = String(target)
  let v = parseFloat(el.dataset.rv ?? '0')
  if (Number.isNaN(v)) v = 0
  v += (target - v) * (target === 1 ? 0.22 : 0.08)
  if (Math.abs(target - v) < 0.015) v = target
  el.dataset.rv = v.toFixed(4)
  const s = v * v * (3 - 2 * v)
  if (s >= 1) {
    el.style.opacity = '1'
    el.style.scale = ''
    el.style.filter = 'none'
    el.style.willChange = 'auto'
  } else {
    el.style.opacity = s.toFixed(3)
    el.style.scale = `${(0.88 + 0.12 * s).toFixed(3)}`
    el.style.filter = `blur(${((1 - s) * 6).toFixed(1)}px)`
    el.style.willChange = 'opacity, scale, filter'
  }
}

export default function TestModeBackground({ className = '' }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const hazardARef = useRef(null)
  const hazardBRef = useRef(null)
  const buildRef = useRef(null)
  const octaCRef = useRef(null)
  const octaDRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId
    const startTime = performance.now()

    const render = (now) => {
      const cw = canvas.clientWidth
      const ch = canvas.clientHeight
      const dpr = window.devicePixelRatio || 1

      if (canvas.width !== cw * dpr || canvas.height !== ch * dpr) {
        canvas.width = cw * dpr
        canvas.height = ch * dpr
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      }

      ctx.clearRect(0, 0, cw, ch)

      // Sweep progress: 0 to 1, starting 60px above screen, ending 60px below screen
      const elapsed = (now - startTime) % LASER_DURATION_MS
      const progress = elapsed / LASER_DURATION_MS
      const laserY = -60 + progress * (ch + 120)
      const bandTop = laserY - TRAIL_HEIGHT

      // Reveal stationary grid strictly within [bandTop, laserY] (never ahead of laser)
      if (laserY > 0 && bandTop < ch) {
        const drawTop = Math.max(0, bandTop)
        const drawBottom = Math.min(ch, laserY)

        if (drawBottom > drawTop) {
          ctx.save()
          // Strict clipping rectangle so absolutely nothing draws below/ahead of laserY
          ctx.beginPath()
          ctx.rect(0, drawTop, cw, drawBottom - drawTop)
          ctx.clip()

          // Stationary Grid lines with smooth vertical alpha fade
          const grad = ctx.createLinearGradient(0, bandTop, 0, laserY)
          grad.addColorStop(0, 'rgba(255, 59, 71, 0)')
          grad.addColorStop(0.3, 'rgba(255, 59, 71, 0.25)')
          grad.addColorStop(0.75, 'rgba(255, 59, 71, 0.65)')
          grad.addColorStop(1, 'rgba(255, 59, 71, 0.95)')

          ctx.strokeStyle = grad
          ctx.lineWidth = 1
          ctx.beginPath()

          // Stationary vertical grid lines
          for (let x = 0; x <= cw; x += GRID_SIZE) {
            ctx.moveTo(x + 0.5, drawTop)
            ctx.lineTo(x + 0.5, drawBottom)
          }

          // Stationary horizontal grid lines (strictly up to drawBottom)
          const startGridY = Math.max(0, Math.floor(drawTop / GRID_SIZE) * GRID_SIZE)
          const endGridY = Math.floor(drawBottom / GRID_SIZE) * GRID_SIZE
          for (let y = startGridY; y <= endGridY; y += GRID_SIZE) {
            ctx.moveTo(0, y + 0.5)
            ctx.lineTo(cw, y + 0.5)
          }
          ctx.stroke()

          // Ambient laser trailing glow bloom (behind the laser)
          const bloomGrad = ctx.createLinearGradient(0, laserY - 30, 0, laserY)
          bloomGrad.addColorStop(0, 'rgba(255, 59, 71, 0)')
          bloomGrad.addColorStop(1, 'rgba(255, 59, 71, 0.25)')
          ctx.fillStyle = bloomGrad
          ctx.fillRect(0, Math.max(0, laserY - 30), cw, drawBottom - Math.max(0, laserY - 30))

          ctx.restore()
        }
      }

      // Leading Laser Beam Line
      if (laserY >= 0 && laserY <= ch) {
        ctx.save()
        ctx.strokeStyle = '#FF3B47'
        ctx.lineWidth = 2
        ctx.shadowColor = '#FF3B47'
        ctx.shadowBlur = 10
        ctx.beginPath()
        ctx.moveTo(0, laserY)
        ctx.lineTo(cw, laserY)
        ctx.stroke()
        ctx.restore()
      }

      window.__testLaser = { y: laserY, h: ch }
      applyLaserReveal(hazardARef.current, laserY, now)
      applyLaserReveal(hazardBRef.current, laserY, now)
      applyLaserReveal(buildRef.current, laserY, now)
      applyLaserReveal(octaCRef.current, laserY, now)
      applyLaserReveal(octaDRef.current, laserY, now)

      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 z-0 pointer-events-none overflow-hidden select-none bg-[#070204] ${className}`}
      style={{
        fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace)',
      }}
    >
      {/* 1. Deep Obsidian Crimson Nebula Spotlights */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 15% 20%, rgba(210, 4, 45, 0.16) 0%, transparent 55%),
            radial-gradient(ellipse at 85% 80%, rgba(122, 2, 24, 0.18) 0%, transparent 60%),
            radial-gradient(circle at 50% 50%, rgba(255, 59, 71, 0.04) 0%, transparent 70%)
          `,
        }}
      />

      {/* 2. CRT Scanline Raster Texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-35"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(0,0,0,0.35) 0px, rgba(0,0,0,0.35) 1px, transparent 1px, transparent 2px)',
        }}
      />

      {/* 3. High-Performance Canvas Laser Grid Revealer */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* 3.5. Center Bug Icon - moved to TestBugOverlay for top layering */}
      <div className="hidden absolute inset-0 z-50 pointer-events-none" aria-hidden="true">
        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#D2042D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="bug-walker" style={{ filter: 'drop-shadow(0 0 8px rgba(255,59,71,0.6))' }}>
          <style>{`
            @keyframes walk {
              0% { transform: translate(40vw, 40vh) rotate(-45deg); }
              10% { transform: translate(5vw, 5vh) rotate(-45deg); }
              12% { transform: translate(5vw, 5vh) rotate(-30deg); }
              14% { transform: translate(5vw, 5vh) rotate(-45deg); }
              25% { transform: translate(-40vw, -40vh) rotate(-45deg); }
              26% { transform: translate(-40vw, -40vh) rotate(-30deg); }
              27% { transform: translate(-40vw, -40vh) rotate(-45deg); }
              28% { transform: translate(-60vw, -60vh) rotate(-45deg); }
              29% { transform: translate(-80vw, -80vh) rotate(-45deg); }
              30% { transform: translate(-100vw, -100vh) rotate(-45deg); }
              30.01% { transform: translate(-40vw, -40vh) rotate(135deg); }
              42% { transform: translate(-5vw, 5vh) rotate(135deg); }
              44% { transform: translate(-5vw, 5vh) rotate(120deg); }
              46% { transform: translate(-5vw, 5vh) rotate(135deg); }
              57% { transform: translate(40vw, 40vh) rotate(135deg); }
              59% { transform: translate(40vw, 40vh) rotate(120deg); }
              60% { transform: translate(40vw, 40vh) rotate(135deg); }
              61% { transform: translate(60vw, 60vh) rotate(135deg); }
              63% { transform: translate(80vw, 80vh) rotate(135deg); }
              65% { transform: translate(100vw, 100vh) rotate(135deg); }
              65.01% { transform: translate(40vw, -40vh) rotate(225deg); }
              74% { transform: translate(5vw, 5vh) rotate(225deg); }
              76% { transform: translate(5vw, 5vh) rotate(210deg); }
              78% { transform: translate(5vw, 5vh) rotate(225deg); }
              89% { transform: translate(-40vw, 40vh) rotate(225deg); }
              91% { transform: translate(-40vw, 40vh) rotate(210deg); }
              92% { transform: translate(-40vw, 40vh) rotate(225deg); }
              93% { transform: translate(-60vw, 60vh) rotate(225deg); }
              94% { transform: translate(-80vw, 80vh) rotate(225deg); }
              96% { transform: translate(-100vw, 100vh) rotate(225deg); }
              96.01% { transform: translate(40vw, 40vh) rotate(-45deg); }
              100% { transform: translate(40vw, 40vh) rotate(-45deg); }
            }
            @keyframes wl1 { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-10deg); } }
            @keyframes wl2 { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(10deg); } }
            @keyframes wl3 { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-10deg); } }
            @keyframes wl4 { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(10deg); } }
            @keyframes wl5 { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-10deg); } }
            @keyframes wl6 { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(10deg); } }
            @keyframes ant1 { 0%,40%,100% { transform: rotate(0deg); } 50% { transform: rotate(-6deg); } }
            @keyframes ant2 { 0%,40%,100% { transform: rotate(0deg); } 50% { transform: rotate(6deg); } }
            .bug-walker { animation: walk 40s linear infinite; }
            .wl1 { animation: wl1 0.6s ease-in-out infinite; transform-origin: 12px 12px; } .wl2 { animation: wl2 0.6s ease-in-out infinite; transform-origin: 12px 12px; } .wl3 { animation: wl3 0.6s ease-in-out infinite 0.1s; transform-origin: 12px 12px; } .wl4 { animation: wl4 0.6s ease-in-out infinite 0.1s; transform-origin: 12px 12px; } .wl5 { animation: wl5 0.6s ease-in-out infinite 0.2s; transform-origin: 12px 12px; } .wl6 { animation: wl6 0.6s ease-in-out infinite 0.2s; transform-origin: 12px 12px; } .ant1 { animation: ant1 3s ease-in-out infinite; transform-origin: 12px 12px; } .ant2 { animation: ant2 3s ease-in-out infinite; }
          `}</style>
          <path d="M12 20v-9"/>
          <path d="M14 7a4 4 0 0 1 4 4v3a6 6 0 0 1-12 0v-3a4 4 0 0 1 4-4z"/>
          <path className="ant1" d="M14.12 3.88 16 2"/>
          <path className="wl1" d="M21 21a4 4 0 0 0-3.81-4"/>
          <path className="wl2" d="M21 5a4 4 0 0 1-3.55 3.97"/>
          <path d="M22 13h-4"/>
          <path className="wl3" d="M3 21a4 4 0 0 1 3.81-4"/>
          <path className="wl4" d="M3 5a4 4 0 0 0 3.55 3.97"/>
          <path d="M6 13H2"/>
          <path className="ant2" d="m8 2 1.88 1.88"/>
          <path d="M9 7.13V6a3 3 0 1 1 6 0v1.13"/>
        </svg>
      </div>

      {/* 4. Technical HUD Corner Crosshairs & Framing Lines */}
      <div className="absolute top-4 left-4 text-[#FF3B47]/30 text-[10px] font-mono pointer-events-none">
        ┌─ [TEST_MODE // SUITE: 0x4B]
      </div>
      <div className="absolute top-4 right-4 text-[#FF3B47]/30 text-[10px] font-mono pointer-events-none">
        [SYS_DIAG: ACTIVE] ─┐
      </div>
      <div className="absolute bottom-4 left-4 text-[#FF3B47]/30 text-[10px] font-mono pointer-events-none">
        └─ [RT_ASSERT: CONTINUOUS]
      </div>
      <div className="absolute bottom-4 right-4 text-[#FF3B47]/30 text-[10px] font-mono pointer-events-none">
        [COVERAGE_DAEMON] ─┘
      </div>

      {/* 5. Random Red Hazard Signs - hidden by default, revealed by laser radar */}
      <div ref={hazardARef} style={{ opacity: 0, willChange: 'opacity, scale, filter' }} className="absolute top-25 left-1/2 -translate-x-1/2 pointer-events-none select-none">
        <div className="relative flex flex-col items-center">
          <span className="text-[28px] text-[#D2042D] drop-shadow-[0_0_8px_rgba(210,4,45,0.8)]">⚠</span>
          <span className="text-[7px] text-[#FF3B47]/60 font-mono mt-0.5 tracking-widest">HAZARD_ZONE_A</span>
        </div>
      </div>
      <div ref={hazardBRef} style={{ opacity: 0, willChange: 'opacity, scale, filter' }} className="absolute top-1/3 right-6 pointer-events-none select-none">
        <div className="relative flex flex-col items-center">
          <span className="text-[32px] text-[#D2042D] drop-shadow-[0_0_8px_rgba(210,4,45,0.8)]">⚠</span>
          <span className="text-[7px] text-[#FF3B47]/60 font-mono mt-0.5 tracking-widest">HAZARD_ZONE_B</span>
        </div>
      </div>

      {/* 5.5. Octagon Warning C - top left, revealed by laser radar */}
      <div ref={octaCRef} style={{ opacity: 0, willChange: 'opacity, scale, filter' }} className="absolute top-16 left-16 pointer-events-none select-none">
        <div className="relative flex flex-col items-center">
          <div className="w-8 h-8 bg-[#D2042D]" style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)', filter: 'drop-shadow(0 0 8px rgba(210,4,45,0.8))' }}>
            <div className="w-full h-full bg-[#070204] flex items-center justify-center" style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)', transform: 'scale(0.82)' }}>
              <span className="text-[#D2042D] text-lg font-bold font-mono leading-none">!</span>
            </div>
          </div>
          <span className="text-[7px] text-[#FF3B47]/60 font-mono mt-0.5 tracking-widest">HAZARD_ZONE_C</span>
        </div>
      </div>

      {/* 5.6. Octagon Warning D - center, revealed by laser radar */}
      <div ref={octaDRef} style={{ opacity: 0, willChange: 'opacity, scale, filter' }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
        <div className="relative flex flex-col items-center mt-40">
          <div className="w-8 h-8 bg-[#D2042D]" style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)', filter: 'drop-shadow(0 0 8px rgba(210,4,45,0.8))' }}>
            <div className="w-full h-full bg-[#070204] flex items-center justify-center" style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)', transform: 'scale(0.82)' }}>
              <span className="text-[#D2042D] text-lg font-bold font-mono leading-none">!</span>
            </div>
          </div>
          <span className="text-[7px] text-[#FF3B47]/60 font-mono mt-0.5 tracking-widest">HAZARD_ZONE_D</span>
        </div>
      </div>

      {/* 6. Build Version Container - hidden by default, revealed by laser radar */}
      <div ref={buildRef} style={{ opacity: 0, willChange: 'opacity, scale, filter' }} className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none select-none">
        <div className="px-3 py-1 border border-[#D2042D]/40 bg-[#070204]/80 rounded-sm">
          <span className="text-[9px] text-[#FF3B47]/70 font-mono tracking-wider">Build:0.9.3-BETA</span>
        </div>
      </div>

    </div>
  )
}