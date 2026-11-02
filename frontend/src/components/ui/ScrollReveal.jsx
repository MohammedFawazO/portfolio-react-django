import { useRef, useEffect, useState } from 'react';

export default function ScrollReveal({ text, trackRef, onProgress, apiRef }) {
  const containerRef = useRef(null);
  const progressRef = trackRef || containerRef;
  const [revealedWordCount, setRevealedWordCount] = useState(0);
  const segments = [text];
  const allChars = segments.flatMap(seg => seg.split(''));
  const totalChars = allChars.length;
  const onProgressRef = useRef(onProgress);

  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);

  useEffect(() => {
    let rafId = null;
    let targetProgress = 0;
    let currentProgress = 0;
    let manual = false;

    const smoothScroll = () => {
      const diff = targetProgress - currentProgress;
      currentProgress += diff * 0.12;
      if (Math.abs(targetProgress - currentProgress) > 0.001) {
        setRevealedWordCount(Math.floor(currentProgress * totalChars));
        onProgressRef.current?.(currentProgress, targetProgress);
        rafId = requestAnimationFrame(smoothScroll);
      } else {
        currentProgress = targetProgress;
        setRevealedWordCount(Math.floor(targetProgress * totalChars));
        onProgressRef.current?.(targetProgress, targetProgress);
      }
    };

    const ensureAnimation = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(smoothScroll);
    };

    const handleScroll = () => {
      if (manual || !progressRef.current) return;
      const rect = progressRef.current.getBoundingClientRect();
      const eyeLevel = window.innerHeight * 0.62;
      const start = rect.top + window.scrollY - eyeLevel;
      const end = rect.top + window.scrollY + rect.height - eyeLevel;
      const distance = end - start;
      let progress = (window.scrollY - start) / distance;
      targetProgress = Math.max(0, Math.min(1, progress));
      onProgressRef.current?.(currentProgress, targetProgress);
      ensureAnimation();
    };

    if (apiRef) {
      apiRef.current = {
        setProgress(value) {
          manual = true;
          targetProgress = Math.max(0, Math.min(1, value));
          onProgressRef.current?.(currentProgress, targetProgress);
          ensureAnimation();
        },
        clearProgress() {
          manual = false;
          handleScroll();
        },
      };
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      if (apiRef) apiRef.current = null;
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [totalChars, progressRef, apiRef]);

  let charIndex = 0;
  return (
    <div ref={containerRef} style={trackRef ? undefined : { minHeight: '80vh' }}>
      <p className="text-[15px] leading-[1.7] text-[#555] font-bold sm:text-[18px] md:text-[22px] md:leading-[1.75] text-center whitespace-pre-wrap break-keep">
        {segments.map((segment, sIdx) => {
          return segment.split('').map((char, i) => {
            const idx = charIndex++;
            const revealed = idx < revealedWordCount;
            return (
              <span
                key={`${sIdx}-${i}`}
                className={revealed ? 'text-[#323232]' : 'text-[#888]'}
                style={{ transition: 'all 0.3s ease-out', opacity: revealed ? 1 : 0.65 }}
              >
                {char}
              </span>
            );
          });
        })}
      </p>
    </div>
  );
}
