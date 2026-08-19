import { useRef } from 'react'
import clsx from 'clsx'

function ScrollFade({ children, className, height = '20rem', fromColor = '#07090B' }) {
  const scrollRef = useRef(null)

  return (
    <div className={clsx('relative overflow-hidden rounded-xl', className)}>
      <div
        ref={scrollRef}
        className="overflow-auto"
        style={{ height }}
      >
        {children}
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t to-transparent"
        style={{ '--tw-gradient-from': fromColor }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b to-transparent"
        style={{ '--tw-gradient-from': fromColor }}
      />
    </div>
  )
}

export default ScrollFade
