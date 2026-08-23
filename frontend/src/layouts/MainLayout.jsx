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
  const navSlide = useTransform(heroProgress, [0, 0.55, 0.85], [0, 0, -24])

  const wrapperClass = isProjects
    ? "z-50 flex justify-center fixed top-0 left-0 right-0"
    : "z-50 flex justify-center absolute top-0 left-0 right-0"
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
  const navSlide = useTransform(heroProgress, [0, 0.55, 0.85], [0, 0, -24])

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
          className="absolute right-9 top-14 z-50 pointer-events-none"
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
          // Blueprint mode: bottom-right, low z-index, wrapper ignores pointer
          // events so it never blocks the hero photo's hover animations. Only
          // the actual button (pointer-events-auto) is clickable.
          className={blueprint
            ? "fixed right-6 top-6 z-30 pointer-events-none"
            : isProjects
              ? "fixed right-6 top-10 z-50"
              : "absolute right-6 top-10 z-50"}
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
