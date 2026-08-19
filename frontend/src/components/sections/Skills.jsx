import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import skillService from '../../services/skillService'
import Container from '../ui/Container'

const fadeUp = {
  hidden: { y: 40, opacity: 0 },
  visible: (delay) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
  }),
}

function Skills() {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    skillService
      .getAll()
      .then((res) => setSkills(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || 'Other'
    if (!acc[category]) acc[category] = []
    acc[category].push(skill)
    return acc
  }, {})

  const categories = Object.keys(groupedSkills)

  return (
    <section className="relative py-[7rem] md:py-[9rem] bg-[#0A3332] overflow-hidden">
      {/* Ambient ice-blue glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '0%',
          right: '-10%',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(111,231,255,0.10) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '-20%',
          left: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(35,105,102,0.6) 0%, transparent 70%)',
        }}
      />

      <Container size="lg">
        {/* Header */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-[#6FE7FF]" />
            <span className="text-[11px] font-[family-name:var(--font-mono)] text-[#6FE7FF] uppercase tracking-[0.3em] font-medium">
              Technology Stack
            </span>
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-[40px] md:text-[56px] leading-[1.04] font-semibold text-[#F5F7F7] tracking-tight">
            Tools I build with
          </h2>
          <p className="text-[17px] text-[#B8F2FA] font-light mt-4 max-w-2xl leading-relaxed">
            A focused toolkit across the full stack : chosen for reliability, scalability, and clean
            developer experience.
          </p>
        </motion.div>

        {loading ? (
          <div className="text-[#B8F2FA]/60 font-[family-name:var(--font-mono)] text-sm tracking-widest uppercase">
            Loading stack…
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category, ci) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: ci * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white/[0.04] border border-white/[0.10] rounded-[20px] p-8 backdrop-blur-sm"
              >
                <div className="flex items-baseline justify-between mb-6">
                  <h3 className="font-[family-name:var(--font-display)] text-[14px] text-[#F5F7F7] uppercase tracking-[0.2em] font-medium">
                    {category}
                  </h3>
                  <span className="text-[11px] text-[#6FE7FF]/70 font-[family-name:var(--font-mono)]">
                    {groupedSkills[category].length}
                  </span>
                </div>

                <div className="space-y-5">
                  {groupedSkills[category].map((skill, si) => (
                    <div key={skill.id}>
                      <div className="flex justify-between items-baseline mb-2">
                        <span className="text-[15px] text-[#F5F7F7] font-medium">{skill.name}</span>
                        <span className="text-[12px] text-[#B8F2FA] font-[family-name:var(--font-mono)]">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.1, delay: 0.15 + si * 0.08, ease: [0.16, 1, 0.3, 1] }}
                          className="h-full rounded-full bg-gradient-to-r from-[#6FE7FF] to-[#35C9E8]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Container>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6FE7FF]/30 to-transparent" />
    </section>
  )
}

export default Skills
