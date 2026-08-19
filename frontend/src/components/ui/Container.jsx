import clsx from 'clsx'

function Container({
  children,
  size = 'default',
  className,
  as: Component = 'div',
  ...props
}) {
  const sizes = {
    sm: 'max-w-3xl',
    default: 'max-w-6xl',
    lg: 'max-w-7xl',
    full: 'max-w-full',
  }

  return (
    <Component
      className={clsx(
        'mx-auto px-4 sm:px-6 lg:px-8',
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Container
