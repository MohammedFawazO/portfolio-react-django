import { cn } from '../../lib/utils'

function PopButton({ className, children = 'Learn More', ...props }) {
  return (
    <button
      className={cn(
        'group relative inline-flex items-center justify-center font-semibold uppercase text-[#07090B]',
        'px-8 py-5 rounded-xl bg-[#6FE7FF] border-2 border-[#35C9E8]',
        'transition-all duration-150 ease-[cubic-bezier(0,0,0.58,1)]',
        'shadow-[0_12px_0_-2px_#35C9E8,0_12px_0_0_#6FE7FF]',
        'hover:bg-[#35C9E8] hover:translate-y-1 hover:shadow-[0_8px_0_-2px_#35C9E8,0_8px_0_0_#6FE7FF]',
        'active:bg-[#35C9E8] active:translate-y-3 active:shadow-[0_0px_0_-2px_#35C9E8,0_0px_0_0_#6FE7FF]',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export default PopButton
