import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { BlueprintPillButton } from '@/components/ui/blueprint-pill-button'

// Detect blueprint mode by watching the html class toggled by About.jsx.
// Keeps the global ConnectButton untouched in every other mode.
function useBlueprintActive() {
  const [active, setActive] = useState(false)
  useEffect(() => {
    const root = document.documentElement
    const update = () => setActive(root.classList.contains('about-blueprint-nav'))
    update()
    const mo = new MutationObserver(update)
    mo.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => mo.disconnect()
  }, [])
  return active
}

export default function ConnectButton({ className = '' }) {
  const navigate = useNavigate()
  const blueprint = useBlueprintActive()

  // In blueprint mode, render the exact BlueprintPillButton (same as the
  // hero "RESUME" button) so the connect CTA matches it precisely. Pinned
  // top-right by the parent ConnectSlot, scaled slightly for balance.
  if (blueprint) {
    return (
      <span
        className="inline-block pointer-events-auto"
        style={{ transform: 'scale(0.7) translateY(-14px)', transformOrigin: 'top right' }}
      >
        <BlueprintPillButton
          label="LET'S_CONNECT"
          heightOnRight={false}
          hoverIcon={<ArrowRight />}
          onClick={() => navigate('/contact')}
        />
      </span>
    )
  }

  return (
    <Link
      to="/contact"
      aria-label="Let's Connect"
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
        @keyframes chevron-slide {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }
        .connect-btn:hover .connect-chevron {
          animation: chevron-slide 0.8s ease-in-out infinite;
        }
      `}</style>
      <span className="connect-btn flex items-center gap-2">
        Let's Connect
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
          <path d="m9 18 6-6-6-6" />
        </svg>
      </span>
    </Link>
  )
}
