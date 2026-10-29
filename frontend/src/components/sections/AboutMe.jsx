import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, FileText } from 'lucide-react'
import Container from '../ui/Container'

/* Numbers mirror the stats band on the Projects page (Projects.jsx) and the
   Quick Info on the About page, so the two views never contradict each other. */
const stats = [
  { label: 'Projects Completed', value: '4', suffix: '' },
  { label: 'Technologies Mastered', value: '16', suffix: '+' },
  { label: 'Years Freelance', value: '1', suffix: '+' },
  { label: 'Client Builds Live', value: '2', suffix: '' },
]

const fadeUp = {
  hidden: { y: 30, opacity: 0 },
  visible: (delay = 0) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
  }),
}

function AboutMe() {
  return (
    <section id="professional-snapshot" className="relative pt-20 pb-20 md:pt-28 md:pb-28 bg-white overflow-hidden border-b-2 border-black">
      {/* Soft ambient lighting */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-10%',
          right: '-5%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(45,140,240,0.08) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '-15%',
          left: '-5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(173,216,230,0.12) 0%, transparent 70%)',
        }}
      />

      <Container size="lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-stretch">
          {/* Left: Text + Action Buttons */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="flex flex-col"
          >
            <h2 className="font-(family-name:--font-display) text-[22px] sm:text-[30px] lg:text-[36px] leading-[1.05] font-bold text-black tracking-tighter mb-5 wrap-break-word uppercase">
              THE CRAFT IS IN GETTING THE LITTLE THINGS RIGHT.
            </h2>

            <div className="space-y-4">
              <p className="text-[15px] sm:text-[16px] text-[#222] font-medium leading-[1.7]">
                Python and Django at the core, REST APIs, databases, and React on the frontend. I care about how the pieces fit together, clean code, sound architecture, reliable functionality, and interfaces that feel right to use. Not complexity for its own sake, just the small decisions that make an application better.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3.5 pt-6 pb-6">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#ADD8E6] text-black font-semibold rounded-full border-2 border-black shadow-[4px_4px_0_#000] hover:bg-[#2d8cf0] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all font-mono text-xs uppercase tracking-wider"
              >
                Explore My Background
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/resume"
                className="inline-flex items-center gap-2 px-5 py-3 bg-transparent text-black font-semibold rounded-full border-2 border-black shadow-[4px_4px_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all font-mono text-xs uppercase tracking-wider"
              >
                View Resume
                <FileText className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>

          {/* Right: Statistics Boxes */}
          <motion.div
            custom={0.15}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-2 grid-rows-2 gap-4 sm:gap-5 h-full pb-6"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="ct-panel bg-[#ADD8E6] rounded-[5px] p-5 text-center relative overflow-hidden group flex flex-col items-center justify-center"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#ADD8E6]/70 group-hover:bg-[#2d8cf0] transition-colors" />
                <div className="font-(family-name:--font-display) text-[24px] sm:text-[28px] text-black leading-none mb-1.5 font-bold tracking-tight">
                  {stat.value}
                  <span className="text-[#2d8cf0]">{stat.suffix}</span>
                </div>
                <div className="text-[10px] sm:text-[11px] text-[#555] uppercase tracking-[0.14em] font-mono font-medium leading-tight">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  )
}

export default AboutMe

