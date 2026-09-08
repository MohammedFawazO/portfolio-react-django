import { useEffect, useRef } from 'react'

export function GlitchDescription({ children, className = '' }) {
  const baseRef = useRef(null)

  useEffect(() => {
    const a = baseRef.current
    if (a) a.style.animation = 'none'
  }, [])

  return (
    <p
      className={
        'relative inline-block text-[22px] md:text-[28px] font-light mt-2 max-w-xl leading-[1.25] cursor-default select-none ' +
        className
      }
    >
      <span
        ref={baseRef}
        className="relative inline text-[20px]"
        style={{
          color: '#FFFFFF',
          opacity: 0.85,
          textShadow: '0 0 8px rgba(255,59,71,0.4), 0 0 2px #FF3B47',
          zIndex: 3,
          fontFamily: "'Pixel Digivolve', monospace",
        }}
      >
        {children}
      </span>
    </p>
  )
}

export default GlitchDescription