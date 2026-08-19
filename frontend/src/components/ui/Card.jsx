import clsx from 'clsx'

const base = 'relative rounded-[16px] border transition-all duration-300'

const variants = {
  standard: 'bg-[#12171C] border-[#29323A] shadow-sm',
  elevated: 'bg-[#202830] border-[#29323A] shadow-md',
  light: 'bg-[#FFFFFF] border-[#D2DCDF] shadow-sm',
  teal: 'bg-[#0A3332] border-[#164C4A] shadow-[0_20px_60px_rgba(10,51,50,0.35)]',
  glass: 'bg-white/[0.04] border-white/[0.08] backdrop-blur-xl shadow-sm',
}

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

function Card({
  children,
  className,
  variant = 'standard',
  hover = false,
  padding = 'md',
  ...props
}) {
  return (
    <div
      className={clsx(
        base,
        variants[variant],
        hover && 'cursor-pointer hover:-translate-y-1 hover:border-[#6FE7FF]/40 hover:shadow-[0_24px_60px_rgba(0,0,0,0.45)]',
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function CardHeader({ children, className }) {
  return <div className={clsx('mb-4', className)}>{children}</div>
}

function CardTitle({ children, className }) {
  return <h3 className={clsx('text-xl font-semibold text-[#F5F7F7]', className)}>{children}</h3>
}

function CardDescription({ children, className }) {
  return <p className={clsx('text-[#AEB9BD] mt-1', className)}>{children}</p>
}

function CardContent({ children, className }) {
  return <div className={clsx(className)}>{children}</div>
}

function CardFooter({ children, className }) {
  return <div className={clsx('mt-4 flex items-center', className)}>{children}</div>
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
export default Card
