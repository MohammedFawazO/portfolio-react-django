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

    const resizeObserver = new ResizeObserver(() => {
      if (!width && !height) {
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight
      }
    })
    resizeObserver.observe(canvas)

    if (width) canvas.width = width
    if (height) canvas.height = height
    if (!width && !height) {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    const w = canvas.width
    const h = canvas.height

    const columns = Math.floor(w / fontSize)
    const drops = new Array(columns).fill(1)

    const chars = "ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890"

    let isDark = document.documentElement.classList.contains('dark')

    ctx.clearRect(0, 0, w, h)

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
