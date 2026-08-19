import { projects } from '../data/content'

const projectService = {
  getAll: () => Promise.resolve({ data: projects }),
  getFeatured: () =>
    Promise.resolve({ data: projects.filter((p) => p.featured) }),
}

export default projectService
