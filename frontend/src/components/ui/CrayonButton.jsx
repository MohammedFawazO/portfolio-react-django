import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'
import './CrayonButton.css'

export default function CrayonButton({
  label = 'Color Me',
  href,
  onClick,
  download,
  accent = 'blue',
  note = 'active?',
  filled = false,
  icon = null,
  hoverDownload = false,
  className: extraClassName = '',
}) {
  const className = cn(
    'crayon-btn',
    accent === 'pink' && 'crayon-btn--pink',
    filled && 'filled',
    extraClassName
  )

  const content = (
    <>
      <span className="crayon-fill-clip">
        <span className="crayon-fill" />
      </span>
      <span className="design-handle design-handle-tl" />
      <span className="design-handle design-handle-tr" />
      <span className="design-handle design-handle-bl" />
      <span className="design-handle design-handle-br" />
      {icon === 'download' && (
        <svg
          className="crayon-download-icon"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          style={{ width: '1.1em', height: '1.1em', marginRight: '0.35em', verticalAlign: '-0.2em' }}
        >
          <motion.path
            d="M12 3 C11 9 13 12 12 16"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          />
          <motion.path
            d="M7 12 C9 15 15 15 17 12"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.7 }}
          />
          <motion.path
            d="M5 20 C9 19 15 19 19 20"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.9 }}
          />
        </svg>
      )}
      <span className="btn-text">{label}</span>

      <motion.span
        className="design-btn-note"
        initial={{ opacity: 0, scale: 0.75, y: -4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {note}
      </motion.span>
      <svg
        className="design-btn-arrow"
        viewBox="0 0 36 32"
        fill="none"
        aria-hidden="true"
      >
        <motion.path
          d="M14 3C11 9 21 12 16 18C13 21 19 23 23 26"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
        />
        <motion.path
          d="M18 19L23 26L16 25"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.85 }}
        />
      </svg>
      {hoverDownload && (
        <span className="crayon-hover-download" aria-hidden="true">
          <svg viewBox="0 0 32 32" fill="none">
            <path d="M16 4 C15 10 17 16 16 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M9 16 L16 23 L23 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 26 L26 26" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
      )}
    </>
  )

  if (href && download) {
    return (
      <>
        <svg className="crayon-filters">
          <filter id="crayon-texture">
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
        <a href={href} download className={className} onClick={onClick}>
          {content}
        </a>
      </>
    )
  }

  if (href) {
    return (
      <>
        <svg className="crayon-filters">
          <filter id="crayon-texture">
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
        <Link to={href} className={className} onClick={onClick}>
          {content}
        </Link>
      </>
    )
  }

  return (
    <>
      <svg className="crayon-filters">
        <filter id="crayon-texture">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="4" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <button type="button" className={className} onClick={onClick}>
        {content}
      </button>
    </>
  )
}
