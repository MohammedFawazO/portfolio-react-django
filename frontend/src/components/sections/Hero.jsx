import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import TechMarquee from '../ui/TechMarquee'
import { GenerateButton } from '../ui/GenerateButton'
import { KineticTextReveal } from '../ui/KineticTextReveal'
import SpotlightNavbar from '../navigation/SpotlightNavbar'
import { useEntryIntro } from '../../context/EntryIntroContext'

const fadeUp = {
  hidden: { y: 40, opacity: 0 },
  visible: (delay) => ({
    y: 0,
    opacity: 1,
    transition: {
      duration: 1,
      delay,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
}

function Hero() {
  const [showConnect, setShowConnect] = useState(false)
  const { introDone } = useEntryIntro()
  const reveal = introDone
  const heroVideoRef = useRef(null)
  const [contentReveal, setContentReveal] = useState(false)

  useEffect(() => {
    const video = heroVideoRef.current
    if (!video) return
    if (contentReveal) {
      video.currentTime = 0
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [contentReveal])

  useEffect(() => {
    const timer = setTimeout(() => setShowConnect(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative h-[110vh] w-full bg-[#0A0A0A] overflow-hidden">
    <section className="relative h-[110vh] w-full overflow-hidden">
      <style>{`
        @media (max-width: 1023px) {
          .hero-subtitle {
            margin-left: 0 !important;
            height: auto !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            gap: 4px !important;
          }
          .hero-sub-word {
            position: static !important;
            transform: none !important;
            text-align: center !important;
          }
          .hero-main-inner {
            transform: none !important;
          }
        }
      `}</style>
      <div className="relative h-[110vh] w-full flex flex-col justify-between overflow-hidden">
        {/* Golden Ambient Glow */}
        <div
          className="absolute pointer-events-none z-1"
          style={{
            top: '-10%',
            right: '5%',
            width: '800px',
            height: '800px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(247,223,185,0.18) 0%, transparent 70%)',
          }}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-2"
          style={{
            background: 'radial-gradient(circle, transparent 45%, rgba(0,0,0,0.45) 100%)',
          }}
        />

         {/* Role / Subtitle — fixed position, independent of other content */}
         <div className="absolute left-0 right-0 bottom-0 pointer-events-none z-3 overflow-hidden" style={{ top: '84px' }}>
           <div className="absolute left-0 right-0" style={{ top: 'calc(6vh - 2mm)', transform: 'translate(0.3cm, -0.15cm)' }}>
             <div className="text-center font-[family-name:var(--font-display)] font-bold text-white uppercase tracking-[0.25em] text-[1.7rem] sm:text-[2.6rem] md:text-[3.4rem] lg:text-[4.3rem] leading-none">
               MOHAMMED FAWAZ
             </div>
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={contentReveal ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
               transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="hero-subtitle relative mt-4 h-10 w-full overflow-visible"
               style={{ marginLeft: '-7vw' }}
             >
              <span
                 className="hero-sub-word absolute left-1/2 -translate-x-72 uppercase font-extralight tracking-[0.28em] text-white/35 text-[16px] sm:text-[18px] md:text-[21px] lg:text-[24px] leading-none whitespace-nowrap select-none"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Python Full
              </span>
              <span
                className="hero-sub-word absolute left-1/2 translate-x-45 uppercase font-extralight tracking-[0.28em] text-white/35 text-[16px] sm:text-[18px] md:text-[21px] lg:text-[24px] leading-none whitespace-nowrap select-none"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                 Stack Developer
               </span>
              </motion.div>
              </div>
         </div>

         {/* Video - Center, Below Name */}
        <motion.div
          className="absolute left-0 right-0 bottom-[10vh] flex items-center justify-center pointer-events-none z-4"
          style={{ top: '96px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: contentReveal ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <video
            ref={heroVideoRef}
            className="w-55 sm:w-70 md:w-87.5 lg:w-105 aspect-3/4 object-cover rounded-sm"
            src="/media/hero-video.webm"
            muted
            playsInline
            preload="auto"
          />
        </motion.div>

        {/* Main Content */}
        <div className="absolute inset-x-0 top-0 bottom-[10vh] z-5 flex items-center">
            <div className="hero-main-inner w-full max-w-350 mx-auto px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32" style={{ transform: 'translate(40px, 110px)' }}>
            <div className="max-w-120">
              <motion.div
                initial={{ opacity: 0, y: 20, x: -10 }}
                animate={{ opacity: 1, y: 14, x: -34 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-sm sm:text-[0.95rem] leading-[1.75] mb-8 font-light"
              >
                <div className="text-white/80 font-medium mb-0.5 text-base sm:text-lg">
                  <KineticTextReveal
                    text="Every pixel has a purpose."
                    splitBy="words"
                    direction="up"
                    distance={10}
                    stagger={0.03}
                    delay={0.6}
                    blur={false}
                    autoPlay={contentReveal}
                    segmentClassName="text-white/80 font-medium"
                  />
                </div>
                <div className="text-white/80 font-medium mb-1.5 text-base sm:text-lg">
                  <KineticTextReveal
                    text="Every line of code has a reason."
                    splitBy="words"
                    direction="up"
                    distance={10}
                    stagger={0.03}
                    delay={0.9}
                    blur={false}
                    autoPlay={contentReveal}
                    segmentClassName="text-white/80 font-medium"
                  />
                </div>
                <div className="text-white/45 mt-1">
                  <KineticTextReveal
                    text="I'm Mohammed Fawaz, a Python Full Stack Developer focused on building scalable web applications with clean architecture, thoughtful interfaces, and production-ready code."
                    splitBy="words"
                    direction="up"
                    distance={10}
                    stagger={0.03}
                    delay={1.2}
                    blur={false}
                    autoPlay={contentReveal}
                  />
                </div>
              </motion.div>

              <motion.div
                 initial={{ opacity: 0, y: 20, x: -10 }}
                 animate={contentReveal ? { opacity: 1, y: -80, x: -34 } : { opacity: 0, y: 20, x: -10 }}
                 transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
                 className="flex flex-wrap items-center gap-4"
              >
                <Link to="/projects">
                  <GenerateButton hue={150}>
                    <span className="flex items-center gap-2 group/btn">
                      View Projects
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:translate-x-1.5 group-hover/btn:scale-110 transition-all duration-300">
                        <path d="m9 18 6-6-6-6"/>
                      </svg>
                    </span>
                  </GenerateButton>
                </Link>

                <Link to="/resume" className="resume-link">
                  <style>{`
                    @keyframes bounce-down {
                      0%, 100% { transform: translateY(0); }
                      30% { transform: translateY(6px); }
                      50% { transform: translateY(-2px); }
                      70% { transform: translateY(3px); }
                    }
                    .resume-link:hover .resume-icon {
                      animation: bounce-down 0.6s ease-in-out;
                    }
                  `}</style>
                  <GenerateButton hue={45}>
                    <span className="flex items-center gap-2">
                      Resume
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="resume-icon">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" x2="12" y1="15" y2="3"/>
                      </svg>
                    </span>
                  </GenerateButton>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Tech Marquee - Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={contentReveal ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1.2, delay: 1.3 }}
          className="absolute left-0 right-0 bottom-[10vh] z-[3] translate-y-4"
        >
          <TechMarquee />
        </motion.div>

        {/* Hero → next (light) section fade */}
        <div
          className="pointer-events-none absolute left-0 right-0 bottom-0 z-[4] h-[18vh]"
          style={{ background: 'linear-gradient(to bottom, rgba(245,247,247,0) 0%, rgba(245,247,247,0.05) 22%, rgba(245,247,247,0.18) 44%, rgba(245,247,247,0.45) 66%, rgba(245,247,247,0.78) 85%, #F5F7F7 100%)' }}
        />

      </div>
    </section>

    {/* Curtain reveal : two transform-only panels that retract from the center, compositor-only (no clip-path repaint) */}
    <motion.div
      className="absolute inset-x-0 top-0 h-1/2 bg-[#0A0A0A] z-40 pointer-events-none"
      style={{ transformOrigin: 'top', willChange: 'transform', backfaceVisibility: 'hidden' }}
      initial={{ scaleY: reveal ? 0 : 1 }}
      animate={{ scaleY: reveal ? 0 : 1 }}
      transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
      onAnimationComplete={() => { if (reveal) setContentReveal(true) }}
    />
    <motion.div
      className="absolute inset-x-0 bottom-0 h-1/2 bg-[#0A0A0A] z-40 pointer-events-none"
      style={{ transformOrigin: 'bottom', willChange: 'transform', backfaceVisibility: 'hidden' }}
      initial={{ scaleY: reveal ? 0 : 1 }}
      animate={{ scaleY: reveal ? 0 : 1 }}
      transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
    />
    </div>
  )
}

export default Hero
