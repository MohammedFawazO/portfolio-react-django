import { skills } from '../data/content'

const skillService = {
  getAll: () => Promise.resolve({ data: skills }),
  getByCategory: (category) =>
    Promise.resolve({
      data: skills.filter((s) => s.category === category),
    }),
}

export default skillService
