import clsx from 'clsx'

const variants = {
  default: 'bg-white/[0.06] text-[#AEB9BD]',
  primary: 'bg-[#6FE7FF]/10 text-[#6FE7FF]',
  teal: 'bg-[#0A3332] text-[#B8F2FA]',
  secondary: 'bg-[#202830] text-[#AEB9BD]',
  light: 'bg-[rgba(35,105,102,0.10)] text-[#0A3332]',
  success: 'bg-green-500/10 text-green-400',
  warning: 'bg-yellow-500/10 text-yellow-400',
  danger: 'bg-red-500/10 text-red-400',
}

function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
  onClick,
}) {
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
      onClick={onClick}
    >
      {children}
    </span>
  )
}

export default Badge
