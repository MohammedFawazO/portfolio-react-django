import clsx from 'clsx'

function SectionHeading({
  title,
  subtitle,
  eyebrow,
  alignment = 'center',
  tone = 'dark',
  className,
  subtitleClassName,
}) {
const isLight = tone === 'light'
  // beige/black/blue theme - the contact + résumé pages
  const isBeige = tone === 'beige'

  const titleColor = isBeige ? 'text-black' : isLight ? 'text-[#0A3332]' : 'text-[#F5F7F7]'
  const subColor = isBeige ? 'text-[#666]' : isLight ? 'text-[#405354]' : 'text-[#AEB9BD]'
  const eyebrowColor = isBeige ? 'text-[#2d8cf0]' : isLight ? 'text-[#236966]' : 'text-[#6FE7FF]'

  return (
    <div
      className={clsx(
        'mb-12 md:mb-16',
        alignment === 'center' && 'text-center',
        alignment === 'left' && 'text-left',
        alignment === 'right' && 'text-right',
        className
      )}
    >
      {eyebrow && (
        <div
          className={clsx(
            'flex items-center gap-3 mb-5',
            alignment === 'center' && 'justify-center'
          )}
        >
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-current opacity-70" />
          <span
            className={clsx(
              'text-[11px] font-[family-name:var(--font-mono)] uppercase tracking-[0.3em] font-medium',
              eyebrowColor
            )}
          >
            {eyebrow}
          </span>
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-current opacity-70" />
        </div>
      )}
      <h2
        className={clsx(
          'font-[family-name:var(--font-display)] text-[34px] md:text-[48px] leading-[1.05] font-semibold tracking-tight',
          titleColor
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={clsx(
            'text-[17px] font-light max-w-2xl leading-relaxed',
            subtitleClassName || 'mt-4',
            alignment === 'center' && 'mx-auto',
            subColor
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}

export default SectionHeading

