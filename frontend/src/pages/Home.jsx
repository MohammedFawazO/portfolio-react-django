import Hero from '../components/sections/Hero'
import AboutMe from '../components/sections/AboutMe'
import Skills from '../components/sections/Skills'
import WhatIDo from '../components/sections/WhatIDo'
import FeaturedProjects from '../components/sections/FeaturedProjects'
import Timeline from '../components/sections/Timeline'
import Certificates from '../components/sections/Certificates'
import Contact from '../components/sections/Contact'

function Home() {
  return (
    <>
      <Hero />
      <AboutMe />
      <Skills />
      <WhatIDo />
      <FeaturedProjects />
      <Timeline />
      <Certificates />
      <Contact />
    </>
  )
}

export default Home
