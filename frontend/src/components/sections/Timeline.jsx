import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import experienceService from '../../services/experienceService'
import Container from '../ui/Container'

function Timeline() {
  const [experiences, setExperiences] = useState([])

  useEffect(() => {
    experienceService
      .getAll()
      .then((res) => setExperiences(res.data))
      .catch((err) => console.error(err))
  }, [])

  if (experiences.length === 0) return null

  return (
    <section className="py-[7rem] md:py-[9rem] bg-[#F5F7F7] overflow-hidden">
      <Container size="lg">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-[#236966]" />
            <span className="text-[11px] font-[family-name:var(--font-mono)] text-[#236966] uppercase tracking-[0.3em] font-medium">
              Career
            </span>
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-[40px] md:text-[56px] leading-[1.04] font-semibold text-[#0A3332] tracking-tight">
            Experience
          </h2>
        </div>

        <div className="border-t border-[#D2DCDF]">
          {experiences.map((exp, index) => {
            const period = `${exp.start_date || ''} ${exp.end_date ? ': ' + exp.end_date : ': Present'}`
            const isCurrent = !exp.end_date
            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 md:gap-12 py-12 border-b border-[#D2DCDF]"
              >
                {/* Year / period */}
                <div className="md:pt-1">
                  <div className="font-[family-name:var(--font-display)] text-[22px] md:text-[26px] text-[#0A3332] font-medium leading-tight">
                    {period}
                  </div>
                  {isCurrent && (
                    <span className="inline-flex items-center gap-2 mt-3 text-[11px] font-[family-name:var(--font-mono)] uppercase tracking-[0.14em] text-[#236966]">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-[#236966] opacity-60 animate-ping" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#236966]" />
                      </span>
                      Current
                    </span>
                  )}
                </div>

                {/* Role details */}
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-[26px] md:text-[32px] text-[#0A3332] font-medium leading-tight mb-1">
                    {exp.title}
                  </h3>
                  <p className="text-[15px] text-[#236966] font-medium mb-4">{exp.company}</p>
                  <p className="text-[16px] text-[#405354] leading-[1.8] max-w-2xl">{exp.description}</p>

                  {exp.technologies && (
                    <div className="flex flex-wrap gap-2 mt-5">
                      {exp.technologies.split(',').map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1.5 bg-white border border-[#D2DCDF] text-[12px] text-[#405354] rounded-full font-[family-name:var(--font-mono)] uppercase tracking-[0.06em]"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

export default Timeline
