import { motion } from 'framer-motion'
import Container from '../ui/Container'
import { KineticTextReveal } from '../ui/KineticTextReveal'
import Button from '../ui/Button'

const stats = [
  { label: 'Projects Completed', value: 10, suffix: '+' },
  { label: 'Technologies', value: 15, suffix: '+' },
  { label: 'Years Learning', value: 3, suffix: '+' },
  { label: 'Real Client Projects', value: 5, suffix: '' },
]

const fadeUp = {
  hidden: { y: 40, opacity: 0 },
  visible: (delay) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
  }),
}

function AboutMe() {
  return (
    <section className="relative py-[7rem] md:py-[9rem] bg-white overflow-hidden">
      {/* Soft teal ambient wash */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-10%',
          right: '-5%',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(35,105,102,0.10) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '-15%',
          left: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(111,231,255,0.08) 0%, transparent 70%)',
        }}
      />

      <Container size="lg">
        {/* Section Header */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mb-16 -mt-16 md:-mt-24"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-8 bg-[#2d8cf0]" />
            <span className="text-[11px] font-[family-name:var(--font-mono)] text-[#2d8cf0] uppercase tracking-[0.3em] font-medium">
              Professional Snapshot
            </span>
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-[40px] md:text-[56px] leading-[1.04] font-semibold text-black max-w-4xl tracking-tight">
            <KineticTextReveal
              text="Crafting digital experiences with precision and purpose."
              splitBy="words"
              direction="up"
              distance={15}
              stagger={0.04}
              delay={0.2}
              blur={false}
            />
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-14 items-start">
          {/* Left - Bio */}
          <div className="lg:col-span-3">
            <motion.div
              custom={0.3}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              className="space-y-6"
            >
              <p className="text-[19px] text-[#323232] font-medium leading-[1.7]">
                A Python Full Stack Developer specializing in building modern web applications : from
                backend architecture to polished frontend experiences.
              </p>
              <p className="text-[16px] text-[#666] leading-[1.9]">
                My work focuses on scalable APIs, clean system design, responsive interfaces, and
                production deployment. I believe in writing code that is not only functional but
                maintainable and elegant.
              </p>
              <p className="text-[16px] text-[#666] leading-[1.9]">
                I've built real-world applications ranging from AI-powered platforms to commercial web
                systems for businesses, always striving to bridge the gap between complex technology
                and intuitive user experiences.
              </p>
            </motion.div>

            <motion.div
              custom={0.5}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Button as="a" href="/projects" variant="primary" size="lg">
                View Projects
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Button>
              <Button as="a" href="/resume" variant="outline" size="lg" className="!border-2 !border-black !text-[#323232] hover:!border-[#2d8cf0] hover:!text-black hover:!bg-[#EDE8D0]">
                Resume
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </Button>
            </motion.div>
          </div>

          {/* Right - Stats (Teal feature blocks) */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="relative group"
              >
                <div className="ct-panel bg-beige rounded-[5px] p-7 text-center overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2d8cf0]/50 to-transparent opacity-60" />
                  <div className="font-[family-name:var(--font-display)] text-[40px] md:text-[46px] text-black leading-none mb-3 font-semibold">
                    {stat.value}
                    <span className="text-[#2d8cf0]">{stat.suffix}</span>
                  </div>
                  <div className="text-[11px] text-[#666] uppercase tracking-[0.14em] font-[family-name:var(--font-mono)] leading-[1.5]">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black to-transparent" />
    </section>
  )
}

export default AboutMe
