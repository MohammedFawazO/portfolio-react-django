import { Helmet } from 'react-helmet-async'
import ContactForm from '../components/common/ContactForm'
import SectionHeading from '../components/ui/SectionHeading'
import Card from '../components/ui/Card'
import Container from '../components/ui/Container'

function Contact() {
  return (
    <>
      <Helmet>
        <title>Contact · Work with Mohammed Fawaz O | Python Full Stack Developer</title>
        <meta name="description" content="Get in touch with Mohammed Fawaz O for web development projects and opportunities." />
      </Helmet>

      <div className="min-h-screen bg-[#F5F7F7] py-[8rem] md:py-[10rem] pt-[9rem] relative overflow-hidden">
        <div
          className="absolute pointer-events-none"
          style={{ top: '-15%', right: '-5%', width: '650px', height: '650px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(35,105,102,0.10) 0%, transparent 70%)' }}
        />
        <Container size="lg">
          <div className="mb-16">
            <h1 className="font-[family-name:var(--font-display)] text-[44px] md:text-[68px] leading-[1.02] font-semibold text-[#0A3332] tracking-tight max-w-3xl">
              Let's build something together.
            </h1>
            <p className="text-[17px] text-[#405354] font-light mt-5 max-w-xl leading-relaxed">
              Have a project in mind, or just want to discuss an idea? I'm open to freelance and
              full-time opportunities : feel free to reach out.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="space-y-4 mb-10">
                {[
                  { label: 'Response Time', value: 'Within 24–48 hours' },
                  { label: 'Availability', value: 'Open to freelance & full-time' },
                  { label: 'Location', value: 'Kerala, India (Working remotely worldwide)' },
                ].map((info) => (
                  <Card key={info.label} variant="light" className="!p-5">
                    <p className="text-[11px] text-[#718082] uppercase tracking-[0.18em] font-[family-name:var(--font-mono)] mb-1">{info.label}</p>
                    <p className="text-[#0A3332] font-medium">{info.value}</p>
                  </Card>
                ))}
              </div>

              <p className="text-[#405354] text-[16px] leading-relaxed">
                I work with clients worldwide and am comfortable collaborating across time zones.
                Let's create software that solves real problems.
              </p>
            </div>

            <Card variant="standard" className="!p-8 md:!p-10">
              <ContactForm />
            </Card>
          </div>
        </Container>
      </div>
    </>
  )
}

export default Contact
