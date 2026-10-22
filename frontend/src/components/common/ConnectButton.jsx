import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import { BlueprintPillButton } from '@/components/ui/blueprint-pill-button'
import GlitchScanGridButton from '@/components/ui/glitch-scan-grid-button'

// The CV every Get Resume control hands over. One path, one file name, so the
// navbar CTA, the About page and the hero all give the visitor the same
// document under the same name.
const RESUME_URL = '/media/resume.pdf'
const RESUME_FILE = 'Mohammed-Fawaz-O-Resume.pdf'

function useModeClass(className) {
  const [active, setActive] = useState(false)
  useEffect(() => {
    const root = document.documentElement
    const update = () => setActive(root.classList.contains(className))
    update()
    const mo = new MutationObserver(update)
    mo.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => mo.disconnect()
  }, [className])
  return active
}

export default function ConnectButton({ className = '' }) {
  const blueprint = useModeClass('about-blueprint-nav')
  const test = useModeClass('about-test-nav')

  const handleResumeDownload = () => {
    const a = document.createElement('a')
    a.href = RESUME_URL
    a.download = RESUME_FILE
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  if (blueprint) {
    return (
      <span
        className="inline-block pointer-events-auto"
        style={{ transform: 'scale(0.75) translateY(-14px)', transformOrigin: 'top right' }}
      >
        <BlueprintPillButton
          label="GET_RESUME"
          heightOnRight={false}
          hoverIcon={<Download />}
          onClick={handleResumeDownload}
        />
      </span>
    )
  }

  if (test) {
    return (
      <span
        className="inline-block pointer-events-auto"
        style={{ transform: 'scale(0.85) translateY(-8px)', transformOrigin: 'top right' }}
      >
        <GlitchScanGridButton
          label="GET_RESUME.EXE"
          badge="GET//PDF"
          index={3}
          onClick={handleResumeDownload}
        />
      </span>
    )
  }

  return (
    // A real download, not a route. The label says Get Resume and the chevron
    // is a download arrow, so the click has to hand the CV over - the same
    // file and the same file name the About page and the hero use. The
    // `download` attribute keeps the browser on the page instead of opening
    // the PDF viewer, and it is same origin, so the attribute is honoured.
    <a
      href={RESUME_URL}
      download={RESUME_FILE}
      aria-label="Get Resume"
      className={[
        'inline-flex items-center h-11 px-5 rounded-full',
        'backdrop-blur-[24px] border border-[rgba(255,255,255,0.1)]',
        'bg-[rgba(255,255,255,0.05)] shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
        'text-sm font-medium text-[var(--text-secondary)]',
        'hover:text-[var(--color-primary-light)] transition-colors duration-200',
        className,
      ].join(' ')}
    >
      <span className="connect-btn inline-flex items-center gap-1.5">
        <span className="connect-btn-label-wrap">
          <span className="connect-btn-label">Get Resume</span>
        </span>
        <span className="connect-btn-icon-wrap">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="connect-chevron"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </span>
      </span>
    </a>
  )
}
