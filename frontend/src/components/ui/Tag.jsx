import clsx from 'clsx'

function Tag({
  children,
  variant = 'default',
  size = 'md',
  removable = false,
  onRemove,
  className,
}) {
  const variants = {
    default: 'bg-white/[0.06] text-[#AEB9BD] hover:bg-white/[0.1]',
    primary: 'bg-[#6FE7FF]/10 text-[#6FE7FF] hover:bg-[#6FE7FF]/20',
    teal: 'bg-[#0A3332] text-[#B8F2FA] hover:bg-[#164C4A]',
    secondary: 'bg-[#202830] text-[#AEB9BD] hover:bg-[#29323A]',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-white/20"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  )
}

export default Tag
