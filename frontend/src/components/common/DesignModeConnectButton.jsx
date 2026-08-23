import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function DesignModeConnectButton({
  className = '',
  showAnnotations = true,
}) {
  return (
    <div className={`design-connect-wrapper ${className}`}>
      {/* Designer selection box */}
      <div className="design-connect-selection">

        {/* Selection handles */}
        <span className="design-connect-handle handle-tl" />
        <span className="design-connect-handle handle-tr" />
        <span className="design-connect-handle handle-bl" />
        <span className="design-connect-handle handle-br" />

        {/* Actual CTA */}
        <Link
          to="/contact"
          aria-label="Let's Connect"
          className="design-connect-button"
        >
          <span className="design-connect-label">
            Let's Connect
          </span>
        </Link>

        {/* Separate arrow button */}
        <Link
          to="/contact"
          aria-label="Go to contact"
          className="design-connect-arrow"
        >
          <svg
            viewBox="0 0 42 28"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 14
                 C10 13.5 17 14.5 25 14
                 C29 14 33 14 38 14"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            <path
              d="M29 6
                 C32 9 35 11 39 14
                 C35 17 32 19 29 22"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>

        {showAnnotations && (
          <>
            {/* CTA? annotation */}
            <motion.div
              className="design-connect-cta-note"
              initial={{ opacity: 0, scale: 0.8, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
            >
              CTA?
            </motion.div>

            <svg
              className="design-connect-cta-arrow"
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
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
              />

              <motion.path
                d="M18 19L23 26L16 25"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.85 }}
              />
            </svg>

            {/* Change style annotation */}
            <motion.div
              className="design-connect-style-note"
              initial={{ opacity: 0, scale: 0.8, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
            >
              change style?
            </motion.div>

            <svg
              className="design-connect-style-arrow"
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
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
              />

              <motion.path
                d="M18 19L23 26L16 25"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.95 }}
              />
            </svg>
          </>
        )}
      </div>

      <style>{`
        /*
         * ==========================================
         * DESIGN MODE — LET'S CONNECT
         * ==========================================
         */

        .design-connect-wrapper {
          position: relative;
          display: inline-block;
          padding-bottom: 105px;
          overflow: visible;
          transform: scale(0.35);
          transform-origin: top right;
          pointer-events: none;
        }

        /* DESIGNER SELECTION BOX */
        .design-connect-selection {
          position: relative;
          display: flex;
          align-items: center;
          width: 545px;
          height: 136px;
          border: 1.5px dashed rgba(70, 70, 70, 0.55);
          background: rgba(255, 255, 255, 0.08);
          box-sizing: border-box;
          pointer-events: none;
        }

        /* SELECTION HANDLES */
        .design-connect-handle {
          position: absolute;
          width: 18px;
          height: 18px;
          background: #f8f8f5;
          border: 1.5px solid rgba(55, 55, 55, 0.8);
          z-index: 20;
          box-sizing: border-box;
          pointer-events: none;
        }

        .handle-tl { top: -10px; left: -10px; }
        .handle-tr { top: -10px; right: -10px; }
        .handle-bl { bottom: -10px; left: -10px; }
        .handle-br { bottom: -10px; right: -10px; }

        /* ACTUAL CTA */
        .design-connect-button {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 445px;
          height: 112px;
          margin-left: 9px;
          color: #182027;
          text-decoration: none;
          background: rgba(255, 255, 255, 0.20);
          border: 2px solid #4c5355;
          border-radius: 19px 15px 17px 21px;
          transform: rotate(-0.15deg);
          box-shadow: 1px 0 0 rgba(76, 83, 85, 0.45), -1px 1px 0 rgba(76, 83, 85, 0.30);
          transition: transform 160ms ease, background 160ms ease;
          pointer-events: auto;
        }

        .design-connect-button::before {
          content: '';
          position: absolute;
          inset: 3px;
          border: 1px solid rgba(76, 83, 85, 0.38);
          border-radius: 16px 12px 15px 18px;
          transform: rotate(0.25deg);
          pointer-events: none;
        }

        .design-connect-button:hover {
          background: rgba(255, 255, 255, 0.38);
          transform: rotate(-0.15deg) translateY(-1px);
        }

        .design-connect-label {
          position: relative;
          z-index: 2;
          font-family: "Comic Sans MS", "Segoe Print", "Bradley Hand", cursive;
          font-size: 42px;
          font-weight: 400;
          letter-spacing: -1.5px;
          color: #182027;
          pointer-events: none;
        }

        /* ARROW BOX */
        .design-connect-arrow {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 68px;
          height: 68px;
          margin-left: 42px;
          color: #182027;
          text-decoration: none;
          background: rgba(255, 255, 255, 0.20);
          border: 2.5px solid rgba(65, 72, 74, 0.72);
          border-radius: 1px 3px 0 2px;
          transform: rotate(0.7deg);
          transition: transform 160ms ease, background 160ms ease;
          pointer-events: auto;
        }

        .design-connect-arrow:hover {
          background: rgba(255, 255, 255, 0.40);
          transform: rotate(0.7deg) translateX(2px);
        }

        .design-connect-arrow svg {
          width: 48px;
          height: 32px;
          overflow: visible;
          pointer-events: none;
        }

        /* ANNOTATIONS */
        .design-connect-cta-note {
          position: absolute;
          left: 184px;
          top: 151px;
          color: #8a8f91;
          font-family: "Comic Sans MS", "Segoe Print", "Bradley Hand", cursive;
          font-size: 36px;
          font-weight: 400;
          transform: rotate(-2deg);
          white-space: nowrap;
          z-index: 5;
          pointer-events: none;
        }

        .design-connect-cta-arrow {
          position: absolute;
          left: 178px;
          top: 100px;
          width: 72px;
          height: 64px;
          color: #8a8f91;
          overflow: visible;
          pointer-events: none;
        }

        .design-connect-style-note {
          position: absolute;
          left: 435px;
          top: 180px;
          color: #f05b9b;
          font-family: "Comic Sans MS", "Segoe Print", "Bradley Hand", cursive;
          font-size: 32px;
          font-weight: 600;
          white-space: nowrap;
          transform: rotate(-1.5deg);
          z-index: 5;
          pointer-events: none;
        }

        .design-connect-style-arrow {
          position: absolute;
          left: 425px;
          top: 96px;
          width: 90px;
          height: 80px;
          color: #f05b9b;
          overflow: visible;
          pointer-events: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .design-connect-button,
          .design-connect-arrow {
            transition: none;
          }
        }

        @media (max-width: 700px) {
          .design-connect-wrapper {
            width: 100%;
            transform-origin: top left;
            transform: scale(min(1, calc((100vw - 32px) / 545)));
          }
        }
      `}</style>
    </div>
  )
}
