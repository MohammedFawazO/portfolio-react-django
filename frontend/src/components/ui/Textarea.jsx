import clsx from 'clsx'

function Textarea({
  label,
  error,
  rows = 4,
  className,
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-white/60 mb-1">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        className={clsx(
          'w-full px-4 py-2.5 rounded-lg border bg-white/[0.05]',
          'text-white',
          'placeholder-white/30',
          'transition-colors duration-200 resize-none',
          'focus:outline-none focus:ring-2 focus:ring-[#6FE7FF]/50 focus:border-transparent',
          error
            ? 'border-red-500/50 focus:ring-red-500/50'
            : 'border-white/[0.08] hover:border-white/[0.15]',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  )
}

export default Textarea
