import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

const PASSWORD_CHAR = '\u2022'

function SmoothInput({
  className,
  wrapperClassName,
  value,
  defaultValue = '',
  onChange,
  onBlur,
  type = 'text',
  placeholder = 'Type something...',
  label,
  error,
  ...props
}) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const caretX = useMotionValue(0)
  const caretOpacity = useMotionValue(0)
  const containerRef = useRef(null)
  const inputRef = useRef(null)
  const measureRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  const isControlled = value !== undefined
  const inputValue = isControlled ? String(value) : internalValue

  const springCaretX = useSpring(caretX, {
    stiffness: prefersReducedMotion ? 10000 : 500,
    damping: prefersReducedMotion ? 100 : 30,
    mass: 0.5,
  })

  const syncMeasureSpan = () => {
    const input = inputRef.current
    const measureSpan = measureRef.current
    if (!input || !measureSpan) return

    const styles = window.getComputedStyle(input)
    measureSpan.style.font = `${styles.fontStyle} ${styles.fontWeight} ${styles.fontSize} ${styles.fontFamily}`
    measureSpan.style.letterSpacing = styles.letterSpacing
  }

  const measurePrefixWidth = (text) => {
    const input = inputRef.current
    const measureSpan = measureRef.current
    if (!input || !measureSpan) return null

    syncMeasureSpan()
    measureSpan.textContent = text

    const paddingLeft = parseFloat(window.getComputedStyle(input).paddingLeft) || 0

    return text.length > 0
      ? measureSpan.offsetWidth + paddingLeft
      : paddingLeft - 1
  }

  const scrollCaretIntoView = (target, absoluteWidth) => {
    const styles = window.getComputedStyle(target)
    const paddingLeft = parseFloat(styles.paddingLeft) || 0
    const paddingRight = parseFloat(styles.paddingRight) || 0
    const maxScroll = Math.max(0, target.scrollWidth - target.clientWidth)
    const visibleRight = target.scrollLeft + target.clientWidth - paddingRight
    const visibleLeft = target.scrollLeft + paddingLeft

    if (absoluteWidth > visibleRight) {
      target.scrollLeft = Math.min(
        absoluteWidth - target.clientWidth + paddingRight,
        maxScroll,
      )
      return
    }

    if (absoluteWidth < visibleLeft) {
      target.scrollLeft = Math.max(0, absoluteWidth - paddingLeft)
    }
  }

  const getCaretIndex = (target) => {
    const selectionStart = target.selectionStart ?? 0
    const selectionEnd = target.selectionEnd ?? 0

    if (selectionStart === selectionEnd) {
      return selectionStart
    }

    return target.selectionDirection === 'backward'
      ? selectionStart
      : selectionEnd
  }

  const updateCaretFromInput = (target) => {
    const selectionStart = target.selectionStart ?? 0
    const selectionEnd = target.selectionEnd ?? 0
    const hasSelection = selectionStart !== selectionEnd
    const caretIndex = getCaretIndex(target)
    const isPassword = target.type === 'password'
    const textBeforeCaret = isPassword
      ? PASSWORD_CHAR.repeat(caretIndex)
      : target.value.slice(0, caretIndex)

    const absoluteWidth = measurePrefixWidth(textBeforeCaret)
    if (absoluteWidth === null) return

    scrollCaretIntoView(target, absoluteWidth)

    const styles = window.getComputedStyle(target)
    const paddingLeft = parseFloat(styles.paddingLeft) || 0
    const paddingRight = parseFloat(styles.paddingRight) || 0
    const caretPosition = absoluteWidth - target.scrollLeft
    const minX = paddingLeft - 1
    const maxX = target.clientWidth - paddingRight
    const isCaretVisible = caretPosition >= minX && caretPosition <= maxX + 1

    caretX.set(Math.min(caretPosition, maxX))

    if (!isCaretVisible || hasSelection) {
      caretOpacity.set(0)
      return
    }

    caretOpacity.set(1)
  }

  const updateCaretRef = useRef(updateCaretFromInput)
  updateCaretRef.current = updateCaretFromInput
  const caretOpacityRef = useRef(caretOpacity)
  caretOpacityRef.current = caretOpacity

  useEffect(() => {
    const input = inputRef.current
    if (input && document.activeElement === input) {
      updateCaretRef.current(input)
    }
  }, [inputValue])

  useEffect(() => {
    const input = inputRef.current
    const container = containerRef.current
    if (!input || !container) return

    const updateCaretIfFocused = () => {
      if (document.activeElement === input) {
        updateCaretRef.current(input)
      }
    }

    const handleSelectionChange = () => {
      if (document.activeElement !== input) return
      requestAnimationFrame(() => {
        if (document.activeElement === input) {
          updateCaretRef.current(input)
        }
      })
    }

    document.addEventListener('selectionchange', handleSelectionChange)
    document.fonts.addEventListener('loadingdone', updateCaretIfFocused)
    void document.fonts.ready.then(updateCaretIfFocused)
    input.addEventListener('scroll', updateCaretIfFocused)

    const resizeObserver = new ResizeObserver(updateCaretIfFocused)
    resizeObserver.observe(container)

    updateCaretIfFocused()

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange)
      document.fonts.removeEventListener('loadingdone', updateCaretIfFocused)
      input.removeEventListener('scroll', updateCaretIfFocused)
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <div className={clsx('w-full', wrapperClassName)}>
      {label && (
          <label className="block text-[12px] font-medium text-[#59636E] mb-1 uppercase tracking-[0.182em] font-[family-name:var(--font-mono)]">
          {label}
        </label>
      )}
      <div
        ref={containerRef}
        className={clsx(
          'relative w-full rounded-[8px] border bg-[#0B0F13] px-[22px] py-2',
          'transition-colors duration-200',
          error
            ? 'border-[#35C9E8]'
            : 'border-[rgba(255,255,255,0.1)] focus-within:border-[#6FE7FF]',
          className,
        )}
        style={{ caretColor: 'transparent' }}
      >
        <input
          {...props}
          ref={inputRef}
          type={type}
          placeholder={placeholder}
          className={clsx(
            'w-full bg-transparent outline-none text-[#F2F5F7]',
            'placeholder-[#59636E]',
          )}
          value={inputValue}
          onChange={(e) => {
            if (!isControlled) setInternalValue(e.target.value)
            onChange?.(e)
            requestAnimationFrame(() => {
              updateCaretRef.current(e.target)
            })
          }}
          onBlur={(e) => {
            caretOpacityRef.current.set(0)
            onBlur?.(e)
          }}
        />
        <span
          ref={measureRef}
          aria-hidden
          className="pointer-events-none invisible absolute top-0 left-0 whitespace-pre"
        />
        <motion.div
          className="bg-[#6FE7FF] pointer-events-none h-[1.2em] w-0.5 absolute top-1/2 -translate-y-1/2"
          style={{ x: springCaretX, opacity: caretOpacity }}
        />
      </div>
      {error && (
        <p className="mt-1 text-[12px] text-[#8D98A4]">{error}</p>
      )}
    </div>
  )
}

export default SmoothInput
