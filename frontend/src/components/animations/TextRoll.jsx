import { motion } from 'framer-motion'
import clsx from 'clsx'

const STAGGER = 0.035

function TextRoll({ children, className, center = false, auto = false }) {
  return (
    <motion.span
      initial="initial"
      {...(auto ? { animate: 'hovered' } : { whileHover: 'hovered' })}
      className={clsx('relative block overflow-hidden', className)}
      style={{ lineHeight: 0.75 }}
    >
      <div>
        {children.split('').map((letter, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (children.length - 1) / 2)
            : STAGGER * i

          return (
            <motion.span
              variants={{
                initial: { y: 0 },
                hovered: { y: '-100%' },
              }}
              transition={{ ease: 'easeInOut', delay }}
              className="inline-block"
              key={i}
            >
              {letter}
            </motion.span>
          )
        })}
      </div>
      <div className="absolute inset-0">
        {children.split('').map((letter, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (children.length - 1) / 2)
            : STAGGER * i

          return (
            <motion.span
              variants={{
                initial: { y: '100%' },
                hovered: { y: 0 },
              }}
              transition={{ ease: 'easeInOut', delay }}
              className="inline-block"
              key={i}
            >
              {letter}
            </motion.span>
          )
        })}
      </div>
    </motion.span>
  )
}

export default TextRoll
