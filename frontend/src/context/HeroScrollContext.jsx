import { createContext, useContext } from 'react'
import { MotionValue } from 'framer-motion'

const defaultProgress = new MotionValue(0)

export const HeroScrollContext = createContext(defaultProgress)

export const useHeroScroll = () => useContext(HeroScrollContext)
