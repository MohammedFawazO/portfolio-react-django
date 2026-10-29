import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Code, Database, Layout, Rocket } from 'lucide-react'
import Container from '../ui/Container'

const SERVICES = [
  {
    number: '01',
    title: 'Full-Stack Development',
    description:
      'Architecting end-to-end web applications where relational backend logic connects cleanly with interactive frontends. Built for data consistency, user engagement, and maintainable project evolution.',
    technologies: ['Python', 'Django', 'React', 'REST APIs', 'PostgreSQL'],
    icon: Code,
  },
  {
    number: '02',
    title: 'Backend Systems & REST APIs',
    description:
      'Designing performant server architectures, secure authentication workflows, robust database schemas, and structured RESTful endpoints with Django REST Framework.',
    technologies: ['Django REST Framework', 'PostgreSQL', 'Supabase', 'Authentication', 'API Design'],
    icon: Database,
  },
  {
    number: '03',
    title: 'Frontend Engineering',
    description:
      'Developing responsive, tactile web interfaces with React, modern styling, and purposeful micro-interactions that feel rapid, intuitive, and consistent across all viewport sizes.',
    technologies: ['React', 'JavaScript', 'Tailwind CSS', 'Framer Motion', 'Responsive UI'],
    icon: Layout,
  },
  {
    number: '04',
    title: 'Deployment & Integration',
    description:
      'Configuring production hosting, managing database storage, establishing custom domains, and ensuring dependable cloud deployments with zero runtime guesswork.',
    technologies: ['Render', 'Railway', 'Cloudflare', 'Docker', 'WhiteNoise'],
    icon: Rocket,
  },
]

const fadeUp = {
  hidden: { y: 30, opacity: 0 },
  visible: (delay = 0) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
  }),
}

function WhatIDo() {
  return (
    <section id="services-expertise" className="relative pt-20 pb-20 md:pt-28 md:pb-28 bg-white overflow-hidden border-b-2 border-black">
      {/* Soft ambient lighting */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-10%',
          left: '10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(45,140,240,0.06) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '-15%',
          right: '5%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(173,216,230,0.12) 0%, transparent 70%)',
        }}
      />

      <Container size="lg">
        {/* Structured 2x2 Expertise Grid with Clear Visual Boundaries */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.map((service, idx) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="ct-panel bg-[#ADD8E6] p-7 sm:p-9 rounded-[5px] flex flex-col justify-between border-2 border-black shadow-[4px_4px_0_#000] relative group"
              >
                <div>
                  {/* Card Top: Number + Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-(family-name:--font-display) text-[32px] sm:text-[38px] font-bold text-[#2d8cf0] leading-none">
                      {service.number}
                    </span>
                    <div className="w-11 h-11 rounded-[5px] bg-white border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0_#000]">
                      <Icon className="w-5 h-5 text-[#2d8cf0]" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-(family-name:--font-display) text-[20px] sm:text-[23px] text-black font-bold leading-tight mb-3 uppercase">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[14px] sm:text-[15px] text-[#555] leading-[1.75] mb-8 font-normal">
                    {service.description}
                  </p>
                </div>

                {/* Relevant Technologies Chips */}
                <div>
                  <div className="text-[11px] font-mono text-[#777] uppercase tracking-wider mb-3 font-semibold">
                    Core Technologies
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {service.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 bg-white border-2 border-black text-[11px] font-mono font-medium text-[#222] rounded-lg shadow-[2px_2px_0_#000]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Section Action Button */}
        <motion.div
          custom={0.3}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link
            to="/about"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#ADD8E6] text-black font-semibold rounded-[5px] border-2 border-black shadow-[4px_4px_0_#000] hover:bg-[#2d8cf0] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all font-mono text-xs uppercase tracking-wider"
          >
            Discover My Approach
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </Container>
    </section>
  )
}

export default WhatIDo

