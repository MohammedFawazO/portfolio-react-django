import { createContext, useCallback, useContext, useState } from 'react'

const EntryIntroContext = createContext(null)

export function EntryIntroProvider({ children }) {
  const [introDone, setIntroDone] = useState(() =>
    typeof window !== 'undefined' && !!window.sessionStorage.getItem('entryIntroShown')
  )

  const markDone = useCallback(() => {
    window.sessionStorage.setItem('entryIntroShown', '1')
    setIntroDone(true)
  }, [])

  return (
    <EntryIntroContext.Provider value={{ introDone, markDone }}>
      {children}
    </EntryIntroContext.Provider>
  )
}

export function useEntryIntro() {
  const ctx = useContext(EntryIntroContext)
  if (!ctx) return { introDone: true, markDone: () => {} }
  return ctx
}
