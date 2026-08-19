import { useMemo, memo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

const Letter = memo(function Letter({ char, index, staggerDelay, letterDuration }) {
  return (
    <motion.span
      style={{ transformStyle: 'preserve-3d' }}
      initial={{ rotateX: 90, y: 20, opacity: 0, filter: 'blur(8px)' }}
      animate={{ rotateX: 0, y: 0, opacity: 1, filter: 'blur(0px)' }}
      transition={{
        duration: letterDuration,
        ease: [0.2, 0.65, 0.3, 0.9],
        delay: index * staggerDelay,
      }}
      className="inline-block"
    >
      {char}
    </motion.span>
  )
})

function FlipRevealText({
  children,
  className,
  textClassName,
  letterDuration = 0.6,
  staggerDelay = 0.05,
}) {
  const letters = useMemo(() => children.split(''), [children])

  return (
    <div
      className={cn('flex items-center justify-center', className)}
      style={{ perspective: '1000px' }}
    >
      <div
        className={cn(
          'flex gap-[0.1em] text-5xl md:text-7xl font-bold uppercase tracking-wider text-white',
          textClassName
        )}
      >
        {letters.map((char, i) => (
          <Letter
            key={`${char}-${i}`}
            char={char}
            index={i}
            staggerDelay={staggerDelay}
            letterDuration={letterDuration}
          />
        ))}
      </div>
    </div>
  )
}

export default FlipRevealText
