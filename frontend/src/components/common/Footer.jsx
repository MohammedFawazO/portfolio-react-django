import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { composeUrl, copyEmail } from '../../lib/mail'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact', href: '/contact' },
  { label: 'Resume', href: '/resume' },
]

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/MohammedFawazO', icon: 'github' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mohammed-fawaz-o-176695306', icon: 'linkedin' },
  { label: 'Email', href: composeUrl(), icon: 'email' },
  { label: 'WhatsApp', href: 'https://wa.me/971541413726', icon: 'whatsapp' },
]

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const EmailIcon = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const WhatsappIcon = (props) => (
  <svg viewBox="-2 -2 28 28" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

const icons = { github: GithubIcon, linkedin: LinkedinIcon, email: EmailIcon, whatsapp: WhatsappIcon }

const SectionHeading = ({ children }) => (
      <h4 className="text-xl uppercase tracking-[0.2em] text-white/90 font-bold mb-5 footer-heading">
    {children}
  </h4>
)

function Footer() {
  return (
    // same gutters as Container (px-6 sm:px-10 lg:px-14 2xl:px-20) so the footer
  // lines up with the page content instead of hanging closer to the edge.
  // The mobile override is `!`-suffixed because styles/utilities.css redefines
  // .px-6 unlayered, which outranks any plain Tailwind max-md: variant.
  // footer-shell: this wrapper is the real top of the footer area, not the
  // <footer> inside it. min-h-[120vh] + justify-end leaves the video band above
  // the footer box, so anything positioning itself against the footer element
  // alone starts a full viewport too late. Named so the CTA can measure it.
  <div className="footer-shell max-w-7xl mx-auto w-full px-6 max-md:px-3! sm:px-10 lg:px-14 2xl:px-20 mt-32 md:mt-64 min-h-[120vh] relative flex flex-col justify-end">
      <motion.footer
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
        className="liquid-glass relative z-10 w-full rounded-3xl px-5 py-10 md:px-8 md:py-12 text-white/70 flex flex-col !overflow-visible footer-responsive"
      >
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="group !overflow-visible !absolute bottom-8 right-5 top-auto z-20 md:bottom-auto md:top-10 md:right-6 liquid-glass w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:scale-105 transition-all duration-300 footer-top-btn"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none">
            <path d="m18 15-6-6-6 6" />
          </svg>
          <span className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/80 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 md:top-auto md:-bottom-9 md:hidden">
            Back to top
          </span>
        </button>

        {/* Top branding area */}
        <div className="mb-2">
          <div className="flex items-center gap-4 footer-brand-row">
            <div
              aria-hidden="true"
              className="liquid-glass w-12 h-12 shrink-0 rounded-xl flex items-center justify-center text-white"
            >
              {/* Hand-drawn MF monogram. The viewBox is cropped to the ink so
                  the mark fills the badge instead of floating in empty space. */}
              <svg
                viewBox="260 295 430 470"
                width="27"
                height="29"
                fill="none"
                stroke="currentColor"
                strokeWidth="44"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M300 565L322 365Q326 335 356 335L410 335Q438 335 435 365L413 565" />
                <path d="M413 565L435 365Q439 335 468 335L520 335Q548 335 545 365L537 425" />
                <path d="M467 720L489 520Q493 490 523 490L645 490" />
                <path d="M510 585L615 585" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-2xl sm:text-3xl md:text-4xl font-medium leading-none text-white" style={{ fontFamily: 'Roxta', letterSpacing: '0.02em' }}>
                <span className="md:hidden">Mohammed Fawaz O</span>
                <span className="hidden md:inline">Fawaz O</span>
              </p>
              <p className="text-base text-white/50 mt-1.5">Python Full Stack Developer</p>
            </div>
          </div>
            <p className="text-base text-white/60 mt-5 max-w-sm leading-relaxed footer-desc">
            I'm currently looking for full-time work, and open to freelance, where I can build reliable, production-ready web applications.
          </p>
        </div>

        {/* Two-column content area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 mt-2">
          {/* Column 1 : Navigation */}
          <div className="order-1 md:order-none md:justify-self-end">
            <SectionHeading>Navigation</SectionHeading>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm footer-nav">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="group inline-flex items-center gap-1 text-base text-white/70 hover:text-white transition-all duration-200"
                  >
                    <span>{link.label}</span>
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 : Connect */}
          <div className="order-2 md:order-none">
            <SectionHeading>Connect</SectionHeading>
            <div className="flex items-center gap-2 footer-connect">
              {socialLinks.map((social) => {
                const SocialIcon = icons[social.icon]
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    onClick={social.icon === 'email' ? () => copyEmail() : undefined}
                    target={social.href.startsWith('http') ? '_blank' : undefined}
                    rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    aria-label={social.label}
                    className="group w-12 h-12 rounded-full border border-white/15 bg-white/[0.03] flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 hover:bg-white/[0.07] transition-all duration-300"
                  >
                    <SocialIcon />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 footer-bottom">
            <p className="flex flex-col items-center gap-y-1 text-center text-sm text-white/50 md:flex-row md:flex-wrap md:items-center md:gap-x-2 md:text-left">
            <span className="inline-flex items-center gap-2">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/50 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span>Looking for full-time, open to freelance</span>
            </span>
            <span className="hidden text-white/25 md:inline">·</span>
            <span>Based in Fujairah, UAE</span>
          </p>
            <p className="text-xs uppercase tracking-widest text-white/50">
            © 2026 Mohammed Fawaz O
          </p>
        </div>
      </motion.footer>
    </div>
  )
}

export default Footer
