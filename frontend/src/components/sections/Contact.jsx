import ContactForm from '../common/ContactForm'
import Card from '../ui/Card'
import Container from '../ui/Container'
import { SocialIcon } from '../ui/SocialIcons'
import { profile, socials } from '../../data/content'

const ArrowOut = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={`h-4 w-4 shrink-0 ${className}`}>
    <path d="M7 17 17 7" />
    <path d="M9 7h8v8" />
  </svg>
)

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4 shrink-0">
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
  </svg>
)

function Contact() {
  return (
    <section id="home-contact" className="page-tail-fade relative min-h-screen overflow-hidden bg-[#F5F5DC] pb-24 pt-24 sm:pb-28 sm:pt-28 md:pb-40 md:pt-32">
      <Container size="lg" className="max-md:px-4!">
        <div className="mb-14 text-center sm:mb-20 md:mb-28">
          <p className="mb-4 font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.28em] text-[#236966]">
            Contact
          </p>
          <h2 className="mx-auto max-w-[16ch] font-[family-name:var(--font-display)] text-[clamp(34px,10.5vw,60px)] font-semibold leading-[1.02] tracking-[-0.02em] text-black md:text-[clamp(46px,8.2vw,104px)]">
            Let&rsquo;s build something together.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[16px] font-light leading-relaxed text-[#666] sm:mt-7 sm:text-[17px] md:text-[18px]">
            I&rsquo;m currently looking for a full-time role, and open to freelance work. Have an idea? Let&rsquo;s talk.
          </p>
        </div>

        <div className="grid items-start gap-10 sm:gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20">
          <div className="space-y-8 sm:space-y-10 lg:space-y-12">
            <div className="grid gap-3 sm:gap-4! sm:grid-cols-2 lg:grid-cols-1">
              <div className="ct-panel flex flex-col items-start gap-1 px-5 py-4 sm:flex-row! sm:items-center! sm:justify-between sm:gap-6! sm:px-6">
                <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[#666]">Availability</span>
                <span className="text-[15px] font-semibold text-[#323232] sm:text-right">Looking for full-time, open to freelance</span>
              </div>
              <div className="ct-panel flex flex-col items-start gap-1 px-5 py-4 sm:flex-row! sm:items-center! sm:justify-between sm:gap-6! sm:px-6">
                <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[#666]">Response time</span>
                <span className="text-[15px] font-semibold text-[#323232] sm:text-right">Within 24-48 hours</span>
              </div>
              <div className="ct-panel flex flex-col items-start gap-1 px-5 py-4 sm:flex-row! sm:items-center! sm:justify-between sm:gap-6! sm:px-6">
                <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[#666]">Location</span>
                <span className="text-[15px] font-semibold text-[#323232] sm:text-right">Fujairah, UAE</span>
              </div>
            </div>

            <div className="ct-panel flex items-center justify-between gap-3 px-5 py-5 sm:gap-4 sm:px-6">
              <a
                href={`mailto:${profile.email}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Email ${profile.email}`}
                className="min-w-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2d8cf0]"
              >
                <span className="mb-2 block font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[#666]">Email address</span>
                <span className="flex items-center gap-2">
                  <span className="block break-words text-[16px] font-semibold text-[#323232] sm:text-[19px]">{profile.email}</span>
                  <ArrowOut className="text-[#2d8cf0]" />
                </span>
              </a>
              <button
                type="button"
                aria-label="Copy email address"
                title="Copy email address"
                className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#323232]/80 transition-colors duration-150 hover:text-black"
              >
                <CopyIcon />
              </button>
            </div>

            <div>
              <span className="mb-4 block font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[#666]">Find me online</span>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {socials.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    title={social.name}
                    className="ct-chip ct-chip-round"
                  >
                    <SocialIcon name={social.icon} className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <Card variant="teal" padding="none" className="ct-card p-4! sm:p-5!">
            <ContactForm />
          </Card>
        </div>
      </Container>
    </section>
  )
}

export default Contact
