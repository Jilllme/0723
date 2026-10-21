"use client"

import { createContext, useContext, useState, useRef, useCallback, type ReactNode } from "react"

type AppState = {
  setBeforeLeave: (guard:(()=>boolean)|null)=>void
  isLocked: boolean
  currentApp: string | null
  controlCenterOpen: boolean
  openApp: (appId: string) => void
  closeApp: () => void
  lockDevice: () => void
  unlockDevice: () => void
  openControlCenter: () => void
  closeControlCenter: () => void
}

const AppStateContext = createContext<AppState | undefined>(undefined)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [isLocked, setIsLocked] = useState(true)
  const [currentApp, setCurrentApp] = useState<string | null>(null)
  const [controlCenterOpen, setControlCenterOpen] = useState(false)

  const beforeLeave = useRef<(()=>boolean)|null>(null)
  const setBeforeLeave=useCallback((guard:(()=>boolean)|null)=>{beforeLeave.current=guard},[])
  const openApp = (appId: string) => {
    if(appId!==currentApp && beforeLeave.current && !beforeLeave.current())return
    setCurrentApp(appId)
  }

  const closeApp = () => {
    if(beforeLeave.current && !beforeLeave.current())return
    setCurrentApp(null)
  }

  const lockDevice = () => {
    if(beforeLeave.current && !beforeLeave.current())return
    setIsLocked(true)
    setCurrentApp(null)
  }

  const unlockDevice = () => {
    setIsLocked(false)
  }

  const openControlCenter = () => {
    setControlCenterOpen(true)
  }

  const closeControlCenter = () => {
    setControlCenterOpen(false)
  }

  return (
    <AppStateContext.Provider
      value={{
        setBeforeLeave,
        isLocked,
        currentApp,
        controlCenterOpen,
        openApp,
        closeApp,
        lockDevice,
        unlockDevice,
        openControlCenter,
        closeControlCenter,
      }}
    >
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const context = useContext(AppStateContext)
  if (context === undefined) {
    throw new Error("useAppState must be used within an AppStateProvider")
  }
  return context
}
