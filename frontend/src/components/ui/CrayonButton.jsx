import { Link } from 'react-router-dom'
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
}) {
  const className = cn(
    'crayon-btn',
    accent === 'pink' && 'crayon-btn--pink',
    filled && 'filled'
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
      <span className="btn-text">{label}</span>

      <span className="design-btn-note">{note}</span>
      <svg
        className="design-btn-arrow"
        viewBox="0 0 36 32"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M14 3C11 9 21 12 16 18C13 21 19 23 23 26"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M18 19L23 26L16 25"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
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
