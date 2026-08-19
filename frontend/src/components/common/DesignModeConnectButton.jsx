import { Link } from 'react-router-dom'

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
            <div className="design-connect-cta-note">
              CTA?
            </div>

            <svg
              className="design-connect-cta-arrow"
              viewBox="0 0 36 32"
              fill="none"
              aria-hidden="true"
            >
              <path
                 d="M14 3C11 9 21 12 16 18C13 21 19 23 23 26"
                 stroke="currentColor"
                 strokeWidth="1.2"
                 strokeLinecap="round"
               />

               <path
                 d="M18 19L23 26L16 25"
                 stroke="currentColor"
                 strokeWidth="1.2"
                 strokeLinecap="round"
                 strokeLinejoin="round"
               />
            </svg>

            {/* Change style annotation */}
            <div className="design-connect-style-note">
              change style?
            </div>

            <svg
              className="design-connect-style-arrow"
              viewBox="0 0 36 32"
              fill="none"
              aria-hidden="true"
            >
              <path
                 d="M14 3C11 9 21 12 16 18C13 21 19 23 23 26"
                 stroke="currentColor"
                 strokeWidth="1.2"
                 strokeLinecap="round"
               />

               <path
                 d="M18 19L23 26L16 25"
                 stroke="currentColor"
                 strokeWidth="1.2"
                 strokeLinecap="round"
                 strokeLinejoin="round"
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
         *
         * This is intentionally independent from
         * ConnectButton.jsx.
         */

        .design-connect-wrapper {
          position: relative;

          display: inline-block;

          /*
           * Gives the annotation room underneath.
           */
          padding-bottom: 105px;

          /*
           * Prevents the handwritten annotations
           * from affecting layout.
           */
          overflow: visible;

          /*
           * Render at half size, anchored to the top-right
           * so it stays pinned in its corner.
           */
          transform: scale(0.35);
          transform-origin: top right;
        }


        /* ==========================================
           DESIGNER SELECTION BOX
           ========================================== */

        .design-connect-selection {
          position: relative;

          display: flex;
          align-items: center;

          /*
           * Width of selected object.
           */
          width: 545px;

          height: 136px;

          /*
           * The dashed rectangle seen in the reference.
           */
          border: 1.5px dashed rgba(70, 70, 70, 0.55);

          /*
           * Very subtle canvas-like fill.
           */
          background:
            rgba(255, 255, 255, 0.08);

          /*
           * Keep selection box behind the actual
           * button and handles.
           */
          box-sizing: border-box;
        }


        /* ==========================================
           SELECTION HANDLES
           ========================================== */

        .design-connect-handle {
          position: absolute;

          width: 18px;
          height: 18px;

          background: #f8f8f5;

          border: 1.5px solid rgba(55, 55, 55, 0.8);

          z-index: 20;

          box-sizing: border-box;
        }

        .handle-tl {
          top: -10px;
          left: -10px;
        }

        .handle-tr {
          top: -10px;
          right: -10px;
        }

        .handle-bl {
          bottom: -10px;
          left: -10px;
        }

        .handle-br {
          bottom: -10px;
          right: -10px;
        }


        /* ==========================================
           ACTUAL CTA
           ========================================== */

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

          /*
           * Rough hand-drawn border.
           */
          border: 2px solid #4c5355;

          /*
           * Deliberately imperfect geometry.
           */
          border-radius:
            19px
            15px
            17px
            21px;

          transform:
            rotate(-0.15deg);

          /*
           * Roughened edge effect.
           */
          box-shadow:
            1px 0 0 rgba(76, 83, 85, 0.45),
            -1px 1px 0 rgba(76, 83, 85, 0.30);

          transition:
            transform 160ms ease,
            background 160ms ease;
        }


        /*
         * Second irregular line around the CTA.
         * This creates the "drawn twice" feeling
         * visible in the reference.
         */
        .design-connect-button::before {
          content: '';

          position: absolute;

          inset: 3px;

          border: 1px solid rgba(76, 83, 85, 0.38);

          border-radius:
            16px
            12px
            15px
            18px;

          transform:
            rotate(0.25deg);

          pointer-events: none;
        }


        .design-connect-button:hover {
          background: rgba(255, 255, 255, 0.38);

          transform:
            rotate(-0.15deg)
            translateY(-1px);
        }


        .design-connect-label {
          position: relative;

          z-index: 2;

          /*
           * Use your actual handwritten font here
           * if you have one.
           */
          font-family:
            "Comic Sans MS",
            "Segoe Print",
            "Bradley Hand",
            cursive;

          font-size: 42px;

          font-weight: 400;

          letter-spacing: -1.5px;

          color: #182027;
        }


        /* ==========================================
           ARROW BOX
           ========================================== */

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

          background:
            rgba(255, 255, 255, 0.20);

          border: 2.5px solid rgba(65, 72, 74, 0.72);

          /*
           * Slightly irregular square.
           */
          border-radius:
            1px
            3px
            0
            2px;

          transform: rotate(0.7deg);

          transition:
            transform 160ms ease,
            background 160ms ease;
        }


        .design-connect-arrow:hover {
          background:
            rgba(255, 255, 255, 0.40);

          transform:
            rotate(0.7deg)
            translateX(2px);
        }


        .design-connect-arrow svg {
          width: 48px;
          height: 32px;

          overflow: visible;
        }


        /* ==========================================
           CTA? ANNOTATION
           ========================================== */

        .design-connect-cta-note {
          position: absolute;

          left: 184px;
          top: 151px;

          color: #8a8f91;

          font-family:
            "Comic Sans MS",
            "Segoe Print",
            "Bradley Hand",
            cursive;

          font-size: 36px;

          font-weight: 400;

          transform:
            rotate(-2deg);

          white-space: nowrap;

          z-index: 5;
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


        /* ==========================================
           CHANGE STYLE? ANNOTATION
           ========================================== */

        .design-connect-style-note {
          position: absolute;

          left: 435px;
          top: 180px;

          color: #f05b9b;

          font-family:
            "Comic Sans MS",
            "Segoe Print",
            "Bradley Hand",
            cursive;

          font-size: 32px;

          font-weight: 600;

          white-space: nowrap;

          transform:
            rotate(-1.5deg);

          z-index: 5;
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


        /* ==========================================
           REDUCED MOTION
           ========================================== */

        @media (prefers-reduced-motion: reduce) {
          .design-connect-button,
          .design-connect-arrow {
            transition: none;
          }
        }


        /* ==========================================
           MOBILE
           ========================================== */

        @media (max-width: 700px) {
          .design-connect-wrapper {
            width: 100%;

            transform-origin: top left;

            /*
             * Scale the entire design object rather
             * than destroying the reference proportions.
             */
            transform: scale(
              min(
                1,
                calc((100vw - 32px) / 545)
              )
            );
          }
        }
      `}</style>
    </div>
  )
}
