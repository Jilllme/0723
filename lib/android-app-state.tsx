"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type AndroidAppState = {
  isLocked: boolean
  currentApp: string | null
  notificationPanelOpen: boolean
  quickSettingsOpen: boolean
  recentAppsOpen: boolean
  openApp: (appId: string) => void
  closeApp: () => void
  lockDevice: () => void
  unlockDevice: () => void
  openNotificationPanel: () => void
  closeNotificationPanel: () => void
  openQuickSettings: () => void
  closeQuickSettings: () => void
  openRecentApps: () => void
  closeRecentApps: () => void
}

const AndroidAppStateContext = createContext<AndroidAppState | undefined>(undefined)

export function AndroidAppStateProvider({ children }: { children: ReactNode }) {
  const [isLocked, setIsLocked] = useState(false)
  const [currentApp, setCurrentApp] = useState<string | null>(null)
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false)
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false)
  const [recentAppsOpen, setRecentAppsOpen] = useState(false)

  const openApp = (appId: string) => {
    setCurrentApp(appId)
    setNotificationPanelOpen(false)
    setQuickSettingsOpen(false)
    setRecentAppsOpen(false)
  }

  const closeApp = () => {
    setCurrentApp(null)
  }

  const lockDevice = () => {
    setIsLocked(true)
    setCurrentApp(null)
    setNotificationPanelOpen(false)
    setQuickSettingsOpen(false)
    setRecentAppsOpen(false)
  }

  const unlockDevice = () => {
    setIsLocked(false)
  }

  const openNotificationPanel = () => {
    setNotificationPanelOpen(true)
    setQuickSettingsOpen(false)
    setRecentAppsOpen(false)
  }

  const closeNotificationPanel = () => {
    setNotificationPanelOpen(false)
  }

  const openQuickSettings = () => {
    setQuickSettingsOpen(true)
    setNotificationPanelOpen(false)
    setRecentAppsOpen(false)
  }

  const closeQuickSettings = () => {
    setQuickSettingsOpen(false)
  }

  const openRecentApps = () => {
    setRecentAppsOpen(true)
    setNotificationPanelOpen(false)
    setQuickSettingsOpen(false)
  }

  const closeRecentApps = () => {
    setRecentAppsOpen(false)
  }

  return (
    <AndroidAppStateContext.Provider
      value={{
        isLocked,
        currentApp,
        notificationPanelOpen,
        quickSettingsOpen,
        recentAppsOpen,
        openApp,
        closeApp,
        lockDevice,
        unlockDevice,
        openNotificationPanel,
        closeNotificationPanel,
        openQuickSettings,
        closeQuickSettings,
        openRecentApps,
        closeRecentApps,
      }}
    >
      {children}
    </AndroidAppStateContext.Provider>
  )
}

export function useAndroidAppState() {
  const context = useContext(AndroidAppStateContext)
  if (context === undefined) {
    throw new Error("useAndroidAppState must be used within an AndroidAppStateProvider")
  }
  return context
}
