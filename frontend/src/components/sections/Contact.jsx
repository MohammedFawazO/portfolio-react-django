import ContactForm from '../common/ContactForm'
import Container from '../ui/Container'

function Contact() {
  return (
    <section className="relative py-[7rem] md:py-[9rem] bg-[#07090B] overflow-hidden">
      {/* Teal → dark gradient wash */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(120% 80% at 50% 0%, rgba(10,51,50,0.55) 0%, rgba(7,9,11,1) 55%)',
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
          background: 'radial-gradient(circle, rgba(111,231,255,0.06) 0%, transparent 70%)',
        }}
      />

      <Container size="lg">
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-[#6FE7FF]" />
              <span className="text-[11px] font-[family-name:var(--font-mono)] text-[#6FE7FF] uppercase tracking-[0.3em] font-medium">
                Get In Touch
              </span>
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-[40px] md:text-[60px] leading-[1.02] font-semibold text-[#F5F7F7] tracking-tight mb-6">
              The next project
              <br />
              starts here.
            </h2>
            <p className="text-[17px] text-[#AEB9BD] font-light leading-relaxed max-w-md mb-10">
              Have a project in mind, or just want to talk through an idea? I'm open to freelance and
              full-time opportunities : let's build something that works.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[#AEB9BD]">
                <span className="w-9 h-9 rounded-full bg-[#12171C] border border-[#29323A] flex items-center justify-center text-[#6FE7FF]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <a href="mailto:fawaz@example.com" className="hover:text-[#6FE7FF] transition-colors">
                  fawaz@example.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-[#AEB9BD]">
                <span className="w-9 h-9 rounded-full bg-[#12171C] border border-[#29323A] flex items-center justify-center text-[#6FE7FF]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <span>Kerala, India · Working remotely worldwide</span>
              </div>
            </div>
          </div>

          <div className="bg-[#12171C] border border-[#29323A] rounded-[24px] p-8 md:p-10">
            <ContactForm />
          </div>
        </div>
      </Container>
    </section>
  )
}

export default Contact
