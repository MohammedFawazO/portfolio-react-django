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
  const computeViews = (w) => {
    if (typeof window === 'undefined') return { mobile: false, tablet: false }
    const coarse =
      window.matchMedia && window.matchMedia('(pointer: coarse)').matches
    const mobile = w < 768
    const tablet = (w >= 768 && w < 1200) || (w >= 1024 && w <= 1366 && coarse)
    return { mobile, tablet }
  }

  const [isMobileView, setIsMobileView] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )
  const [isTabletView, setIsTabletView] = useState(
    typeof window !== 'undefined' ? computeViews(window.innerWidth).tablet : false
  )
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  )

  const tabletNameSize = viewportWidth < 1240 ? '2.4vw' : '3vw'
  const tabletLandscape = typeof window !== 'undefined' && window.innerWidth > window.innerHeight

  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth
      const { mobile, tablet } = computeViews(w)
      setIsMobileView(mobile)
      setIsTabletView(tablet)
      setViewportWidth(w)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

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
    <div className="relative hero-root h-[100dvh] md:h-[110vh] w-full bg-[#0A0A0A] overflow-hidden">
    <section className="relative hero-section h-[100dvh] md:h-[110vh] w-full overflow-hidden">
      <style>{`
        /* Default (mobile) : the two words sit on a single centered line */
        .hero-subtitle {
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          align-items: center !important;
          gap: 4px !important;
        }
        @media (max-width: 1023px) {
          .hero-main-inner {
            transform: none !important;
          }
        }

        /* Tablet (iPad Air / Galaxy Tab, 768px-1199px) : reuse the desktop layout,
           but make every component scale with the viewport so nothing overflows. */
        @media (min-width: 768px) and (max-width: 1199px) {
          .hero-name {
            font-size: clamp(2rem, 5vw, 3.6rem) !important;
          }
          .hero-subtitle {
            display: block !important;
            height: 40px !important;
          }
          .hero-sub-word-1 {
            position: absolute;
            left: 45% !important;
            transform: translateX(-19vw) !important;
          }
          .hero-sub-word-2 {
            position: absolute;
            left: 45% !important;
            transform: translateX(15vw) !important;
          }
          .hero-video-wrap video {
            width: clamp(200px, 30vw, 380px) !important;
          }
          .hero-main-inner {
            transform: translate(2vw, 9vh) !important;
          }
          .hero-root, .hero-section {
            height: 100dvh !important;
          }
        }
        /* Desktop only : recreate the original spread-out absolute layout */
        @media (min-width: 1024px) {
          .hero-subtitle {
            display: block !important;
            height: 40px !important;
          }
          .hero-sub-word-1 {
            position: absolute;
            left: 50%;
            transform: translateX(-18rem);
          }
          .hero-sub-word-2 {
            position: absolute;
            left: 50%;
            transform: translateX(11.25rem);
          }
        }
        @media (max-width: 767px) {
          .hero-role-block {
            transform: translateY(-3vh) !important;
            z-index: 6 !important;
          }
          .hero-video-wrap {
            top: calc(84px + 6vh - 2mm + 11vw) !important;
            transform: translateY(-3vh) !important;
            align-items: flex-start !important;
          }
          .hero-video-wrap video {
            transform: scale(1.3);
            transform-origin: center;
          }
          .hero-name {
            font-size: 5.8vw !important;
            letter-spacing: 0.08em !important;
            white-space: nowrap !important;
            max-width: 100% !important;
          }
          .hero-subtitle {
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            gap: 1.8vw !important;
            margin-left: 0 !important;
          }
          .hero-sub-word {
            font-size: 3.2vw !important;
            letter-spacing: 0.08em !important;
            white-space: nowrap !important;
          }
          /* Short / landscape phones : keep the (scaled) video clear of the subtitle */
          @media (max-height: 520px) {
            .hero-video-wrap {
              top: calc(84px + 6vh - 2mm + 11vw) !important;
            }
            .hero-video-wrap video {
              transform: scale(0.85);
            }
          }
        }
      `}</style>
        <div className="relative h-[100dvh] md:h-[110vh] w-full flex flex-col justify-between overflow-hidden">
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

         {/* Role / Subtitle - fixed position, independent of other content */}
         {!isMobileView && (
         <div className="absolute left-0 right-0 bottom-0 pointer-events-none z-3 overflow-hidden" style={{ top: '84px' }}>
            <div className="absolute left-0 right-0 hero-role-block" style={{ top: 'calc(6vh - 2mm)', transform: 'translate(0.3cm, -0.15cm)' }}>
              <div className="text-center font-[family-name:var(--font-display)] font-bold text-white uppercase tracking-[0.25em] text-[1.7rem] sm:text-[2.6rem] md:text-[3.4rem] lg:text-[4.3rem] leading-none hero-name">
                MOHAMMED FAWAZ
              </div>
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={contentReveal ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
               transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                 className="hero-subtitle relative mt-1 h-10 w-full overflow-visible"
               style={{ marginLeft: '-7vw' }}
             >
               <span
                  className="hero-sub-word hero-sub-word-1 uppercase font-extralight tracking-[0.28em] text-white/35 text-[16px] sm:text-[18px] md:text-[21px] lg:text-[24px] leading-none whitespace-nowrap select-none"
                 style={{ fontFamily: 'var(--font-display)' }}
               >
                 Python Full
               </span>
               <span
                 className="hero-sub-word hero-sub-word-2 uppercase font-extralight tracking-[0.28em] text-white/35 text-[16px] sm:text-[18px] md:text-[21px] lg:text-[24px] leading-none whitespace-nowrap select-none"
                 style={{ fontFamily: 'var(--font-display)' }}
               >
                 Stack Developer
                </span>
              </motion.div>
               </div>
          </div>
          )}

          {/* Video - Center, Below Name */}
        {!isMobileView && (
        <motion.div
          className="absolute left-0 right-0 bottom-[10vh] flex items-center justify-center pointer-events-none z-4 hero-video-wrap"
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
          )}

         {/* Main Content */}
        <div className="absolute inset-x-0 top-0 bottom-[10vh] z-5 flex items-center">
            <div className="hero-main-inner w-full max-w-350 mx-auto px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32" style={{ transform: 'translate(40px, 110px)' }}>
            <div className="max-w-120">
               {!isMobileView && (
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
              )}

               {!isMobileView && (
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
              )}
             </div>
           </div>
        </div>

        {/* Mobile-only stacked layout: name → subtitle → video → description → buttons.
            Rendered only via JS isMobileView and laid out as a flex column so the
            items can never overlap. The flexible video width (vw based) keeps the
            whole stack within the viewport on any mobile screen. */}
        {isMobileView && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: contentReveal ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="md:hidden absolute inset-0 z-[6] flex flex-col items-center justify-start px-6 text-center pt-[10vh] pb-[12vh]"
          style={{ gap: '0' }}
        >
          <div>
            <div className="text-center font-[family-name:var(--font-display)] font-bold text-white uppercase tracking-[0.25em] leading-none hero-name">
              MOHAMMED FAWAZ
            </div>
            <div className="hero-subtitle relative mt-1 h-10 w-full overflow-visible" style={{ marginLeft: 0 }}>
              <span
                className="hero-sub-word hero-sub-word-1 uppercase font-extralight tracking-[0.28em] text-white/35 leading-none whitespace-nowrap select-none"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Python Full
              </span>
              <span
                className="hero-sub-word hero-sub-word-2 uppercase font-extralight tracking-[0.28em] text-white/35 leading-none whitespace-nowrap select-none"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Stack Developer
              </span>
            </div>
          </div>

          <div className="w-[70vw] max-w-[480px] -mt-[7vh]">
            <video
              className="w-full aspect-3/4 object-cover rounded-sm"
              src="/media/hero-video.webm"
              autoPlay
              muted
              playsInline
              preload="auto"
            />
          </div>

          <div className="leading-[1.75] font-light text-[3.1vw] -mt-[3vh] text-left">
            <div className="text-white/80 font-medium mb-0.5 text-[4.2vw] text-left">
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
            <div className="text-white/80 font-medium mb-1.5 text-[4.2vw] text-left">
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
            <div className="text-white/45 mt-1 text-[2.9vw]">
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
          </div>

          <div className="flex flex-row items-center justify-center gap-4 mt-[2vh]">
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
          </div>
        </motion.div>
        )}

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
