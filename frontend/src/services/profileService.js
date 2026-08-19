import { profile, socials } from '../data/content'

const profileService = {
  get: () => Promise.resolve({ data: profile }),
  getSocials: () => Promise.resolve({ data: socials }),
}

export default profileService
