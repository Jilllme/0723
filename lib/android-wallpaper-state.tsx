"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type AndroidWallpaperTheme = "blue" | "purple" | "green" | "orange" | "pink"

type AndroidWallpaperState = {
  wallpaper: AndroidWallpaperTheme
  setWallpaper: (theme: AndroidWallpaperTheme) => void
  getWallpaperGradient: () => string
}

const AndroidWallpaperContext = createContext<AndroidWallpaperState | undefined>(undefined)

const wallpaperGradients = {
  blue: "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)",
  purple: "linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)",
  green: "linear-gradient(135deg, #00b894 0%, #00a085 100%)",
  orange: "linear-gradient(135deg, #fd79a8 0%, #e84393 100%)",
  pink: "linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)",
}

export function AndroidWallpaperProvider({ children }: { children: ReactNode }) {
  const [wallpaper, setWallpaper] = useState<AndroidWallpaperTheme>("blue")

  const getWallpaperGradient = () => {
    return wallpaperGradients[wallpaper]
  }

  return (
    <AndroidWallpaperContext.Provider
      value={{
        wallpaper,
        setWallpaper,
        getWallpaperGradient,
      }}
    >
      {children}
    </AndroidWallpaperContext.Provider>
  )
}

export function useAndroidWallpaper() {
  const context = useContext(AndroidWallpaperContext)
  if (context === undefined) {
    throw new Error("useAndroidWallpaper must be used within an AndroidWallpaperProvider")
  }
  return context
}
