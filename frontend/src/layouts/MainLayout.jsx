import { useEffect, useRef, useContext, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import Footer from '../components/common/Footer'
import ConnectButton from '../components/common/ConnectButton'
import DesignModeConnectButton from '../components/common/DesignModeConnectButton'
import SpotlightNavbar from '../components/navigation/SpotlightNavbar'
import DesignModeNavbar from '../components/navigation/DesignModeNavbar'
import EntryIntro from '../components/common/EntryIntro'
import { EntryIntroProvider } from '../context/EntryIntroContext'
import { HeroScrollContext } from '../context/HeroScrollContext'
import { DesignModeProvider, useDesignMode } from '../context/DesignModeContext'

function NavbarSlot() {
  const { designModeActive } = useDesignMode()
  const location = useLocation()
  const isProjects = location.pathname === '/projects'
  const heroProgress = useContext(HeroScrollContext)
  const navFade = useTransform(heroProgress, [0, 0.55, 0.85], [1, 1, 0])
  const navSlide = useTransform(heroProgress, [0, 0.55, 0.85], [0, 0, 0])

  const wrapperClass = isProjects
    ? "z-50 flex justify-center top-0 left-0 right-0 fixed"
    : "z-50 flex justify-center top-0 left-0 right-0 min-md:absolute max-md:fixed"
  const transition = { duration: 0.4, ease: 'easeInOut' }

  return (
    <AnimatePresence mode="wait">
      {designModeActive ? (
        <motion.div
          key="design-nav"
          className={wrapperClass}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={transition}
        >
          <DesignModeNavbar />
        </motion.div>
      ) : (
        <motion.div
          key="default-nav"
          className={wrapperClass}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={transition}
        >
          {isProjects ? (
            <motion.div style={{ opacity: navFade, y: navSlide }} className="flex justify-center">
              <SpotlightNavbar animationKey="static" />
            </motion.div>
          ) : (
            <SpotlightNavbar animationKey="static" />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ConnectSlot() {
  const { designModeActive } = useDesignMode()
  const location = useLocation()
  const isProjects = location.pathname === '/projects'
  const heroProgress = useContext(HeroScrollContext)
  const navFade = useTransform(heroProgress, [0, 0.55, 0.85], [1, 1, 0])
  const navSlide = useTransform(heroProgress, [0, 0.55, 0.85], [0, 0, 0])

  // Watch the blueprint body class (toggled by About.jsx) so the connect CTA
  // can be pinned to the bottom of the page in blueprint mode only — every
  // other mode keeps its top-right placement untouched.
  const [blueprint, setBlueprint] = useState(false)
  useEffect(() => {
    const root = document.documentElement
    const update = () => setBlueprint(root.classList.contains('about-blueprint-nav'))
    update()
    const mo = new MutationObserver(update)
    mo.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => mo.disconnect()
  }, [])

  const transition = { duration: 0.4, ease: 'easeInOut' }

  if (location.pathname === '/contact') return null

  return (
    <AnimatePresence mode="wait">
      {designModeActive ? (
        <motion.div
          key="design"
          className="absolute right-9 top-14 z-50 pointer-events-none max-md:hidden"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={transition}
        >
          <DesignModeConnectButton />
        </motion.div>
      ) : (
        <motion.div
          key="default-connect"
          // Blueprint mode: pinned to the top-right of the hero section, with a high
          // z-index (z-70) so it stays above the about-photo-group (z-60) and
          // remains clickable. The wrapper uses pointer-events-none so it
          // never blocks the hero photo's hover animations — only the
          // actual button (pointer-events-auto) is clickable.
          className={blueprint
            ? "fixed right-6 top-6 z-100 pointer-events-none max-md:hidden"
            : isProjects
              ? "fixed right-6 top-10 z-50 max-md:hidden"
              : "absolute right-6 top-10 z-50 max-md:hidden"}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={transition}
        >
          {isProjects ? (
            <motion.div style={{ opacity: navFade, y: navSlide }}>
              <ConnectButton />
            </motion.div>
          ) : (
            <ConnectButton />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function MainLayout() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isProjects = location.pathname === '/projects'
  const footerVideoRef = useRef(null)
  const heroProgress = useMotionValue(0)
  const navFade = useTransform(heroProgress, [0, 0.55, 0.85], [1, 1, 0])
  const navSlide = useTransform(heroProgress, [0, 0.55, 0.85], [0, 0, -24])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    const v = footerVideoRef.current
    if (!v) return
    if (isHome) v.pause()
    else v.play().catch(() => {})
  }, [isHome])

  return (
    <EntryIntroProvider>
      <DesignModeProvider>
        <HeroScrollContext.Provider value={heroProgress}>
          <div className="relative min-h-screen flex flex-col bg-[#07090B]">
            <video
              ref={footerVideoRef}
              className="fixed inset-0 w-full h-full object-cover z-0"
              autoPlay
              loop
              muted
              playsInline
              src="/media/footer.mp4"
            />

            <NavbarSlot />

            <EntryIntro />

            <ConnectSlot />

            <main className="relative z-10 grow">
              <Outlet />
            </main>

            <Footer />
          </div>
        </HeroScrollContext.Provider>
      </DesignModeProvider>
    </EntryIntroProvider>
  )
}

export default MainLayout
