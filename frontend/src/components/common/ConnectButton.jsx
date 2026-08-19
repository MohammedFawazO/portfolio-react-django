import { Link } from 'react-router-dom'

export default function ConnectButton({ className = '' }) {
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
