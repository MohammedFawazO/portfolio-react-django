import Hero from '../components/sections/Hero'
import AboutMe from '../components/sections/AboutMe'
import Skills from '../components/sections/Skills'
import FeaturedProjects from '../components/sections/FeaturedProjects'
import Timeline from '../components/sections/Timeline'
import Contact from '../components/sections/Contact'

function Home() {
  return (
    <>
      <Hero />
      <AboutMe />
      <Timeline />
      <FeaturedProjects />
      <Skills />
      <Contact />
    </>
  )
}

export default Home
