// Shared brand/social glyphs. Stroke-based so they sit alongside the existing
// footer icons and the outline language used elsewhere in the app. Sizes are
// overridable via className; anything else is forwarded to the <svg>.
const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
}

const GithubIcon = ({ className = 'h-5 w-5', ...props }) => (
  <svg {...base} className={className} {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

const LinkedinIcon = ({ className = 'h-5 w-5', ...props }) => (
  <svg {...base} className={className} {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const WhatsappIcon = ({ className = 'h-5 w-5', ...props }) => (
  <svg {...base} className={className} {...props} viewBox="0 0 24 24">
    <path d="M21 11.5a8.38 8.38 0 0 1-12.6 7.3L3 21l2.3-5.2A8.38 8.38 0 1 1 21 11.5z" />
    <path d="M8.6 9.3c.2-.5.4-.5.6-.5h.5c.2 0 .4 0 .6.5l.7 1.6c.1.2.1.4 0 .6l-.4.5c-.1.2-.2.3-.1.5a6 6 0 0 0 2.8 2.4c.2.1.4 0 .5-.1l.6-.7c.2-.2.3-.2.5-.1l1.6.8c.2.1.3.3.2.5-.1.6-.6 1.2-1.2 1.3-.4.1-1.7.2-4.3-1.4a8.6 8.6 0 0 1-3.3-4.6c-.2-.8 0-1.6.4-2.3z" />
  </svg>
)

const InstagramIcon = ({ className = 'h-5 w-5', ...props }) => (
  <svg {...base} className={className} {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
)

const EmailIcon = ({ className = 'h-5 w-5', ...props }) => (
  <svg {...base} className={className} {...props}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

// Keyed by the `icon` field on entries in data/content.js -> socials.
const socialIconMap = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  whatsapp: WhatsappIcon,
  instagram: InstagramIcon,
  email: EmailIcon,
}

// Lookup stays internal so this module only exports components.
function SocialIcon({ name, className = 'h-5 w-5' }) {
  const Icon = socialIconMap[name]
  if (!Icon) return null
  return <Icon className={className} />
}

export { GithubIcon, LinkedinIcon, WhatsappIcon, InstagramIcon, EmailIcon, SocialIcon }