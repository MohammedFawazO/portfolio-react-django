import clsx from 'clsx'

const variants = {
  /* Ice blue accent : primary CTA */
  primary:
    'bg-[#6FE7FF] text-[#07090B] hover:bg-[#35C9E8] focus:ring-[#6FE7FF] shadow-[0_8px_24px_rgba(111,231,255,0.18)]',
  /* Deep teal : secondary brand CTA */
  teal:
    'bg-[#0A3332] text-[#F5F7F7] hover:bg-[#164C4A] focus:ring-[#236966] border border-[#236966]/40',
  /* Graphite surface */
  secondary:
    'bg-[#202830] text-[#F5F7F7] hover:bg-[#29323A] focus:ring-[#6FE7FF] border border-[#29323A]',
  /* Outlined */
  outline:
    'border border-[#29323A] text-[#F5F7F7] hover:bg-[#12171C] hover:text-[#6FE7FF] focus:ring-[#6FE7FF]',
  /* Light (for light sections) */
  light:
    'bg-[#0A3332] text-[#F5F7F7] hover:bg-[#164C4A] focus:ring-[#236966]',
  ghost: 'text-[#AEB9BD] hover:bg-[#12171C] focus:ring-[#6FE7FF]',
  danger: 'bg-[#D64545] text-white hover:bg-[#BF3A3A] focus:ring-[#D64545]',
  success: 'bg-[#2E8B57] text-white hover:bg-[#247045] focus:ring-[#2E8B57]',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-3.5 text-base',
  xl: 'px-9 py-4 text-lg',
}

function Button({
  children,
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  className,
  disabled = false,
  loading = false,
  fullWidth = false,
  type = 'button',
  ...props
}) {
  const isButton = Component === 'button'
  return (
    <Component
      type={isButton ? type : undefined}
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-semibold rounded-[12px]',
        'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#07090B]',
        isButton && 'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={isButton ? disabled || loading : undefined}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </Component>
  )
}

export default Button
