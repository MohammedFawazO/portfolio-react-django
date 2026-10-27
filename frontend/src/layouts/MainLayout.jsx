import { useEffect, useRef, useContext, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import Footer from '../components/common/Footer'
import WhatsAppButton from '../components/common/WhatsAppButton'
import ConnectButton from '../components/common/ConnectButton'
import DesignModeConnectButton from '../components/common/DesignModeConnectButton'
import SpotlightNavbar from '../components/navigation/SpotlightNavbar'
import DesignModeNavbar from '../components/navigation/DesignModeNavbar'
import EntryIntro from '../components/common/EntryIntro'
import { EntryIntroProvider } from '../context/EntryIntroContext'
import { HeroScrollContext } from '../context/HeroScrollContext'
import { DesignModeProvider, useDesignMode } from '../context/DesignModeContext'

// Projects-only nav visibility. The hero hand-off fades the navbar out and
// then brings it back once the projects grid is in place. That fade follows a
// slow spring, so after a jump straight back to the top the value can still
// read zero while the spring catches up. Watching scrollY directly guarantees
// the navbar is fully visible whenever the page is actually at the top.
function useProjectsNavFade() {
  const heroProgress = useContext(HeroScrollContext)
  const atTop = useMotionValue(1)
  const navFade = useTransform(heroProgress, [0, 0.55, 0.85, 0.98], [1, 1, 0, 1])

  useEffect(() => {
    const update = () => atTop.set(window.scrollY <= 8 ? 1 : 0)
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [atTop])

  return useTransform([navFade, atTop], ([fade, top]) => (top ? 1 : fade))
}

function NavbarSlot() {
  const { designModeActive } = useDesignMode()
  const location = useLocation()
  const isProjects = location.pathname === '/projects'
  const navFade = useProjectsNavFade()

  // The navbar sits above <main> (z-50 vs z-10) and its wrapper spans the full
  // width at the top of the page, so anything pinned to that strip (the hero's
  // blueprint CTA, for one) would be un-clickable behind it. The wrapper is
  // click-through; the navbar and the portaled hamburger turn clicks back on.
  const wrapperClass = isProjects
    ? "z-50 flex justify-center top-0 left-0 right-0 fixed pointer-events-none"
    : "z-50 flex justify-center top-0 left-0 right-0 min-md:absolute max-md:fixed pointer-events-none"
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
            <motion.div style={{ opacity: navFade }} className="flex justify-center pointer-events-auto">
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
  // Same curve as NavbarSlot: hides during the hero transition, returns once
  // the grid settles, and is always visible at the very top of the page.
  const navFade = useProjectsNavFade()

  // Watch the blueprint body class (toggled by About.jsx) so the connect CTA
  // can be pinned to the bottom of the page in blueprint mode only - every
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

  // No CTA on Resume - that page's own hero is the CV shelf, so a second Get
  // Resume button in the corner would just duplicate what the user is already
  // looking at. Contact keeps it: the form is the primary action there, and the
  // CTA is a useful second route for anyone who just wants the CV.
  if (location.pathname === '/resume') return null

  // Blueprint mode renders its own copy of the CTA, pinned to the hero's top
  // right corner inside About.jsx - returning here avoids a duplicate pinned to
  // the viewport.
  if (blueprint) return null

  return (
    <AnimatePresence mode="wait">
      {designModeActive ? (
        <motion.div
          key="design"
          className="absolute right-6 top-10 z-50 pointer-events-none md:right-9 md:top-14"
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
          // Pinned to the top-right of the page on every mode except blueprint,
          // which keeps its copy inside the hero section (see About.jsx).
          // Visible on mobile too, where it pairs with the hamburger: the
          // button sits left, this sits right, both on top-10 and both h-11.
          className={isProjects
            ? "fixed right-6 top-10 z-50"
            : "absolute right-6 top-10 z-50"}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={transition}
        >
          {isProjects ? (
            <motion.div style={{ opacity: navFade }}>
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
  const isAbout = location.pathname === '/about'
  const footerVideoRef = useRef(null)
  const heroProgress = useMotionValue(0)
  const lenisRef = useRef(null)

  // Smooth scrolling for every page. Lenis eases wheel and trackpad input while
  // still using the real document scroll position, so anything reading
  // window.scrollY (navbar fade, hero progress, the projects hand-off) keeps
  // working untouched, and the native scrollbar stays. autoRaf lets Lenis run
  // its own frame loop. Reduced-motion visitors keep the browser's default.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({
      // Longer, softer glide: 1.6s catch-up on a gentle ease-out rather than
      // Lenis' default snappy exponential, and a slightly reduced wheel
      // multiplier so each notch travels less distance before easing out.
      duration: 1.6,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      wheelMultiplier: 0.85,
      smoothWheel: true,
      anchors: true,
      autoRaf: true,
    })
    lenisRef.current = lenis
    return () => {
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  useEffect(() => {
    // A hash means "go to that anchor", so don't reset to the top - let the
    // scroll-to-target effect below handle the landing instead.
    if (location.hash) return
    // Route changes land instantly: hand it to Lenis so it drops any animation
    // in flight rather than snapping back a frame later.
    lenisRef.current?.scrollTo(0, { immediate: true, force: true })
    window.scrollTo(0, 0)
  }, [location.pathname, location.hash])

  // Deep links such as /#home-contact must actually land on their target.
  // react-router does not scroll on a hash change, and nothing else here did,
  // so without this the Home link from the projects CTA would arrive at the top
  // of the page with the form nowhere in sight.
  useEffect(() => {
    if (!location.hash) return
    const id = requestAnimationFrame(() => {
      const target = document.querySelector(location.hash)
      // One frame of delay: the home page animates its sections in, so on the
      // first paint after navigation the target may not be laid out yet.
      if (!target) return
      const lenis = lenisRef.current
      if (lenis) {
        // Same landing spot as block: 'center' below - the target's midpoint
        // sits in the middle of the viewport, whatever its height.
        const offset = -(window.innerHeight - target.offsetHeight) / 2
        lenis.scrollTo(target, { offset, duration: 1.6, force: true })
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    })
    return () => cancelAnimationFrame(id)
  }, [location.pathname, location.hash])

  // The About page owns the hero modes: it sets `about-blueprint-nav` /
  // `about-matrix-nav` / `about-test-nav` on <html> and overrides a couple of
  // root CSS variables, which is how the shared navbar and connect button pick
  // up their theme. About clears them when it unmounts, but pin it down here
  // as well so a mode can never bleed into another route.
  useEffect(() => {
    if (isAbout) return
    const root = document.documentElement
    root.classList.remove('about-blueprint-nav', 'about-matrix-nav', 'about-test-nav')
    root.style.removeProperty('--color-primary-light')
    root.style.removeProperty('--color-primary-light-rgb')
    root.style.removeProperty('--text-secondary')
  }, [isAbout])

  // Route marker on <html>, following the same pattern as the about-*-nav
  // classes: it lets CSS tighten or loosen shared furniture for one route
  // without wrapping it in a per-page element. Replaced on every navigation
  // rather than added, so a stale marker can never outlive its route.
  useEffect(() => {
    const root = document.documentElement
    const slug = location.pathname.replace(/[^\w-]/g, '') || 'home'
    const next = `route-${slug}`
    root.classList.forEach((cls) => {
      if (cls.startsWith('route-')) root.classList.remove(cls)
    })
    root.classList.add(next)
    return () => root.classList.remove(next)
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

            <main className="page-shell relative z-10 grow">
              <Outlet />
            </main>

            <Footer />

            {/* Direct WhatsApp CTA. Lives here rather than in a page so every
                route inherits it. */}
            <WhatsAppButton />
          </div>
        </HeroScrollContext.Provider>
      </DesignModeProvider>
    </EntryIntroProvider>
  )
}

export default MainLayout
