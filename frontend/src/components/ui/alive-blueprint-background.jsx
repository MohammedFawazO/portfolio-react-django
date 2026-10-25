import React, { useState, useEffect, useRef } from 'react';

export const AliveBlueprintBackground = ({ children, className = '' }) => {
  const rootRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [metrics, setMetrics] = useState({ tick: 0, noise: 0 });

  const handleMouseMove = (e) => {
    const rect = rootRef.current ? rootRef.current.getBoundingClientRect() : { left: 0, top: 0 };
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        tick: Math.floor(Math.random() * 8999 + 1000),
        noise: parseFloat((Math.random() * 2 + 0.15).toFixed(4)),
      });
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={rootRef} className={"relative w-full min-h-screen bg-[#001428] overflow-hidden font-mono flex items-center justify-center p-8 select-none " + className}>

      {/* 1. INFINITE DRIFTING BASE GRID (EXISTING) */}
      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none animate-[gridDrift_40s_linear_infinite]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 210, 255, 0.3) 1px, transparent 1px), 
            linear-gradient(90deg, rgba(0, 210, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
        }}
      />

      {/* 2. SUBTLE SLOWER MAJOR GRID AXIS (EXISTING) */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none animate-[gridDrift_80s_linear_infinite_reverse]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 210, 255, 0.6) 2px, transparent 2px), 
            linear-gradient(90deg, rgba(0, 210, 255, 0.6) 2px, transparent 2px)
          `,
          backgroundSize: '160px 160px',
        }}
      />

      {/* NEW LAYER A: PRIMARY DRAWING GRID (FAST DRIFT) */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none animate-[gridMove_25s_linear_infinite]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 210, 255, 0.25) 1px, transparent 1px), 
            linear-gradient(90deg, rgba(0, 210, 255, 0.25) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      />

      {/* NEW LAYER B: HEAVY ARCHITECTURAL GRID (SLOW COUNTER-DRIFT) */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none animate-[gridMove_60s_linear_infinite_reverse]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 210, 255, 0.6) 2px, transparent 2px), 
            linear-gradient(90deg, rgba(0, 210, 255, 0.6) 2px, transparent 2px)
          `,
          backgroundSize: '120px 120px',
        }}
      />

      {/* NEW LAYER C: INTERACTIVE MOUSE REACTION (RADAR DEPTH FIELD) */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-screen hidden md:block transition-opacity duration-300 opacity-30"
        style={{
          background: `radial-gradient(circle 220px at ${mousePos.x}px ${mousePos.y}px, rgba(0, 210, 255, 0.12), transparent 100%)`
        }}
      />

      {/* 3. AMBIENT LIVING COMPONENTS (EXISTING + NEW SCHEMATICS) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-screen opacity-40">

        {/* EXISTING: Floating Rotating Compass/Dial Ring (Top Left) */}
        <div className="absolute -top-20 -left-20 w-96 h-96 border-2 border-dashed border-[#00d2ff]/90 rounded-full animate-[spin_120s_linear_infinite]">
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#00d2ff]/80" />
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#00d2ff]/80" />
          <div className="absolute top-10 left-10 w-4 h-4 border-2 border-[#00d2ff]/90" />
        </div>

        {/* EXISTING: Slow Vertical Scanner Line */}
        <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00d2ff]/30 to-transparent animate-[scanY_12s_ease-in-out_infinite]" />

        {/* EXISTING: Orbiting Concentric Architecture Rings (Bottom Right) */}
        <div className="bp-ambient-rings absolute bottom-24 right-20 w-[520px] h-[520px] flex items-center justify-center animate-[pulse_8s_ease-in-out_infinite]">
          <div className="w-[390px] h-[390px] border-2 border-solid border-[#00d2ff]/80 rounded-full" />
          <div className="absolute w-[300px] h-[300px] border-2 border-dashed border-[#00d2ff]/90 rounded-full animate-[spin_60s_linear_infinite_reverse]" />
          <div className="absolute w-5 h-5 bg-[#00d2ff]/90 rounded-full" />
        </div>

        {/* EXISTING: Shifting Telemetry Readout (Side Banner) */}
        <div className="bp-telemetry absolute right-6 top-24 flex flex-col gap-1 text-[10px] text-[#00d2ff] tracking-widest">
          <div>GRID_SCALE: 1:24_UNIT</div>
          <div>TOLERANCE_BOUNDS: ±0.002mm</div>
        </div>

        {/* NEW: Scanning Sweep Line (Y-Axis Sweep) */}
        <div className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00d2ff]/40 to-transparent shadow-[0_0_10px_rgba(0,210,255,0.5)] animate-[radarScan_14s_ease-in-out_infinite]" />
      </div>

      {/* NEW LAYER E: SCHEMATIC HUD READOUTS (BORDER DETAILS) */}
      <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none text-[10px] text-[#00d2ff]/50 tracking-widest z-20">

        {/* Extreme top-left corner readout */}
        <span className="absolute top-3 left-3 text-[#00d2ff]/60">SYS_LOC // 0x44AA_F2</span>

        {/* Top Header Row Metadata */}
        <div className="w-full flex justify-between items-start border-b border-[#00d2ff]/10 pb-4">
          <div className="flex gap-6 items-center">
            <span className="font-black text-[#00d2ff] animate-pulse">● ENG_CORE_ACTIVE</span>
          </div>
          <div className="text-right hidden sm:flex items-center gap-4 justify-end">
            <span>DRAWING_NO: BLU-HERO-V4.26</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1 bg-[#00d2ff]/10 rounded-full overflow-hidden relative">
                <div className="absolute top-0 bottom-0 left-0 bg-[#00d2ff]/60 animate-[pulse_2s_infinite]" style={{ width: `${(metrics.noise * 40).toFixed(0)}%` }} />
              </div>
              <span className="font-mono text-[8px] text-[#00d2ff]">AMB_NOISE: {metrics.noise} Px</span>
            </div>
          </div>
        </div>

        {/* Bottom Left Floating Coordinates */}
        <div className="bp-axis absolute left-3 bottom-3 flex flex-col gap-1 text-[9px] border-l border-[#00d2ff]/20 pl-2">
          <div>X_AXIS: <span className="text-[#00d2ff]">{mousePos.x.toString().padStart(4, '0')}</span></div>
          <div>Y_AXIS: <span className="text-[#00d2ff]">{mousePos.y.toString().padStart(4, '0')}</span></div>
          <div>SIG_REF: <span className="text-[#00d2ff]">{metrics.tick}HZ</span></div>
        </div>

      </div>

      {/* 4. BUTTON OR APP CANVAS PLACEMENT */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
