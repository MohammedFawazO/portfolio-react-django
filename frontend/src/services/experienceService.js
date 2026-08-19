import { experience, education, certificates } from '../data/content'

const experienceService = {
  getAll: () => Promise.resolve({ data: experience }),
  getEducation: () => Promise.resolve({ data: education }),
  getCertificates: () => Promise.resolve({ data: certificates }),
}

export default experienceService
