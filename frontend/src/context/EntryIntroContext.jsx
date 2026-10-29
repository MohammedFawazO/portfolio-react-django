import { createContext, useCallback, useContext, useState } from 'react'

const EntryIntroContext = createContext(null)

export function EntryIntroProvider({ children }) {
  // `introDone` flips as soon as the intro starts leaving (the curtain reveal
  // hangs off it). `introGone` flips only once the overlay has actually
  // unmounted - anything that must not appear over the intro at all (the cube
  // cursor) waits for this one instead.
  const [introDone, setIntroDone] = useState(() =>
    typeof window !== 'undefined' && !!window.sessionStorage.getItem('entryIntroShown')
  )
  const [introGone, setIntroGone] = useState(introDone)

  const markDone = useCallback(() => {
    window.sessionStorage.setItem('entryIntroShown', '1')
    setIntroDone(true)
  }, [])

  const markGone = useCallback(() => {
    window.sessionStorage.setItem('entryIntroShown', '1')
    setIntroDone(true)
    setIntroGone(true)
  }, [])

  return (
    <EntryIntroContext.Provider value={{ introDone, introGone, markDone, markGone }}>
      {children}
    </EntryIntroContext.Provider>
  )
}

export function useEntryIntro() {
  const ctx = useContext(EntryIntroContext)
  if (!ctx) return { introDone: true, introGone: true, markDone: () => {}, markGone: () => {} }
  return ctx
}
