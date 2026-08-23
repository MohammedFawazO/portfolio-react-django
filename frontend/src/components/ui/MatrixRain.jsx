import { cn } from '../../lib/utils'
import { useEffect, useRef } from 'react'

export function MatrixRain({
  className,
  variant = 'default',
  width,
  height,
  fontSize = 16,
  speed = 50,
  fixedColor,
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let columns = 0
    let drops = []

    const setup = () => {
      const w = width || canvas.offsetWidth
      const h = height || canvas.offsetHeight
      canvas.width = w
      canvas.height = h
      columns = Math.floor(w / fontSize)
      drops = new Array(columns).fill(1)
    }

    setup()

    const resizeObserver = new ResizeObserver(() => {
      if (!width && !height) setup()
    })
    resizeObserver.observe(canvas)

    const chars = "\u30a6\u30a7\u30a8\u30a9\u30aa\u30ab\u30ac\u30ad\u30ae\u30af\u30b0\u30b1\u30b2\u30b3\u30b4\u30b5\u30b6\u30b7\u30b8\u30b9\u30ba\u30bb\u30bc\u30bd\u30be\u30bf\u30c1\u30c2\u30c3\u30c4\u30c5\u30c6\u30c7\u30c8\u30c9\u30ca\u30cb\u30cc\u30cd\u30ce\u30cf\u30d2\u30d3\u30d4\u30d5\u30d6\u30d7\u30d8\u30d9\u30da\u30db\u30dc\u30dd\u30de\u30df\u30e0\u30e1\u30e2\u30e3\u30e4\u30e5\u30e6\u30e7\u30e8\u30e9\u30ea\u30eb\u30ec\u30ed\u30ee\u30ef\u30f2\u30f31234567890"

    let isDark = document.documentElement.classList.contains('dark')

    const draw = () => {
      const currentIsDark = document.documentElement.classList.contains('dark')
      if (currentIsDark !== isDark) isDark = currentIsDark

      // transparent trailing fade so the hero content stays visible
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.globalCompositeOperation = 'source-over'

      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)] || ''

        if (variant === 'rainbow' && !fixedColor) {
          const hue = (Date.now() / 20 + i * 10) % 360
          ctx.fillStyle = `hsl(${hue}, 100%, 50%)`
        } else if (fixedColor) {
          ctx.fillStyle = fixedColor
        } else {
          if (variant === 'cyan') {
            ctx.fillStyle = isDark ? '#0FF' : '#0e7490'
          } else {
            ctx.fillStyle = isDark ? '#0F0' : '#15803d'
          }
        }

        const x = i * fontSize
        const y = drops[i] * fontSize

        ctx.fillText(text, x, y)

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        drops[i]++
      }
    }

    const interval = setInterval(draw, speed)

    return () => {
      clearInterval(interval)
      resizeObserver.disconnect()
    }
  }, [variant, fontSize, speed, fixedColor, width, height])

  return (
    <canvas
      ref={canvasRef}
      className={cn('size-full block rounded-[inherit]', className)}
      style={{ width, height }}
    />
  )
}
