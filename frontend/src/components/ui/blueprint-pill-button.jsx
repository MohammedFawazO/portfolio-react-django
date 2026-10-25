import React, { useState, useRef, useLayoutEffect } from 'react';
import { Download } from 'lucide-react';

export const BlueprintPillButton = ({
  label = "TRIGGER_ENGAGE_(6)",
  onClick,
  heightOnRight = false,
  hoverIcon = null,
  children,
  className = '',
}) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  // Real button dimensions, used by the W/H dimension indicators so the lines
  // + labels reflect the actual rendered size (not fixed magic numbers).
  const btnRef = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  // Refs to the crosshair lines so we can update them synchronously inside
  // mousemove (no React state lag = no visible offset from the cursor tip).
  const hLineRef = useRef(null);
  const vLineRef = useRef(null);
  useLayoutEffect(() => {
    const el = btnRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setSize({ w: Math.round(r.width), h: Math.round(r.height) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleMouseMove = (e) => {
    // Walk up from the event target to find the button's actual rect. This
    // ensures the cursor position is always measured against the button's
    // local (unscaled) coordinate system, regardless of which child element
    // the cursor is currently over (text, icon, etc.) and regardless of any
    // CSS transform on an ancestor (e.g. ConnectButton's scale-0.7 wrapper).
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    let parent = target.parentElement;
    let scaleX = 1;
    let scaleY = 1;
    while (parent) {
      const t = getComputedStyle(parent).transform;
      if (t && t !== 'none') {
        const m = t.match(/matrix\(([^)]+)\)/);
        if (m) {
          const parts = m[1].split(',').map(parseFloat);
          scaleX *= parts[0];
          scaleY *= parts[3];
        }
      }
      parent = parent.parentElement;
    }
    const x = (e.clientX - rect.left) / scaleX;
    const y = (e.clientY - rect.top) / scaleY;
    if (hLineRef.current) hLineRef.current.style.top = `${y}px`;
    if (vLineRef.current) vLineRef.current.style.left = `${x}px`;
    setCoords({ x, y });
  };

  const hasChildren = !!children;

  // Crosshair : full-length lines that meet exactly at the cursor tip.
  // Position is updated via refs on every mousemove (synchronously) so the
  // lines never visibly lag behind the cursor.
  const crosshair = isHovered && (
    <>
      <div
        ref={hLineRef}
        className="absolute left-0 right-0 h-[1px] bg-[#00d2ff] opacity-50 pointer-events-none"
        style={{ top: coords.y }}
      />
      <div
        ref={vLineRef}
        className="absolute top-0 bottom-0 w-[1px] bg-[#00d2ff] opacity-50 pointer-events-none"
        style={{ left: coords.x }}
      />
    </>
  );

  return (
    <div
      className={`bp-shell relative inline-block select-none pointer-events-auto ${className}` + (hasChildren ? " p-2.5" : " p-4")}
      style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
    >
      {/* Outer Technical Bounding Box Blueprint Frame */}
      <div className={"bp-frame relative border border-dashed border-[#00d2ff]/30 rounded-none " + (hasChildren ? "px-1 py-[15px]" : "px-1 py-5")}>

        {/* Width Dimension Indicator - follows the real target width */}
        <div
          className="bp-w-dim absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none"
          style={{ width: size.w ? `${size.w}px` : '200px' }}
        >
          <span className="text-[10px] text-[#00d2ff] mb-0.5 tracking-tight font-semibold">W: {size.w || 200}px</span>
          <div className="relative w-full">
            <div className="absolute left-1 right-1 top-1/2 -translate-y-1/2 h-[1px] bg-[#00d2ff] opacity-80" />
            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[#00d2ff] text-[8px] transform -rotate-90">▲</span>
            <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[#00d2ff] text-[8px] transform rotate-90">▲</span>
          </div>
        </div>

        {/* The Blueprint Button Target (or arbitrary children, e.g. nav links) */}
        <div className="relative">
          {/* Height Dimension Indicator - matches the real target height */}
          <div className={`bp-h-dim ${heightOnRight ? 'bp-h-dim--right -right-16' : 'bp-h-dim--left -left-16'} absolute -top-2 -bottom-2 flex items-center gap-1`}>
            {!heightOnRight && <span className="text-[10px] text-[#00d2ff] whitespace-nowrap font-semibold">H: {size.h || 38}px</span>}
            <div className={`relative h-full ${heightOnRight ? 'ml-1' : 'mr-1'}`}>
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-[#00d2ff] opacity-80" />
              <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#00d2ff] text-[8px] leading-none">▲</span>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-[#00d2ff] text-[8px] leading-none transform rotate-180">▲</span>
            </div>
            {heightOnRight && <span className="text-[10px] text-[#00d2ff] whitespace-nowrap font-semibold">H: {size.h || 38}px</span>}
          </div>

          {/* Inner frame sitting under the target */}
          <div className="absolute -top-2 -bottom-2 left-2 right-2 border-2 border-solid border-[#00d2ff]/70 rounded-lg pointer-events-none" />
          {/* Smaller dotted inner frame */}
          <div className="absolute left-3 right-3 top-[-4px] bottom-[-4px] border border-dashed border-[#00d2ff]/40 rounded-md pointer-events-none" />

          {hasChildren ? (
            // Container variant: used to frame non-button content (e.g. the
            // navbar links) so it inherits every BlueprintPillButton feature
            // - measured W/H, crosshair, nested frames - exactly like RESUME.
            <div
              ref={btnRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative z-10 flex items-center justify-center rounded-full border border-[#00d2ff] bg-transparent shadow-[0_0_15px_rgba(0,210,255,0.15)]"
            >
              {crosshair}
              {children}
            </div>
          ) : (
            <button
              ref={btnRef}
              onClick={onClick}
              className="bp-target relative z-10 w-[200px] h-[38px] rounded-full bg-transparent text-white border border-[#00d2ff] flex items-center justify-center transition-all duration-150 active:bg-[#001a2e] active:scale-[0.99] focus:outline-none overflow-hidden group shadow-[0_0_15px_rgba(0,210,255,0.15)] hover:shadow-[0_0_25px_rgba(0,210,255,0.35)]"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {crosshair}
              {/* Centered Button Text String */}
              <span className="relative z-10 inline-flex items-center text-xs font-black tracking-widest text-[#00d2ff] group-hover:text-white transition-colors duration-150 drop-shadow-[0_0_2px_rgba(0,210,255,0.5)]">
                {label}
                {hoverIcon && (
                  <span className={"inline-flex items-center text-[#00d2ff] ml-2 transition-all duration-300 overflow-hidden " + (isHovered ? "opacity-100 w-[1.25rem] animate-[iconNudgePause_1.6s_ease-in-out_infinite]" : "opacity-0 w-0")}>
                    <span className="inline-flex [&_svg]:size-3.5">{hoverIcon}</span>
                  </span>
                )}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
