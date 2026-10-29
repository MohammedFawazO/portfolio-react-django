import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Briefcase, Calendar, MapPin } from 'lucide-react'
import experienceService from '../../services/experienceService'
import Container from '../ui/Container'

const fadeUp = {
  hidden: { y: 30, opacity: 0 },
  visible: (delay = 0) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
  }),
}

function formatDate(dateStr) {
  if (!dateStr) return 'Present'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function Timeline() {
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    experienceService
      .getAll()
      .then((res) => setExperiences(res.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (!loading && experiences.length === 0) return null

  return (
    <section id="career-experience" className="relative pt-20 pb-20 md:pt-28 md:pb-28 bg-white overflow-hidden border-b-2 border-black">
      {/* Background ambient accents */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-10%',
          right: '5%',
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
          left: '-5%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(173,216,230,0.12) 0%, transparent 70%)',
        }}
      />

      <Container size="lg">
        {/* Section Header */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mb-14"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-8">
              <h2 className="font-(family-name:--font-display) text-[32px] sm:text-[44px] lg:text-[52px] leading-[1.08] font-bold text-black tracking-tight uppercase">
                PROFESSIONAL EXPERIENCE
              </h2>
            </div>
            <div className="lg:col-span-4">
              <p className="text-[15px] text-[#666] leading-relaxed">
                Demonstrated real-world experience building, deploying, and maintaining production systems for client companies and startups.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Professional History List */}
        {loading ? (
          <div className="py-16 text-center text-[#666] font-mono text-sm tracking-widest uppercase">
            Loading career history…
          </div>
        ) : (
          <div className="space-y-8">
            {experiences.map((exp, index) => {
              const startDate = formatDate(exp.start_date)
              const endDate = formatDate(exp.end_date)
              const isCurrent = !exp.end_date || exp.end_date.toLowerCase() === 'present'
              const techList = exp.technologies ? exp.technologies.split(',').map((t) => t.trim()) : []

              return (
                <motion.div
                  key={exp.id || index}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="ct-panel bg-[#ADD8E6] p-7 sm:p-10 rounded-[5px] border-2 border-black shadow-[4px_4px_0_#000] relative"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
                    {/* Left Column: Organization, Dates, Role */}
                    <div className="lg:col-span-5 space-y-3 border-b-2 lg:border-b-0 lg:border-r-2 border-black/15 pb-6 lg:pb-0 lg:pr-8">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0_#000] text-[11px] font-mono text-[#2d8cf0] font-bold uppercase">
                          <Calendar className="w-3.5 h-3.5" />
                          {startDate} — {endDate}
                        </span>
                        {isCurrent && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#ADD8E6] border-2 border-black rounded-lg shadow-[2px_2px_0_#000] text-[10px] font-mono text-black font-bold uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
                            Current
                          </span>
                        )}
                      </div>

                      <h3 className="font-(family-name:--font-display) text-[24px] sm:text-[28px] font-bold text-black leading-tight pt-1">
                        {exp.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 text-[14px] text-[#444] font-medium pt-1">
                        <span className="inline-flex items-center gap-1.5">
                          <Briefcase className="w-4 h-4 text-[#2d8cf0]" />
                          {exp.company}
                        </span>
                        {exp.location && (
                          <span className="inline-flex items-center gap-1 text-[#666]">
                            <MapPin className="w-3.5 h-3.5 text-[#888]" />
                            {exp.location}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right Column: Detailed narrative & Tech badges */}
                    <div className="lg:col-span-7 flex flex-col justify-between">
                      <p className="text-[15px] sm:text-[16px] text-[#444] leading-[1.8] font-normal mb-6">
                        {exp.description}
                      </p>


                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

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
            to="/resume"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#ADD8E6] text-black font-semibold rounded-full border-2 border-black shadow-[4px_4px_0_#000] hover:bg-[#2d8cf0] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all font-mono text-xs uppercase tracking-wider"
          >
            View Full Career History
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </Container>
    </section>
  )
}

export default Timeline

