'use client'

import { useEffect, useRef } from 'react'

export function NeonRGBTextEffect({ children, className = '' }) {
  const containerRef = useRef(null)

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`} style={{ fontFamily: "'Pixel Digivolve', monospace", fontSize: '22px', width: '100%', maxWidth: '600px' }}>
      <span
        className="absolute inset-0 pointer-events-none"
        style={{
          color: '#FF3B47',
          opacity: 1,
          fontFamily: "'Pixel Digivolve', monospace",
          fontSize: '22px',
          fontWeight: 'inherit',
          transform: 'translate(-4px, 0)',
        }}
        aria-hidden="true"
      >
        {children}
      </span>
      <span
        className="absolute inset-0 pointer-events-none"
        style={{
          color: '#00FF00',
          opacity: 1,
          fontFamily: "'Pixel Digivolve', monospace",
          fontSize: '22px',
          fontWeight: 'inherit',
          transform: 'translate(0, 0)',
        }}
        aria-hidden="true"
      >
        {children}
      </span>
      <span
        className="absolute inset-0 pointer-events-none"
        style={{
          color: '#3B47FF',
          opacity: 1,
          fontFamily: "'Pixel Digivolve', monospace",
          fontSize: '22px',
          fontWeight: 'inherit',
          transform: 'translate(4px, 0)',
        }}
        aria-hidden="true"
      >
        {children}
      </span>
      <span
        className="relative z-10"
        style={{
          color: '#FFFFFF',
          fontFamily: "'Pixel Digivolve', monospace",
          fontSize: '22px',
          textShadow: '0 0 15px rgba(255,255,255,0.9), 0 0 30px rgba(255,59,71,0.8)',
        }}
      >
        {children}
      </span>
    </div>
  )
}

export default NeonRGBTextEffect
