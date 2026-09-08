export default function TestBugOverlay() {
  return (
    <div className="absolute inset-0 z-[80] pointer-events-none overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#D2042D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="bug-walker" style={{ filter: 'drop-shadow(0 0 8px rgba(255,59,71,0.6))' }}>
          <style>{`
            @keyframes walk {
              0% { transform: translate(40vw, 40vh) rotate(-45deg); }
              10% { transform: translate(5vw, 5vh) rotate(-45deg); }
              12% { transform: translate(5vw, 5vh) rotate(-30deg); }
              14% { transform: translate(5vw, 5vh) rotate(-45deg); }
              25% { transform: translate(-40vw, -40vh) rotate(-45deg); }
              26% { transform: translate(-40vw, -40vh) rotate(-30deg); }
              27% { transform: translate(-40vw, -40vh) rotate(-45deg); }
              28% { transform: translate(-60vw, -60vh) rotate(-45deg); }
              29% { transform: translate(-80vw, -80vh) rotate(-45deg); }
              30% { transform: translate(-100vw, -100vh) rotate(-45deg); }
              30.01% { transform: translate(-40vw, -40vh) rotate(135deg); }
              42% { transform: translate(-5vw, 5vh) rotate(135deg); }
              44% { transform: translate(-5vw, 5vh) rotate(120deg); }
              46% { transform: translate(-5vw, 5vh) rotate(135deg); }
              57% { transform: translate(40vw, 40vh) rotate(135deg); }
              59% { transform: translate(40vw, 40vh) rotate(120deg); }
              60% { transform: translate(40vw, 40vh) rotate(135deg); }
              61% { transform: translate(60vw, 60vh) rotate(135deg); }
              63% { transform: translate(80vw, 80vh) rotate(135deg); }
              65% { transform: translate(100vw, 100vh) rotate(135deg); }
              65.01% { transform: translate(40vw, -40vh) rotate(225deg); }
              74% { transform: translate(5vw, 5vh) rotate(225deg); }
              76% { transform: translate(5vw, 5vh) rotate(210deg); }
              78% { transform: translate(5vw, 5vh) rotate(225deg); }
              89% { transform: translate(-40vw, 40vh) rotate(225deg); }
              91% { transform: translate(-40vw, 40vh) rotate(210deg); }
              92% { transform: translate(-40vw, 40vh) rotate(225deg); }
              93% { transform: translate(-60vw, 60vh) rotate(225deg); }
              94% { transform: translate(-80vw, 80vh) rotate(225deg); }
              96% { transform: translate(-100vw, 100vh) rotate(225deg); }
              96.01% { transform: translate(40vw, 40vh) rotate(-45deg); }
              100% { transform: translate(40vw, 40vh) rotate(-45deg); }
            }
            @keyframes wl1 { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-10deg); } }
            @keyframes wl2 { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(10deg); } }
            @keyframes wl3 { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-10deg); } }
            @keyframes wl4 { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(10deg); } }
            @keyframes wl5 { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-10deg); } }
            @keyframes wl6 { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(10deg); } }
            @keyframes ant1 { 0%,40%,100% { transform: rotate(0deg); } 50% { transform: rotate(-6deg); } }
            @keyframes ant2 { 0%,40%,100% { transform: rotate(0deg); } 50% { transform: rotate(6deg); } }
            .bug-walker { animation: walk 40s linear infinite; }
            .wl1 { animation: wl1 0.6s ease-in-out infinite; transform-origin: 12px 12px; } .wl2 { animation: wl2 0.6s ease-in-out infinite; transform-origin: 12px 12px; } .wl3 { animation: wl3 0.6s ease-in-out infinite 0.1s; transform-origin: 12px 12px; } .wl4 { animation: wl4 0.6s ease-in-out infinite 0.1s; transform-origin: 12px 12px; } .wl5 { animation: wl5 0.6s ease-in-out infinite 0.2s; transform-origin: 12px 12px; } .wl6 { animation: wl6 0.6s ease-in-out infinite 0.2s; transform-origin: 12px 12px; } .ant1 { animation: ant1 3s ease-in-out infinite; transform-origin: 12px 12px; } .ant2 { animation: ant2 3s ease-in-out infinite; }
          `}</style>
          <path d="M12 20v-9"/>
          <path d="M14 7a4 4 0 0 1 4 4v3a6 6 0 0 1-12 0v-3a4 4 0 0 1 4-4z"/>
          <path className="ant1" d="M14.12 3.88 16 2"/>
          <path className="wl1" d="M21 21a4 4 0 0 0-3.81-4"/>
          <path className="wl2" d="M21 5a4 4 0 0 1-3.55 3.97"/>
          <path d="M22 13h-4"/>
          <path className="wl3" d="M3 21a4 4 0 0 1 3.81-4"/>
          <path className="wl4" d="M3 5a4 4 0 0 0 3.55 3.97"/>
          <path d="M6 13H2"/>
          <path className="ant2" d="m8 2 1.88 1.88"/>
          <path d="M9 7.13V6a3 3 0 1 1 6 0v1.13"/>
        </svg>
      </div>
    </div>
  )
}
