import { useState, useEffect } from 'react'
import projectService from '../../services/projectService'
import ProjectCard from '../cards/ProjectCard'
import Container from '../ui/Container'
import FadeInWhenVisible from '../animations/FadeInWhenVisible'
import { StaggerChildren, StaggerItem } from '../animations/StaggerChildren'

function Projects() {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    projectService.getAll()
      .then(res => setProjects(res.data))
      .catch(err => console.error(err))
  }, [])

  if (projects.length === 0) return null

  return (
    <section className="py-20 bg-[#07090B]">
      <Container>
        <FadeInWhenVisible>
          <h2 className="text-3xl font-bold text-[#F2F5F7] text-center mb-12">
            Projects
          </h2>
        </FadeInWhenVisible>

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map(project => (
            <StaggerItem key={project.id}>
              <ProjectCard
                title={project.title}
                description={project.description}
                image={project.image}
                tags={project.tags ? project.tags.split(',').map(t => t.trim()) : []}
                link={project.link}
              />
            </StaggerItem>
          ))}
        </StaggerChildren>
      </Container>
    </section>
  )
}

export default Projects
