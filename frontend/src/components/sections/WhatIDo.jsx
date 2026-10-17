import { motion } from 'framer-motion'
import Container from '../ui/Container'
import { StaggerChildren, StaggerItem } from '../animations/StaggerChildren'

const expertise = [
  {
    title: 'Full-Stack Development',
    description: 'Building complete web applications from interface to backend infrastructure.',
    items: ['Python', 'Django', 'React', 'REST APIs', 'Databases'],
  },
  {
    title: 'Backend & APIs',
    description: 'Scalable systems, authentication, and clean data architecture.',
    items: ['Django REST', 'PostgreSQL', 'Supabase', 'Authentication'],
  },
  {
    title: 'Frontend Engineering',
    description: 'Interfaces that feel right : responsive, animated, and thoughtful.',
    items: ['React', 'JavaScript', 'Tailwind', 'Framer Motion'],
  },
  {
    title: 'Deployment & DevOps',
    description: 'Shipping to production with confidence and observability.',
    items: ['Render', 'Railway', 'Docker', 'Cloudflare'],
  },
]

const fadeUp = {
  hidden: { y: 40, opacity: 0 },
  visible: (delay) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
  }),
}

function WhatIDo() {
  return (
    <section className="relative py-[7rem] md:py-[9rem] bg-white overflow-hidden">
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-15%',
          right: '5%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(35,105,102,0.22) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <Container size="lg">
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-[#2d8cf0]" />
            <span className="text-[11px] font-[family-name:var(--font-mono)] text-[#2d8cf0] uppercase tracking-[0.3em] font-medium">
              What I Do
            </span>
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-[40px] md:text-[56px] leading-[1.04] font-semibold text-black tracking-tight">
            Services
          </h2>
        </motion.div>

        <StaggerChildren className="border-t-2 border-black">
          {expertise.map((service, idx) => (
            <StaggerItem key={service.title}>
              <motion.div
                whileHover={{ x: 8 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="group relative grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-6 md:gap-10 items-center py-10 border-b-2 border-black"
              >
                <span className="font-[family-name:var(--font-display)] text-[28px] md:text-[36px] font-semibold text-[#2d8cf0]/70 group-hover:text-[#2d8cf0] transition-colors duration-300 leading-none">
                  {String(idx + 1).padStart(2, '0')}
                </span>

                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-[24px] md:text-[30px] text-black font-medium leading-tight mb-2">
                    {service.title}
                  </h3>
                  <p className="text-[15px] text-[#666] leading-relaxed max-w-xl">
                    {service.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 md:justify-end">
                  {service.items.map((item) => (
                    <span
                      key={item}
                      className="ct-tag px-3 py-1.5 text-[12px] font-[family-name:var(--font-mono)] uppercase tracking-[0.06em] group-hover:border-[#2d8cf0] transition-colors duration-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </Container>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black to-transparent" />
    </section>
  )
}

export default WhatIDo
