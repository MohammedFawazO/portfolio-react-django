import React, { useState } from 'react';
import { Download } from 'lucide-react';

export const BlueprintPillButton = ({ label = "TRIGGER_ENGAGE_(6)", onClick, heightOnRight = false, hoverIcon = null }) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div className="relative inline-block p-4 select-none font-mono">
      {/* Outer Technical Bounding Box Blueprint Frame */}
      <div className="relative px-1 py-5 border border-dashed border-[#00d2ff]/30 rounded-none">

        {/* Width Dimension Indicator — follows the inner frame width */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-[176px] flex flex-col items-center pointer-events-none">
          <span className="text-[10px] text-[#00d2ff] mb-0.5 tracking-tight font-semibold">W: 176px</span>
          <div className="relative w-full">
            <div className="absolute left-1 right-1 top-1/2 -translate-y-1/2 h-[1px] bg-[#00d2ff] opacity-80" />
            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[#00d2ff] text-[8px] transform -rotate-90">▲</span>
            <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[#00d2ff] text-[8px] transform rotate-90">▲</span>
          </div>
        </div>

        {/* The Blueprint Button Target */}
        <div className="relative">
          {/* Height Dimension Indicator — matches the inner frame height */}
          <div className={`absolute -top-2 -bottom-2 flex items-center gap-1 ${heightOnRight ? '-right-14' : '-left-14'}`}>
            {!heightOnRight && <span className="text-[10px] text-[#00d2ff] whitespace-nowrap font-semibold">H: 38px</span>}
            <div className={`relative h-full ${heightOnRight ? 'ml-1' : 'mr-1'}`}>
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-[#00d2ff] opacity-80" />
              <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#00d2ff] text-[8px] leading-none">▲</span>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-[#00d2ff] text-[8px] leading-none transform rotate-180">▲</span>
            </div>
            {heightOnRight && <span className="text-[10px] text-[#00d2ff] whitespace-nowrap font-semibold">H: 38px</span>}
          </div>

          {/* Inner frame sitting under the button */}
          <div className="absolute -top-2 -bottom-2 left-2 right-2 border-2 border-solid border-[#00d2ff]/70 rounded-lg pointer-events-none" />
          {/* Smaller dotted inner frame */}
          <div className="absolute left-3 right-3 top-[-4px] bottom-[-4px] border border-dashed border-[#00d2ff]/40 rounded-md pointer-events-none" />
          <button
            onClick={onClick}
            className="relative z-10 w-[200px] h-[38px] rounded-full bg-transparent text-white border border-[#00d2ff] flex items-center justify-center transition-all duration-150 active:bg-[#001a2e] active:scale-[0.99] focus:outline-none overflow-hidden group shadow-[0_0_15px_rgba(0,210,255,0.15)] hover:shadow-[0_0_25px_rgba(0,210,255,0.35)]"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Dynamic Blueprint Alignment Crosshair Lines */}
            {isHovered && (
              <>
                {/* Horizontal dynamic wireframe line */}
                <div
                  className="absolute left-0 right-0 h-[1px] bg-[#00d2ff] opacity-40 pointer-events-none"
                  style={{ top: coords.y }}
                />
                {/* Vertical dynamic wireframe line */}
                <div
                  className="absolute top-0 bottom-0 w-[1px] bg-[#00d2ff] opacity-40 pointer-events-none"
                  style={{ left: coords.x }}
                />
              </>
            )}

            {/* Centered Button Text String */}
            <span className="relative z-10 inline-flex items-center text-xs font-black tracking-widest text-[#00d2ff] group-hover:text-white transition-colors duration-150 drop-shadow-[0_0_2px_rgba(0,210,255,0.5)]">
              {label}
              {isHovered && hoverIcon && (
                <span className={"inline-flex items-center text-[#00d2ff] ml-2 transition-all duration-200 " + (isHovered ? "opacity-100 w-auto animate-[iconNudge_1s_ease-in-out_infinite]" : "opacity-0 w-0")}>
                  {hoverIcon}
                </span>
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
