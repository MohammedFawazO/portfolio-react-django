import clsx from 'clsx'

function LoadingSpinner({
  size = 'md',
  color = 'primary',
  className,
}) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }

  const colors = {
    primary: 'border-[#6FE7FF]',
    white: 'border-[#ffffff]',
    gray: 'border-[#59636E]',
  }

  return (
    <div className={clsx('flex items-center justify-center', className)}>
      <div
        className={clsx(
          'animate-spin rounded-full border-2 border-t-transparent',
          sizes[size],
          colors[color]
        )}
      />
    </div>
  )
}

export default LoadingSpinner
