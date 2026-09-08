import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowRight, Download } from 'lucide-react'
import { BlueprintPillButton } from '@/components/ui/blueprint-pill-button'
import GlitchScanGridButton from '@/components/ui/glitch-scan-grid-button'

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
  const navigate = useNavigate()
  const blueprint = useModeClass('about-blueprint-nav')
  const test = useModeClass('about-test-nav')

  const handleResumeDownload = () => {
    const a = document.createElement('a')
    a.href = '/media/resume.pdf'
    a.download = 'Mohammed-Fawaz-O-Resume.pdf'
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
    <Link
      to="/contact"
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
      <style>{`
      `}</style>
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
    </Link>
  )
}
