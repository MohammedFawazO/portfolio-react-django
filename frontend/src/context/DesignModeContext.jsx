import { createContext, useContext, useState } from 'react'

const DesignModeContext = createContext(null)

export function DesignModeProvider({ children }) {
  const [designModeActive, setDesignModeActive] = useState(false)

  return (
    <DesignModeContext.Provider value={{ designModeActive, setDesignModeActive }}>
      {children}
    </DesignModeContext.Provider>
  )
}

export function useDesignMode() {
  const ctx = useContext(DesignModeContext)
  if (!ctx) return { designModeActive: false, setDesignModeActive: () => {} }
  return ctx
}
