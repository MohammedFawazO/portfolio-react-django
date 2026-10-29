import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Code2, Cpu, Layout, Server } from 'lucide-react'
import skillService from '../../services/skillService'
import { technologies } from '../ui/TechMarquee'
import Container from '../ui/Container'

const fadeUp = {
  hidden: { y: 30, opacity: 0 },
  visible: (delay = 0) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
  }),
}

const CATEGORY_META = [
  {
    id: 'languages',
    title: 'Languages & Core Technologies',
    subtitle: 'Core programming languages & foundational web technologies',
    icon: Code2,
    filter: (s) =>
      ['python', 'javascript', 'html', 'css', 'typescript'].includes(s.name.toLowerCase()) ||
      (s.category && ['languages', 'language'].includes(s.category.toLowerCase())),
  },
  {
    id: 'backend',
    title: 'Backend Frameworks & APIs',
    subtitle: 'Server-side architectures, REST API endpoints & auth flows',
    icon: Server,
    filter: (s) =>
      (s.category && ['backend', 'api', 'apis'].includes(s.category.toLowerCase()) &&
        !['python'].includes(s.name.toLowerCase())) ||
      s.name.toLowerCase().includes('django') ||
      s.name.toLowerCase().includes('api'),
  },
  {
    id: 'frontend',
    title: 'Frontend Technologies',
    subtitle: 'Component libraries, modern styling & state interfaces',
    icon: Layout,
    filter: (s) =>
      (s.category && s.category.toLowerCase() === 'frontend' &&
        !['html', 'css', 'javascript'].includes(s.name.toLowerCase())) ||
      ['react', 'tailwind css', 'bootstrap'].includes(s.name.toLowerCase()),
  },
  {
    id: 'infrastructure',
    title: 'Databases, Deployment & Development Tools',
    subtitle: 'Persistence layers, containerization, cloud hosting & CI/CD',
    icon: Cpu,
    filter: (s) =>
      s.category && ['databases', 'deployment', 'tools'].includes(s.category.toLowerCase()),
  },
]

function Skills() {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [hoveredIdx, setHoveredIdx] = useState(null)

  const ADJACENT_MAP = {
    0: [1, 6], 1: [0, 2, 6, 7], 2: [1, 3, 7, 8], 3: [2, 4, 8, 9], 4: [3, 5, 9, 10], 5: [4, 10],
    6: [0, 1, 7], 7: [1, 6, 8, 2, 11], 8: [2, 7, 9, 3, 12],     9: [3, 8, 10, 4, 13], 10: [5, 4, 9],
    11: [7, 12, 14], 12: [8, 11, 13, 14, 15], 13: [9, 10, 12, 15], 14: [11, 12, 15], 15: [12, 13, 14],
  }

  useEffect(() => {
    skillService
      .getAll()
      .then((res) => setSkills(res.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  // Categorize dynamic backend skills into the 4 structured buckets
  const categorizedSections = CATEGORY_META.map((cat) => {
    const matched = skills.filter(cat.filter)
    return {
      ...cat,
      skills: matched,
    }
  })

  // Capture any skills that might not match the specific filters above and append to infrastructure
  const allMatchedIds = new Set(categorizedSections.flatMap((c) => c.skills.map((s) => s.id)))
  const remainingSkills = skills.filter((s) => !allMatchedIds.has(s.id))
  if (remainingSkills.length > 0 && categorizedSections[3]) {
    categorizedSections[3].skills.push(...remainingSkills)
  }

  return (
    <section id="technology-stack" className="relative pt-20 pb-20 md:pt-28 md:pb-28 bg-white overflow-hidden border-b-2 border-black">
      {/* Background ambient accents */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '5%',
          right: '-8%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(45,140,240,0.07) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '-10%',
          left: '-5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(173,216,230,0.15) 0%, transparent 70%)',
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
            <div className="lg:col-span-12 text-center">
              <h2 className="font-(family-name:--font-display) text-[32px] sm:text-[44px] lg:text-[52px] leading-[1.08] font-bold text-black tracking-tight uppercase text-center">
                WHAT I WORK WITH
              </h2>
            </div>
            <div className="lg:col-span-12 lg:text-center">
              <p className="text-[15px] text-[#666] leading-relaxed text-center lg:text-center">
                A focused technical arsenal organized across four foundational layers. Every tool is selected for maintainability and production stability.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Inverted Pyramid — 1 Technology per Rounded Square */}
        <div className="flex flex-col items-center gap-5">
          {/* Row 1 (widest): 6 */}
          <div className="group/row flex flex-wrap justify-center gap-3">
            {technologies.slice(0, 6).map((tech, i) => {
              const globalIdx = i
              const isRipple = hoveredIdx !== null && ADJACENT_MAP[hoveredIdx]?.includes(globalIdx) && globalIdx !== hoveredIdx
              return (
              <motion.div
                key={tech.name + i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                onMouseEnter={() => setHoveredIdx(globalIdx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`group/card w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-md rounded-[16px] border border-white/40 shadow-[3px_3px_0_rgba(0,0,0,0.15)] flex flex-col items-center justify-center gap-1.5 text-black overflow-hidden p-2 perspective-[600px] transform-3d transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-3 hover:-rotate-2 hover:scale-105 hover:z-10 hover:shadow-[6px_6px_15px_rgba(0,0,0,0.15)] ${isRipple ? 'scale-105 -rotate-1 shadow-[6px_6px_15px_rgba(45,140,240,0.15)] -translate-y-0.5' : ''}`}
              >
                {tech.svg ? (
                  <span className="w-7 h-7 flex items-center justify-center grayscale group-hover/card:grayscale-0 transition-all duration-300 ease-in-out group-hover/card:drop-shadow-[0_0_8px_#2d8cf0] group-hover/card:scale-110">{tech.svg}</span>
                ) : tech.name === 'Railway' ? (
                  <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center overflow-hidden">
                    <img src={tech.image} alt={tech.name} className="h-5 w-auto object-contain grayscale group-hover/card:grayscale-0 transition-all duration-300 ease-in-out group-hover/card:scale-110" />
                  </div>
                ) : (
                  <img src={tech.image} alt={tech.name} className="h-7 w-auto object-contain grayscale group-hover/card:grayscale-0 transition-all duration-300 ease-in-out group-hover/card:scale-110" />
                )}
                <span className="font-(family-name:--font-display) text-[10px] sm:text-[11px] font-bold text-center leading-tight group-hover/card:text-[#2d8cf0] transition-colors">{tech.name}</span>
              </motion.div>
            )})}
          </div>
          {/* Row 2: 5 */}
          <div className="group/row flex flex-wrap justify-center gap-3">
            {technologies.slice(6, 11).map((tech, i) => {
              const globalIdx = 6 + i
              const isRipple = hoveredIdx !== null && ADJACENT_MAP[hoveredIdx]?.includes(globalIdx) && globalIdx !== hoveredIdx
              return (
              <motion.div
                key={tech.name + i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
                onMouseEnter={() => setHoveredIdx(globalIdx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`group/card w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-md rounded-[16px] border border-white/40 shadow-[3px_3px_0_rgba(0,0,0,0.15)] flex flex-col items-center justify-center gap-1.5 text-black overflow-hidden p-2 perspective-[600px] transform-3d transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-3 hover:-rotate-2 hover:scale-105 hover:z-10 hover:shadow-[6px_6px_15px_rgba(0,0,0,0.15)] ${isRipple ? 'scale-105 -rotate-1 shadow-[6px_6px_15px_rgba(45,140,240,0.15)] -translate-y-0.5' : ''}`}
              >
                {tech.svg ? (
                  <span className="w-7 h-7 flex items-center justify-center grayscale group-hover/card:grayscale-0 transition-all duration-300 ease-in-out group-hover/card:drop-shadow-[0_0_8px_#2d8cf0] group-hover/card:scale-110">{tech.svg}</span>
                ) : tech.name === 'Railway' ? (
                  <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center overflow-hidden">
                    <img src={tech.image} alt={tech.name} className="h-5 w-auto object-contain grayscale group-hover/card:grayscale-0 transition-all duration-300 ease-in-out group-hover/card:scale-110" />
                  </div>
                ) : (
                  <img src={tech.image} alt={tech.name} className="h-7 w-auto object-contain grayscale group-hover/card:grayscale-0 transition-all duration-300 ease-in-out group-hover/card:scale-110" />
                )}
                <span className="font-(family-name:--font-display) text-[10px] sm:text-[11px] font-bold text-center leading-tight group-hover/card:text-[#2d8cf0] transition-colors">{tech.name}</span>
              </motion.div>
            )})}
          </div>
          {/* Row 3: 3 */}
          <div className="group/row flex flex-wrap justify-center gap-3">
            {technologies.slice(11, 14).map((tech, i) => {
              const globalIdx = 11 + i
              const isRipple = hoveredIdx !== null && ADJACENT_MAP[hoveredIdx]?.includes(globalIdx) && globalIdx !== hoveredIdx
              return (
              <motion.div
                key={tech.name + i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.05 }}
                onMouseEnter={() => setHoveredIdx(globalIdx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`group/card w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-md rounded-[16px] border border-white/40 shadow-[3px_3px_0_rgba(0,0,0,0.15)] flex flex-col items-center justify-center gap-1.5 text-black overflow-hidden p-2 perspective-[600px] transform-3d transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-3 hover:-rotate-2 hover:scale-105 hover:z-10 hover:shadow-[6px_6px_15px_rgba(0,0,0,0.15)] ${isRipple ? 'scale-105 -rotate-1 shadow-[6px_6px_15px_rgba(45,140,240,0.15)] -translate-y-0.5' : ''}`}
              >
                {tech.svg ? (
                  <span className="w-7 h-7 flex items-center justify-center grayscale group-hover/card:grayscale-0 transition-all duration-300 ease-in-out group-hover/card:drop-shadow-[0_0_8px_#2d8cf0] group-hover/card:scale-110">{tech.svg}</span>
                ) : tech.name === 'Railway' ? (
                  <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center overflow-hidden">
                    <img src={tech.image} alt={tech.name} className="h-5 w-auto object-contain grayscale group-hover/card:grayscale-0 transition-all duration-300 ease-in-out group-hover/card:scale-110" />
                  </div>
                ) : (
                  <img src={tech.image} alt={tech.name} className="h-7 w-auto object-contain grayscale group-hover/card:grayscale-0 transition-all duration-300 ease-in-out group-hover/card:scale-110" />
                )}
                <span className="font-(family-name:--font-display) text-[10px] sm:text-[11px] font-bold text-center leading-tight group-hover/card:text-[#2d8cf0] transition-colors">{tech.name}</span>
              </motion.div>
            )})}
          </div>
          {/* Row 4: 2 (Railway, Next.js) */}
          <div className="group/row flex flex-wrap justify-center gap-3">
            {technologies.slice(14, 16).map((tech, i) => {
              const globalIdx = 14 + i
              const isRipple = hoveredIdx !== null && ADJACENT_MAP[hoveredIdx]?.includes(globalIdx) && globalIdx !== hoveredIdx
              return (
              <motion.div
                key={tech.name + i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 + i * 0.05 }}
                onMouseEnter={() => setHoveredIdx(globalIdx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`group/card w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-md rounded-[16px] border border-white/40 shadow-[3px_3px_0_rgba(0,0,0,0.15)] flex flex-col items-center justify-center gap-1.5 text-black overflow-hidden p-2 perspective-[600px] transform-3d transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-3 hover:-rotate-2 hover:scale-105 hover:z-10 hover:shadow-[6px_6px_15px_rgba(0,0,0,0.15)] ${isRipple ? 'scale-105 -rotate-1 shadow-[6px_6px_15px_rgba(45,140,240,0.15)] -translate-y-0.5' : ''}`}
              >
                {tech.svg ? (
                  <span className="w-7 h-7 flex items-center justify-center grayscale group-hover/card:grayscale-0 transition-all duration-300 ease-in-out group-hover/card:drop-shadow-[0_0_8px_#2d8cf0] group-hover/card:scale-110">{tech.svg}</span>
                ) : tech.name === 'Railway' ? (
                  <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center overflow-hidden">
                    <img src={tech.image} alt={tech.name} className="h-5 w-auto object-contain grayscale group-hover/card:grayscale-0 transition-all duration-300 ease-in-out group-hover/card:scale-110" />
                  </div>
                ) : (
                  <img src={tech.image} alt={tech.name} className="h-7 w-auto object-contain grayscale group-hover/card:grayscale-0 transition-all duration-300 ease-in-out group-hover/card:scale-110" />
                )}
                <span className="font-(family-name:--font-display) text-[10px] sm:text-[11px] font-bold text-center leading-tight group-hover/card:text-[#2d8cf0] transition-colors">{tech.name}</span>
              </motion.div>
            )})}
          </div>
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
            className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#ADD8E6] text-black font-semibold rounded-full border-2 border-black shadow-[4px_4px_0_#000] hover:bg-[#2d8cf0] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all font-mono text-xs uppercase tracking-wider"
          >
            Explore Technical Background
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </Container>
    </section>
  )
}

export default Skills

