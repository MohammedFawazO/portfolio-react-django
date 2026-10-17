import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { socials, whatsappPrompts } from '../../data/content'
import { useDesignMode } from '../../context/DesignModeContext'

// Reads the number from data/content.js -> socials (the same entry the footer
// and the contact page use), so there is one place to change it.
const whatsapp = socials.find((s) => s.icon === 'whatsapp')

const WHATSAPP_PATH =
  'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z'

const WhatsappGlyph = ({ className = 'h-4 w-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d={WHATSAPP_PATH} />
  </svg>
)

const CloseIcon = ({ className = 'h-4 w-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)

// Icon per prompt, keyed by the `icon` field in content.js. Same inline-path
// pattern as the projects console highlights (see Projects.jsx HIGHLIGHT_ICONS),
// so the two read as one icon set. Stroke-based to match that component.
const PROMPT_ICONS = {
  bulb: (
    <>
      <path d="M9.2 17.5h5.6M10.2 21h3.6" />
      <path d="M12 2.5a6.4 6.4 0 0 0-3.9 11.5c.6.5 1 1.3 1 2.1v.4h5.8v-.4c0-.8.4-1.6 1-2.1A6.4 6.4 0 0 0 12 2.5z" />
    </>
  ),
  suitcase: (
    <>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M2 12.5h20M12 11v2.5" />
    </>
  ),
  laptop: (
    // Screen plus a base that is WIDER than the screen and tapers down to a
    // rounded lip. A flat line under a rectangle reads as a monitor; the
    // flared base is what makes it read as a laptop.
    <>
      <rect x="4" y="4" width="16" height="11" rx="1.5" />
      <path d="M2 15h20l-1.25 3.1a1.4 1.4 0 0 1-1.28.85H4.53a1.4 1.4 0 0 1-1.28-.85L2 15z" />
    </>
  ),
  clouds: (
    <>
      <rect x="2.5" y="4" width="13" height="9.5" rx="2.5" />
      <path d="M6.2 13.4 5 16.6l3.4-1.7" />
      <rect x="9" y="10.5" width="12.5" height="9.5" rx="2.5" />
      <path d="M12.8 19.9 11.8 22.6l3.2-1.5" />
    </>
  ),
}

function PromptIcon({ name }) {
  const path = PROMPT_ICONS[name]
  if (!path) return null
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.75 w-3.75 shrink-0"
      aria-hidden="true"
    >
      {path}
    </svg>
  )
}

// Short, question-form labels. Each one opens WhatsApp with the longer version
// already typed in, so the visitor picks an intent without reading a paragraph
// and still lands on a written composer rather than a blank one.
// Labels and messages live in data/content.js (whatsappPrompts), beside the
// number they send to, so copy and destination are edited in one place.
const WHATSAPP_OPTIONS = whatsappPrompts.options.map((opt) => ({
  ...opt,
  // {name} keeps the opening line from being retyped per option.
  text: opt.text.replace('{name}', whatsappPrompts.name),
}))

// Whether a pre-filled message has already been sent during this visit.
//
// A wa.me deep link cannot merge with a draft. The protocol has no append
// parameter: ?text= SETS the composer content, so if WhatsApp is already holding
// a draft for this contact, opening another pre-filled link replaces it and the
// visitor's typing is lost. Nothing on the page can detect or read that draft,
// so the only thing that can be avoided is a repeat pre-fill. The first option
// of a visit is pre-filled; every later one opens a blank composer and can
// therefore never clobber anything.
const PREFILL_KEY = 'whatsappPrefillUsed'

const readPrefillUsed = () => {
  try {
    return sessionStorage.getItem(PREFILL_KEY) === '1'
  } catch {
    // Private mode or storage disabled. Treat as unused: pre-filling still
    // works, it just loses the one-per-visit protection.
    return false
  }
}

const markPrefillUsed = () => {
  try {
    sessionStorage.setItem(PREFILL_KEY, '1')
  } catch {
    /* no-op */
  }
}

/**
 * Floating WhatsApp CTA. Rendered once in MainLayout, so every route inherits
 * it. Sits above page content but below the modal (z-50) and the home entry
 * overlay (z-100), so it never covers a dialog.
 *
 * Opened by tapping everywhere, and by hovering where hovering exists. The
 * hover handlers are gated on a real hover-capable pointer rather than always
 * attached, because touch also synthesises a mouseenter on tap - that would
 * fire the open twice (once from the synthesised enter, once from the click)
 * and leave the panel stuck open behind a second toggle.
 */
// How far above the last section's bottom border the CTA parks when it rides up.
// Without this the button's bottom edge landed exactly on the border, which read
// as the two being welded together. ~40% of the 56px circle.
const BORDER_CLEARANCE = 24

function WhatsAppButton() {
  const [open, setOpen] = useState(false)
  const [prefillUsed, setPrefillUsed] = useState(readPrefillUsed)
  const { pathname } = useLocation()
  // Desktop only, matching Tailwind's sm: at 40rem / 640px. Kept as a live
  // media query rather than a one-off read so crossing the breakpoint live
  // re-applies the About override instead of needing a reload.
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 640px)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)')
    const onChange = () => setIsDesktop(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // About sits lower on desktop only: that page's hero and section spacing
  // leave less clear room at the bottom edge, so the default desktop resting
  // offset collides with its content. Overriding --fab-bottom (rather than
  // `bottom`) means the scroll handler picks the new resting value up through
  // getComputedStyle, so the footer-riding maths follows automatically.
  const aboutRestingOffset = pathname === '/about' && isDesktop ? '24px' : null

  // Which About hero mode is active, so the CTA can wear that mode's theme.
  //
  // The mode state lives inside About.jsx, which is this button's *child* in
  // the render tree, so it cannot be read as a prop. Two existing signals are
  // used instead, both already owned by About.jsx:
  //   - blueprint / matrix / test  -> the about-*-nav class it puts on <html>
  //   - design                     -> designModeActive in DesignModeContext
  //
  // A MutationObserver keeps this in sync live, so toggling a mode recolours
  // the CTA without a reload and without About.jsx needing to know the CTA
  // exists. About.jsx removes those classes and clears designModeActive on
  // unmount, so the signals reset when leaving the page.
  const { designModeActive } = useDesignMode()
  const [rootMode, setRootMode] = useState(null)

  useEffect(() => {
    const root = document.documentElement
    const read = () => {
      if (root.classList.contains('about-blueprint-nav')) setRootMode('blueprint')
      else if (root.classList.contains('about-matrix-nav')) setRootMode('matrix')
      else if (root.classList.contains('about-test-nav')) setRootMode('test')
      else setRootMode(null)
    }
    read()
    const mo = new MutationObserver(read)
    mo.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => mo.disconnect()
  }, [])

  // Gated on the route as the FIRST guard. Without this, a class left on <html>
  // by anything else could recolour the CTA on Home, Projects or Contact - the
  // attribute simply never gets set there, so the CSS in index.css (which keys
  // only off this attribute) cannot apply. Reversing the guard back to default
  // is automatic: the attribute is omitted, and WhatsApp green is the fallback
  // declared on .wa-cta.
  const aboutMode = pathname === '/about' ? (designModeActive ? 'design' : rootMode) : null
  // Latched once at mount: a device does not gain or lose a mouse mid-visit,
  // and reading it per-render would re-query the media query on every keystroke
  // elsewhere in the tree.
  const [canHover] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches,
  )

  // The panel's open height, measured rather than guessed.
  //
  // `height: auto` cannot be transitioned, which is why this exists at all -
  // but a hardcoded pixel value is worse: it clips a row whenever the real font
  // metrics differ from the ones it was calculated from. So while the panel is
  // closed its contents are already in the DOM, absolutely positioned and
  // overflowing a 56px box, and scrollHeight reports their true height. An
  // explicit px target then keeps the diagonal animation without ever being
  // wrong, so nothing is clipped and no scrollbar is needed.
  const panelRef = useRef(null)
  const [panelHeight, setPanelHeight] = useState(0)

  useEffect(() => {
    const el = panelRef.current
    if (!el || open) return
    const measure = () => {
      // offsetHeight, not scrollHeight: the closed column is laid out at its
      // natural height (top-0 only, no bottom-0), so this is the height the
      // panel actually needs rather than a value derived from overflow.
      // +14px covers the container's own frame: p-1.5 (6px top + 6px bottom)
      // and the 1px border on each side, which box-sizing:border-box folds
      // into the declared height.
      const natural = el.offsetHeight
      if (natural) setPanelHeight(natural + 14)
    }
    measure()
    // Web fonts land after first paint and change every metric above, so a
    // measurement taken at mount is only correct for the fallback face.
    document.fonts?.ready?.then(measure).catch(() => {})
  }, [open])

  // Position restriction: keeps the CTA from ever entering the footer.
  //
  // Ported from a working reference implementation that wrote `style.bottom`
  // directly in px from a single rect read:
  //
  //    const gap = viewH - boundary   // px between the viewport bottom
  //                                   // and the line we must not cross
  //    bottom = Math.max(base, gap)
  //
  // `bottom` IS the distance from the viewport's bottom edge, and
  // getBoundingClientRect() is already viewport-relative, so writing `gap`
  // straight back parks the CTA's bottom edge exactly on `boundary`. No
  // transform, no offsetTop, no overlap arithmetic - so no feedback loop and
  // nothing to drift.
  //
  // `base` (the resting offset) lives in the --fab-bottom custom property
  // rather than in a Tailwind bottom-* class, because `bottom` is now written
  // inline on every frame and would otherwise report its own previous value,
  // freezing the responsive split.
  const [restBottom, setRestBottom] = useState(null)
  const wrapRef = useRef(null)

  useEffect(() => {
    const compute = () => {
      const el = wrapRef.current
      if (!el) {
        setRestBottom(null)
        return
      }

      // The footer shell is static: never animated, never transformed, so its rect is
      // trustworthy. The page's last section is usually a whileInView element, and
      // getBoundingClientRect() INCLUDES transforms - so on a shorter desktop
      // viewport, where whileInView triggers later, the section is often still
      // translated down when measured. A transform does not change body height,
      // so the ResizeObserver never re-fires and the offset rect goes stale,
      // pushing the CTA into the footer. Taking the higher of the two lines
      // makes that impossible: the section can only ever stop the CTA earlier.
      let sectionLine = null
      const main = document.querySelector('main')
      if (main) {
        const kids = Array.from(main.children)
        for (let i = kids.length - 1; i >= 0; i -= 1) {
          const kid = kids[i]
          const cs = getComputedStyle(kid)
          // display:none reports a zero rect, and fixed/absolute elements are not
          // in document flow, so neither is a usable boundary.
          if (cs.display === 'none' || cs.position === 'fixed' || cs.position === 'absolute') {
            continue
          }
          sectionLine = kid.getBoundingClientRect().bottom
          break
        }
      }

      // Footer area = the .footer-shell container plus the large top margin that
      // precedes it, which is the band the background video shows through.
      const footerEl = document.querySelector('footer.footer-responsive')
      const shell = footerEl?.closest('.footer-shell') || footerEl
      let footerLine = null
      if (shell) {
        const marginTop = parseFloat(getComputedStyle(shell).marginTop) || 0
        footerLine = shell.getBoundingClientRect().top - marginTop
      }

      // Whichever line sits higher on screen wins. Smaller viewport-y == higher.
      const boundary =
        sectionLine !== null && footerLine !== null
          ? Math.min(sectionLine, footerLine)
          : (sectionLine ?? footerLine)

      if (boundary === null) {
        setRestBottom(null)
        return
      }

      const viewH = window.innerHeight
      // Distance from the viewport's bottom edge up to that border. Positive
      // once the section's bottom has been scrolled past, i.e. once there is
      // footer below it. Writing it back as `bottom` parks the CTA's bottom
      // edge exactly on the border.
      const gap = viewH - boundary
      // Read the resting offset from the custom property, not from `bottom`.
      // `bottom` is written inline every frame now, so it would report its own
      // previous value and `base` would never track the mobile/desktop split
      // again on resize. A custom property is untouched by an inline bottom.
      // Must be a px value: custom properties are not resolved to px the way a
      // computed `bottom` is, so parseFloat would read '10rem' as 10.
      const base = parseFloat(getComputedStyle(el).getPropertyValue('--fab-bottom')) || 160

      // Not an early return: the boundary is enforced continuously while the section
      // border approaches. `max(base, gap)` holds the resting offset while that
      // border is still below the fold, so the CTA never jumps in early.
      //
      // No upper cap. An earlier `min(viewH - height - 16)` parked the element
      // 16px from the top once the section was scrolled well past, which read as
      // the button jumping to the top-right of the viewport. Letting `bottom`
      // exceed the viewport height instead rides it up and off the top, so it
      // leaves sight entirely - which is the desired behaviour: the footer is
      // not a place a contact CTA belongs.
// + BORDER_CLEARANCE parks the CTA BORDER_CLEARANCE px above the border
        // rather than flush against it. Touching the line exactly made the
        // button look welded to the section edge; a small gap reads as spacing.
        const nextBottom = Math.max(base, gap + BORDER_CLEARANCE)
        setRestBottom(`${Math.round(nextBottom)}px`)
    }
    compute()
    // passive: these only read layout, so the browser never waits on them to
    // paint while scrolling.
    window.addEventListener('scroll', compute, { passive: true })
    window.addEventListener('resize', compute)

    // Extra vs the reference: Home keeps growing after mount as sections animate
    // in and fonts land, so the footer can rise with the pointer stationary.
    const ro = new ResizeObserver(compute)
    ro.observe(document.body)

    return () => {
      window.removeEventListener('scroll', compute)
      window.removeEventListener('resize', compute)
      ro.disconnect()
    }
  }, [])

  if (!whatsapp) return null

  // A text argument means "pre-fill if this visit has not used one yet".
  // Everything else, including the plain green row, opens the composer empty.
  const hrefFor = (text) =>
    !text || prefillUsed ? whatsapp.url : `${whatsapp.url}?text=${encodeURIComponent(text)}`

  const onPromptClick = () => {
    // Only a pre-filled link consumes the one-per-visit allowance; a plain link
    // must not spend it, or the very first prompt could be reduced to blank.
    if (!prefillUsed) {
      markPrefillUsed()
      setPrefillUsed(true)
    }
    setOpen(false)
  }

  return (
    <>
      {/* Tap-anywhere-else backdrop. Touch only: on a hover device the pointer
          leaving the button already closes it, and a full-screen scrim would
          block the links inside the panel. */}
      {open && !canHover && (
        <div
          aria-hidden="true"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40"
        />
      )}

      <div
        ref={wrapRef}
        // The resting offset lives in --fab-bottom so the scroll handler can read
        // it back after this element's inline `bottom` has taken over; the
        // sm: variant keeps the responsive split intact on resize.
        style={{
          ...(restBottom ? { bottom: restBottom } : {}),
          ...(aboutRestingOffset ? { '--fab-bottom': aboutRestingOffset } : {}),
        }}
        className={[
          // wa-cta declares the accent tokens. The green here is only the default
          // fallback in CSS; every colour below resolves through --wa-accent, so
          // an About mode recolours the whole component by overriding one custom
          // property in index.css rather than by swapping classes here.
          'wa-cta fixed right-4 z-41 bottom-(--fab-bottom) sm:right-6',
          '[--fab-bottom:120px] sm:[--fab-bottom:52px]',
          // No transition on `bottom` on purpose. The value is rewritten every
          // scroll frame to track the boundary, so easing it made the CTA lag
          // behind the pointer and overshoot on the way - a rubbery bounce,
          // worst on fast scroll. Snapping 1:1 reads as solid and mechanical.
        ].join(' ')}
        // Omitted outside /about, which is what stops an About mode theme from
        // reaching any other page. See the guard on aboutMode above.
        data-about-mode={aboutMode ?? undefined}
        // Mirrors the measured offset into the DOM so it can be confirmed in
        // devtools without reading React state.
        data-footer-bottom={restBottom ?? 'resting'}
        onMouseEnter={() => canHover && setOpen(true)}
        onMouseLeave={() => canHover && setOpen(false)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setOpen(false)
        }}
      >
        {/* Outer blueprint frame: a dashed square around the closed circle.
            Placed inside this wrapper (which is position:fixed, so it is the
            containing block) but as a SIBLING of .wa-fab, not a child - the fab
            clips its own overflow for the panel morph, which would cut the frame
            off at the circle's edge. This wrapper has no overflow clipping. */}
        {!open && <span className="wa-fab-frame" aria-hidden="true" />}

        <div
          // Explicit px while open, so width and height interpolate over the
          // same 420ms and the panel grows along one diagonal. Falls back to
          // 252px only if measurement somehow produced nothing.
          style={open && panelHeight ? { height: `${panelHeight}px` } : undefined}
          className={[
            'relative origin-bottom-right overflow-hidden border',
            // Both dimensions are declared as explicit lengths, never `auto`.
            // `auto` is not an interpolable target here: the height resolved to
            // its final size on the first frame while the width was still easing,
            // so the panel shot upwards and only then spread sideways. Fixed
            // bottom+right plus a synced width/height transition makes it grow
            // along one diagonal, away from the corner it is pinned to.
            'transition-[width,height,border-radius,padding,background-color,border-color,box-shadow]',
            'duration-420 ease-[cubic-bezier(0.32,0.72,0,1)]',
            open
              ? 'w-67 max-w-[calc(100vw-2rem)] max-h-[calc(100dvh-1.5rem)] scale-100 rounded-lg border-white/10 bg-[rgba(10,12,15,0.95)] p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.55)] backdrop-blur-xl'
              // wa-fab only exists in the closed state, so the blueprint override
              // in index.css (transparent + cyan rule) can never bleed onto the
              // open panel, which keeps its dark surface.
              : 'wa-fab h-14 w-14 scale-[0.96] rounded-full border-black/10 bg-(--wa-accent) shadow-[0_8px_24px_var(--wa-glow)]',
          ].join(' ')}
        >
          {/* Closed face - absolute, so it never sets the panel's height.
              Exits fast and slightly small, so it is gone well before the
              panel's contents arrive. */}
          <button
            type="button"
            aria-label="Chat on WhatsApp"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={[
              'absolute inset-0 flex items-center justify-center text-white',
              'transition-[opacity,transform] duration-150 ease-in',
              // hover:scale-105 is wrapped in @media (hover:hover) by hand.
              // Tailwind v4 emits a bare :hover here, and touch browsers keep
              // :hover latched after a tap, which left the circle stuck at
              // 105% on mobile. active:scale-95 gives touch its own feedback.
              '[@media(hover:hover)]:hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95',
              '[-webkit-tap-highlight-color:transparent]',
              open ? 'pointer-events-none scale-90 opacity-0' : 'scale-100 opacity-100',
            ].join(' ')}
          >
            <WhatsappGlyph className="h-7 w-7" />
            {/* Inner dotted ring. Hidden by default and only drawn in blueprint
                mode by CSS, mirroring the dotted inner frame BlueprintPillButton
                puts around its target. */}
            <span className="wa-fab-ring" aria-hidden="true" />
          </button>

          {/* Contents cascade in rather than appearing as one block: each row fades and
              lifts into place on its own delay, so the eye is led down the list
              as the panel finishes widening. */}
          <div
            ref={panelRef}
            inert={!open}
            className={[
              'flex flex-col',
              // h-full now that the container has a real height, so the three
              // blocks lay out inside the animating box instead of defining it.
              // Closed, it is top-anchored with no bottom-0 so it keeps its
              // natural height and can be measured exactly.
              open
                ? 'relative h-full opacity-100'
                : 'pointer-events-none absolute inset-x-0 top-0 opacity-0',
            ].join(' ')}
          >
            <div
              style={{ transitionDelay: open ? '90ms' : '0ms' }}
              className={[
                'flex shrink-0 items-center justify-between gap-2 border-b border-white/10 px-1.5 pb-2 pt-1.5',
                'transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
                open ? 'translate-y-0 opacity-100' : '-translate-y-1.5 opacity-0',
              ].join(' ')}
            >
              {/* Same display face, tracking and size as the projects console's
                  .console-category label, so the panel reads as part of the
                  same UI rather than a foreign bolt-on. */}
              <h2 className="font-['Michroma',sans-serif] text-[0.66rem] uppercase leading-none tracking-[0.18em] text-(--wa-accent)">
                Chat on WhatsApp
              </h2>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="-mr-1 shrink-0 rounded-md p-1.5 text-white/45 transition-colors duration-150 hover:bg-white/10 hover:text-(--wa-accent) focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-white [-webkit-tap-highlight-color:transparent]"
              >
                <CloseIcon className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Natural height, never flex-1: growing to fill a measured box is what left
                dead space under the last question. The container's height is the
                column's own height, so the list fits exactly. */}
            <div className="flex flex-col justify-start gap-px py-1">
              {WHATSAPP_OPTIONS.map((opt, i) => (
                <a
                  key={opt.id}
                  href={hrefFor(opt.text)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onPromptClick}
                  style={{ transitionDelay: open ? `${150 + i * 55}ms` : '0ms' }}
                  className={[
                    'flex w-full shrink-0 items-center gap-2.5 whitespace-nowrap rounded-md px-2.5 py-2 text-left text-[13px] font-medium',
                    'transition-[opacity,transform,color,background-color] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
                    'focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-white',
                    '[-webkit-tap-highlight-color:transparent]',
                    open ? 'translate-y-0 text-white/70 opacity-100' : 'translate-y-1.5 text-white/70 opacity-0',
                    'hover:bg-(--wa-accent-soft) hover:text-(--wa-accent)',
                  ].join(' ')}
                >
                  <PromptIcon name={opt.icon} />
                  {opt.label}
                </a>
              ))}
            </div>

            {/* Plain chat - the one row that keeps the green + glyph */}
            <a
              href={hrefFor('')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? '380ms' : '0ms' }}
              className={[
                'mt-1 flex w-full shrink-0 items-center justify-center gap-2 rounded-md px-2.5 py-2.5',
                "font-['Michroma',sans-serif] text-[0.62rem] uppercase tracking-[0.16em]",
                'transition-[opacity,transform,background-color]',
                'duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
                '[-webkit-tap-highlight-color:transparent]',
                open
                  ? 'scale-100 bg-(--wa-accent) text-white opacity-100 hover:bg-(--wa-accent-hover)'
                  : 'pointer-events-none scale-95 bg-(--wa-accent) text-white opacity-0',
              ].join(' ')}
            >
              <WhatsappGlyph />
              Open WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export default WhatsAppButton