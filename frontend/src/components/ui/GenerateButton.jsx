import React, { useState } from "react"
import { cn } from "../../lib/utils"

export function GenerateButton({
  hue = 190,
  isGenerating: controlledIsGenerating,
  className,
  onClick,
  children,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false)

  const isGenerating = controlledIsGenerating !== undefined ? controlledIsGenerating : isFocused

  return (
    <div className="relative inline-block group">
      <style>{`
        .gen-btn {
          --border-radius: 24px;
          --transition: 0.25s;
          --button-color: #0B0F13;
          --highlight-color-hue: ${hue}deg;

          user-select: none;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          padding: 12px 24px;
          font-family: "Poppins", "Inter", "Segoe UI", sans-serif;
          font-size: 14px;
          font-weight: 500;
          white-space: nowrap;

          background-color: var(--button-color);

          box-shadow:
            inset 0px 1px 1px rgba(255, 255, 255, 0.15),
            inset 0px 2px 2px rgba(255, 255, 255, 0.1),
            0px 4px 12px rgba(0, 0, 0, 0.3);

          border: solid 1px rgba(255, 255, 255, 0.1);
          border-radius: var(--border-radius);
          cursor: pointer;
          will-change: transform;

          transition: box-shadow var(--transition), border-color var(--transition), background-color var(--transition), transform var(--transition);
        }

        .gen-btn::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: inherit;
          pointer-events: none;
          background-image: linear-gradient(
            0deg,
            #fff,
            hsl(var(--highlight-color-hue), 100%, 70%),
            hsla(var(--highlight-color-hue), 100%, 70%, 50%),
            8%,
            transparent
          );
          background-position: 0 0;
          opacity: 0;
          transition: opacity var(--transition);
        }

        .gen-btn-letter {
          position: relative;
          color: rgba(255,255,255,0.7);
          transition: color var(--transition), text-shadow var(--transition);
        }

        .gen-btn[data-generating="true"] .gen-btn-letter {
          animation: gen-pulse 1.5s ease-in-out infinite;
        }

        @keyframes gen-pulse {
          0%, 100% { color: rgba(255,255,255,0.7); }
          50% { color: #fff; text-shadow: 0 0 8px hsl(var(--highlight-color-hue), 100%, 70%); }
        }

        .gen-btn[data-generating="true"]::after {
          opacity: 0.4;
          mask-image: linear-gradient(0deg, #fff, transparent);
        }

        .gen-btn:active {
          transform: scale(0.97);
          border-color: hsla(var(--highlight-color-hue), 100%, 80%, 60%);
          background-color: hsla(var(--highlight-color-hue), 50%, 15%, 0.5);
        }

        .gen-btn:active::after {
          opacity: 0.8;
          mask-image: linear-gradient(0deg, #fff, transparent);
        }

        .gen-btn:hover {
          border-color: hsla(var(--highlight-color-hue), 100%, 80%, 40%);
          box-shadow:
            inset 0px 1px 1px rgba(255, 255, 255, 0.2),
            inset 0px 2px 4px rgba(255, 255, 255, 0.1),
            0px 4px 16px rgba(0, 0, 0, 0.4),
            0 0 20px hsla(var(--highlight-color-hue), 100%, 70%, 0.15);
        }

        .gen-btn:hover::after {
          opacity: 0.6;
          mask-image: linear-gradient(0deg, #fff, transparent);
        }

        .gen-btn:hover .gen-btn-letter {
          color: #fff;
        }
      `}</style>

      <button
        type="button"
        className={cn("gen-btn", className)}
        data-generating={isGenerating}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onClick={(e) => {
          setIsFocused(true)
          onClick?.(e)
        }}
        {...props}
      >
        {children ? (
          <span className="gen-btn-letter">{children}</span>
        ) : (
          "Generate".split("").map((letter, i) => (
            <span key={i} className="gen-btn-letter">{letter}</span>
          ))
        )}
      </button>
    </div>
  )
}

export default GenerateButton
