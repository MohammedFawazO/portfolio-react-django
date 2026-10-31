import { cn } from '@/lib/utils'

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
      // cn (tailwind-merge) so a caller's padding overrides the default instead
      // of competing with it - plain clsx left both px-* sets in the class list,
      // where the winner is stylesheet order, not the class attribute.
      className={cn(
        'mx-auto px-4 sm:px-8 lg:px-12 2xl:px-20',
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
