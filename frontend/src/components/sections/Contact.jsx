import ContactForm from '../common/ContactForm'
import { profile } from '../../data/content'
import Container from '../ui/Container'

function Contact() {
  return (
    <section id="home-contact" className="relative py-[7rem] md:py-[9rem] bg-white overflow-hidden">
      {/* Teal → dark gradient wash */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(120% 80% at 50% 0%, rgba(173,216,230,0.35) 0%, rgba(255,255,255,1) 55%)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '-20%',
          right: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(173,216,230,0.10) 0%, transparent 70%)',
        }}
      />

      <Container size="lg">
        {/* No base grid-cols-1: styles/utilities.css redefines it unlayered, which
            outranks Tailwind's lg:grid-cols-2 and pinned this to one column at
            every width. A bare .grid is already a single column. */}
        <div className="relative grid items-center gap-10 sm:gap-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-[40px] md:text-[60px] leading-[1.02] font-semibold text-black tracking-tight mb-6">
              The next project
              <br />
              starts here.
            </h2>
            <p className="text-[17px] text-[#666] font-light leading-relaxed max-w-md mb-10">
              Have a project in mind, or just want to talk through an idea? I'm currently looking
              for full-time work, and open to freelance : let's build something that works.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[#323232]">
                <span className="w-9 h-9 rounded-full bg-beige border-2 border-black flex items-center justify-center text-[#2d8cf0]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <a href={`mailto:${profile.email}`} className="hover:text-[#2d8cf0] transition-colors">{profile.email}
                </a>
              </div>
              <div className="flex items-center gap-3 text-[#323232]">
                <span className="w-9 h-9 rounded-full bg-beige border-2 border-black flex items-center justify-center text-[#2d8cf0]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <span>Dubai, UAE</span>
              </div>
            </div>
          </div>

          <div className="ct-card">
            <ContactForm />
          </div>
        </div>
      </Container>
    </section>
  )
}

export default Contact
