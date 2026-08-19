import clsx from 'clsx'

function Skeleton({
  className,
  width,
  height,
  rounded = 'md',
}) {
  const roundedMap = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-[8px]',
    lg: 'rounded-[16px]',
    full: 'rounded-full',
  }

  return (
    <div
      className={clsx(
        'animate-pulse bg-[rgba(255,255,255,0.06)]',
        roundedMap[rounded],
        className
      )}
      style={{ width, height }}
    />
  )
}

function SkeletonCard() {
  return (
    <div className="bg-[#2e2e2e] rounded-[16px] p-8">
      <Skeleton className="h-48 w-full mb-4" rounded="lg" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  )
}

function SkeletonText({ lines = 3 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  )
}

export { Skeleton, SkeletonCard, SkeletonText }
export default Skeleton
