import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Award, CheckCircle2, ExternalLink } from 'lucide-react'
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

function formatYear(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  return date.getFullYear().toString()
}

function Certificates() {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    experienceService
      .getCertificates()
      .then((res) => setCertificates(res.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (!loading && certificates.length === 0) return null

  return (
    <section id="certifications-achievements" className="relative pt-20 pb-20 md:pt-28 md:pb-28 bg-white overflow-hidden border-b-2 border-black">
      {/* Background ambient lighting */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-10%',
          left: '5%',
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
          right: '-5%',
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
              <h2 className="font-(family-name:--font-display) text-[32px] sm:text-[44px] lg:text-[52px] leading-[1.08] font-bold text-black tracking-tight">
                Verified qualifications and domain mastery.
              </h2>
            </div>
            <div className="lg:col-span-4">
              <p className="text-[15px] text-[#666] leading-relaxed">
                Structured accreditations confirming foundational skills across full-stack engineering, databases, and API development.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Certifications Grid: Equal Visual Weight */}
        {loading ? (
          <div className="py-16 text-center text-[#666] font-mono text-sm tracking-widest uppercase">
            Loading certifications…
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {certificates.map((cert, index) => {
              const year = formatYear(cert.date)
              return (
                <motion.div
                  key={cert.id || index}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="ct-panel bg-[#ADD8E6] p-6 sm:p-7 rounded-[5px] border-2 border-black shadow-[4px_4px_0_#000] flex flex-col justify-between relative group"
                >
                  <div>
                    {/* Top row: Award icon & Year pill */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-10 h-10 rounded-[5px] bg-white border-2 border-black flex items-center justify-center text-[#2d8cf0] shadow-[2px_2px_0_#000]">
                        <Award className="w-5 h-5" />
                      </div>
                      {year && (
                        <span className="px-2.5 py-0.5 bg-white border-2 border-black rounded-lg text-[11px] font-mono font-bold text-black shadow-[2px_2px_0_#000]">
                          {year}
                        </span>
                      )}
                    </div>

                    {/* Credential Name */}
                    <h3 className="font-(family-name:--font-display) text-[18px] sm:text-[20px] font-bold text-black leading-tight mb-2">
                      {cert.name}
                    </h3>

                    {/* Issuing Organization */}
                    <p className="text-[13px] sm:text-[14px] text-[#555] font-medium mb-4">
                      {cert.issuer}
                    </p>

                    {/* Optional description if present */}
                    {cert.description && (
                      <p className="text-[13px] text-[#666] leading-relaxed mb-4">
                        {cert.description}
                      </p>
                    )}
                  </div>

                  {/* Verification action or status badge */}
                  <div className="pt-4 border-t-2 border-black/10 mt-4">
                    {cert.link ? (
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#2d8cf0] hover:text-black uppercase tracking-wider transition-colors"
                      >
                        Verify Credential
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#666] uppercase tracking-wider font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2d8cf0]" />
                        Verified Credential
                      </div>
                    )}
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
          className="mt-14 text-center"
        >
          <Link
            to="/resume"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#ADD8E6] text-black font-semibold rounded-[5px] border-2 border-black shadow-[4px_4px_0_#000] hover:bg-[#2d8cf0] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all font-mono text-xs uppercase tracking-wider"
          >
            Explore My Qualifications
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </Container>
    </section>
  )
}

export default Certificates

