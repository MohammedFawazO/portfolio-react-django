import { useRef, useEffect } from 'react'
import '../../pixel-canvas-register'

function PixelCanvas({ gap, speed, colors, noFocus, rain, rainDirection, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || el._initialized) return
    el._initialized = true

    if (gap !== undefined) el.setAttribute('data-gap', gap)
    if (speed !== undefined) el.setAttribute('data-speed', speed)
    if (colors !== undefined) el.setAttribute('data-colors', colors)
    if (noFocus) el.setAttribute('data-no-focus', '')
    if (rain) el.setAttribute('data-rain', '')
    if (rainDirection !== undefined) el.setAttribute('data-rain-direction', rainDirection)

    el.init()
    if (rain) {
      el.handleAnimation("rain")
    } else {
      el.handleAnimation("appear")
    }
  }, [])

  return <pixel-canvas ref={ref} className={className} />
}

export default PixelCanvas
