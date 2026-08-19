import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/utils'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact', href: '/contact' },
]

function FloatingNavbar({ className }) {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (href) => location.pathname === href

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 flex justify-center px-6 pt-6',
        className
      )}
    >
      <nav
        className={cn(
          'flex items-center gap-1 rounded-full px-2 py-2 transition-all duration-500',
          'border border-white/[0.08] backdrop-blur-xl',
          scrolled
            ? 'bg-black/60 shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
            : 'bg-white/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.2)]'
        )}
      >
        {/* Divider */}
        <div className="w-px h-5 bg-white/10 mx-1" />

        {/* Nav Links */}
        <div className="flex items-center gap-0.5">
          {navItems.map((item, index) => (
            <Link
              key={item.href}
              to={item.href}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={cn(
                'relative px-4 py-2 text-sm rounded-full transition-colors duration-300',
                isActive(item.href)
                  ? 'text-white'
                  : 'text-white/50 hover:text-white/80'
              )}
            >
              {hoveredIndex === index && (
                <motion.div
                  layoutId="nav-hover"
                  className="absolute inset-0 bg-white/[0.06] rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              {isActive(item.href) && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0 bg-white/[0.1] rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-white/10 mx-1" />

        {/* Resume Button */}
        <Link
          to="/resume"
          className={cn(
            'px-5 py-2 text-sm rounded-full transition-all duration-300',
            'border border-white/20 text-white/80 hover:text-white',
            'hover:bg-white/[0.08] hover:border-white/30',
            'hover:shadow-[0_0_20px_rgba(247,223,185,0.1)]',
            isActive('/resume') && 'bg-white/[0.1] border-white/30 text-white'
          )}
        >
          Resume
        </Link>
      </nav>
    </motion.div>
  )
}

export default FloatingNavbar
