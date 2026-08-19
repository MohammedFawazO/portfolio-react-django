import { cn } from '../../lib/utils'

function CandyButton({ className, children = 'Learn More', ...props }) {
  return (
    <button
      className={cn(
        'relative text-[#000000] font-medium text-[14px] leading-[22px]',
        'px-6 py-3 rounded-[8px] cursor-pointer transition-all duration-200',
        'bg-[#ffffff] hover:bg-[#f5f5f7]',
        'inline-flex items-center gap-2',
        className
      )}
      {...props}
    >
      {children}
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </button>
  )
}

export default CandyButton
