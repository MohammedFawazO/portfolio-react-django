import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { motion } from 'framer-motion'
import { MobileMenu, useIsMobile } from './SpotlightNavbar'
import { findActiveIndex } from './navActive'

const defaultItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact', href: '/contact' },
  { label: 'Resume', href: '/resume' },
]

function DesignModeNavbar({
  items = defaultItems,
  className,
  onItemClick,
}) {
  const location = useLocation()

  // derived from the route (normalised) so the active marker can never point
  // at the page you just left
  const activeIndex = useMemo(
    () => findActiveIndex(items, location.pathname),
    [items, location.pathname]
  )

  const handleItemClick = (item, index) => {
    onItemClick?.(item, index)
  }

  const isMobile = useIsMobile()

  return (
    <div
      className={cn(
        'relative flex justify-center pointer-events-none',
        className
      )}
      style={{ paddingTop: '58px' }}
    >
      {!isMobile && (
        <div className="flex justify-center w-full">
          <nav className="design-navbar relative pointer-events-auto">
        {/* Selection handles */}
        <span className="design-handle design-handle-tl" />
        <span className="design-handle design-handle-tr" />
        <span className="design-handle design-handle-bl" />
        <span className="design-handle design-handle-br" />

        {/* Top / bottom measurement marks */}
        <span className="design-measure design-measure-top" />
        <span className="design-measure design-measure-bottom" />

        <ul className="relative flex items-center justify-center h-full px-3">
          {items.map((item, index) => {
            const isActive = activeIndex === index

            return (
              <li
                key={item.href}
                className="relative h-full flex items-center"
              >
                <Link
                  to={item.href}
                  data-index={index}
                  onClick={() =>
                    handleItemClick(item, index)
                  }
                  className={cn(
                    'design-nav-link',
                    isActive && 'design-nav-link-active'
                  )}
                >
                  {item.label}

{isActive && (
                      <>
                        {/* Active underline */}
                        <motion.span
                          className="design-active-line"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        />

                        {/* Annotation */}
                        <motion.span
                          className="design-active-note"
                          initial={{ opacity: 0, scale: 0.75, y: -4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ duration: 0.35, delay: 0.15 }}
                        >
                          active?
                        </motion.span>

                        {/* Hand-drawn arrow */}
                        <svg
                          className="design-active-arrow"
                          viewBox="0 0 36 32"
                          fill="none"
                          aria-hidden="true"
                        >
                          <motion.path
                            d="M14 3C11 9 21 12 16 18C13 21 19 23 23 26"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                          />
                          <motion.path
                            d="M18 19L23 26L16 25"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.35, ease: "easeOut", delay: 0.75 }}
                          />
                        </svg>
                      </>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
          </nav>
        </div>
      )}

      {isMobile && <MobileMenu items={items} activeIndex={activeIndex} onItemClick={handleItemClick} />}

      <style>{`
        /*
         * DESIGN MODE NAVBAR
         * ------------------
         * This intentionally does NOT share the visual language
         * of SpotlightNavbar.
         */

        .design-navbar {
          position: relative;

          height: 44px;

          /*
           * Let the content determine the width while keeping
           * the selection box visually compact.
           */
          width: max-content;
          min-width: 425px;

          background: rgba(255, 255, 255, 0.18);

          /*
           * Artboard / design-selection boundary.
           */
          border: 1px dashed rgba(65, 65, 65, 0.48);

          /*
           * Intentionally no:
           * border-radius
           * backdrop blur
           * shadow
           * glow
           */
        }

        .design-navbar ul {
          gap: 0;
        }

        .design-nav-link {
          position: relative;

          display: flex;
          align-items: center;
          justify-content: center;

          height: 100%;

          padding: 0 20px;

          color: #242424;

          /*
           * Use a neutral handwritten-ish fallback.
           * Replace this with your actual canvas font if needed.
           */
          font-family:
            "Comic Sans MS",
            "Segoe Print",
            "Bradley Hand",
            cursive;

          font-size: 14px;
          font-weight: 400;

          text-decoration: none;

          transition:
            color 160ms ease,
            transform 160ms ease;
        }

        .design-nav-link:hover {
          color: #111;
        }

        /*
         * Non-active hover : a sketchy underline draws itself in,
         * reusing the active line's hand-drawn treatment (same rotate /
         * skew) but in charcoal so it never competes with the blue
         * active state. Scales from the left like a pen stroke.
         */
        .design-nav-link:not(.design-nav-link-active)::after {
          content: "";

          position: absolute;

          left: 14px;
          right: 14px;
          bottom: 6px;

          height: 2px;

          background: rgba(36, 36, 36, 0.55);
          border-radius: 1px;

          transform:
            rotate(-0.8deg)
            skewX(-8deg)
            scaleX(0);

          transform-origin: left center;

          transition:
            transform 240ms cubic-bezier(0.16, 1, 0.3, 1),
            background-color 240ms ease;
        }

        .design-nav-link:not(.design-nav-link-active):hover::after {
          transform:
            rotate(-0.8deg)
            skewX(-8deg)
            scaleX(1);

          background: rgba(36, 36, 36, 0.8);
        }

        /*
         * Active state is intentionally not a polished
         * pill / background state.
         */
        .design-nav-link-active {
          color: #246bff;
        }

        /*
         * Slightly irregular blue underline.
         */
        .design-active-line {
          position: absolute;

          left: 14px;
          right: 14px;
          bottom: 6px;

          height: 2.5px;

          background: #246bff;
          border-radius: 1px;

          transform:
            rotate(-0.8deg)
            skewX(-8deg);

          transform-origin: left center;
        }

        /*
         * Small handwritten design annotation.
         */
         .design-active-note {
           position: absolute;
           left: 35%;
           bottom: calc(100% + 18px);
           transform: translateX(-50%) rotate(-4deg);

          white-space: nowrap;

          color: #246bff;

          font-family:
            "Comic Sans MS",
            "Segoe Print",
            "Bradley Hand",
            cursive;

          font-size: 12px;
          font-weight: 400;

          pointer-events: none;
        }

        /*
         * Hand-drawn arrow connecting "active?"
         * to the selected item.
         */
        .design-active-arrow {
          position: absolute;

          width: 32px;
          height: 29px;

          left: 50%;
          bottom: calc(100% - 8px);

          transform:
            translateX(-60%)
            rotate(-4deg);

          color: #246bff;

          overflow: visible;

          pointer-events: none;
        }

        /*
         * Selection handles
         */
        .design-handle {
          position: absolute;

          width: 6px;
          height: 6px;

          background: #f8f8f5;

          border: 1px solid rgba(55, 55, 55, 0.65);

          z-index: 20;

          pointer-events: none;
        }

        .design-handle-tl {
          top: -4px;
          left: -4px;
        }

        .design-handle-tr {
          top: -4px;
          right: -4px;
        }

        .design-handle-bl {
          bottom: -4px;
          left: -4px;
        }

        .design-handle-br {
          bottom: -4px;
          right: -4px;
        }

        /*
         * Tiny center measurement markers.
         * These make it feel like an element selected
         * inside a design tool without making the UI noisy.
         */
        .design-measure {
          position: absolute;

          width: 1px;
          height: 7px;

          background: rgba(70, 70, 70, 0.45);

          left: 50%;

          transform: translateX(-50%);

          pointer-events: none;
        }

        .design-measure-top {
          top: -4px;
        }

        .design-measure-bottom {
          bottom: -4px;
        }

        /*
         * Reduced-motion support
         */
        @media (prefers-reduced-motion: reduce) {
          .design-nav-link {
            transition: none;
          }
          .design-nav-link:not(.design-nav-link-active)::after {
            transition: none;
          }
        }

        /*
         * Mobile
         */
        @media (max-width: 640px) {
          .design-navbar {
            min-width: 0;
            width: calc(100vw - 32px);
          }

          .design-nav-link {
            padding: 0 10px;
            font-size: 12px;
          }

          .design-active-line {
            left: 7px;
            right: 7px;
          }

          .design-nav-link:not(.design-nav-link-active)::after {
            left: 7px;
            right: 7px;
          }
        }
      `}</style>
    </div>
  )
}

export default DesignModeNavbar
