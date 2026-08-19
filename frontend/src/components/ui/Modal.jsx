import { useEffect } from 'react'
import clsx from 'clsx'

function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className,
}) {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-[#000000]/80 transition-opacity"
          onClick={onClose}
        />
        <div
          className={clsx(
            'relative w-full bg-[#12171C] border border-[#29323A] rounded-[16px]',
            'transform transition-all shadow-[0_30px_80px_rgba(0,0,0,0.7)]',
            sizes[size],
            className
          )}
        >
          {title && (
            <div className="flex items-center justify-between p-4 border-b border-[#29323A]">
              <h3 className="text-[18px] font-light text-[#F5F7F7]">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="text-[#6F7C82] hover:text-[#F5F7F7] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          <div className="p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal
