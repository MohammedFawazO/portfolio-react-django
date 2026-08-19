import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'

const ArrowIcon = ({ className }) => (
  <svg
    className={cn('ml-[0.3em] size-[0.55em] translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100', className)}
    fill="none"
    viewBox="0 0 10 10"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

function AnimatedLink({
  children,
  to,
  className,
  showArrow = false,
  ...props
}) {
  return (
    <Link
      to={to}
      className={cn(
        'group relative inline-flex items-center',
        "before:pointer-events-none before:absolute before:left-0 before:top-[1.5em] before:h-[0.05em] before:w-full before:bg-current before:content-['']",
        'before:origin-right before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]',
        'hover:before:origin-left hover:before:scale-x-100',
        className,
      )}
      {...props}
    >
      {children}
      {showArrow && <ArrowIcon />}
    </Link>
  )
}

export default AnimatedLink
