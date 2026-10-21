"use client"

import { useState } from "react"
import { ImageIcon, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAndroidWallpaper } from "@/lib/android-wallpaper-state"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"

const wallpaperOptions = [
  { id: "blue", name: "Ocean Blue", gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)" },
  { id: "purple", name: "Royal Purple", gradient: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)" },
  { id: "green", name: "Forest Green", gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)" },
  { id: "orange", name: "Sunset Orange", gradient: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)" },
  { id: "pink", name: "Rose Pink", gradient: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)" },
]

export function AndroidWallpaperSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const { currentWallpaper, setWallpaper } = useAndroidWallpaper()
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const handleWallpaperChange = (wallpaperId: string) => {
    setWallpaper(wallpaperId)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className={`rounded-full border transition-all duration-200 ${
          isDark
            ? "bg-gray-800/80 border-gray-600/50 hover:bg-gray-700/80 text-gray-200"
            : "bg-white/80 border-gray-300/50 hover:bg-gray-100/80 text-gray-700"
        } backdrop-blur-sm`}
      >
        <ImageIcon className={`h-5 w-5 ${isDark ? "text-gray-200" : "text-gray-700"}`} />
        <span className="sr-only">Change wallpaper</span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className={`absolute right-0 top-12 z-50 min-w-[200px] rounded-lg border shadow-lg ${
                isDark
                  ? "bg-gray-800/95 border-gray-600/50 text-gray-200"
                  : "bg-white/95 border-gray-300/50 text-gray-700"
              } backdrop-blur-md`}
            >
              <div className="p-2">
                <div className={`px-3 py-2 text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  Choose Wallpaper
                </div>
                {wallpaperOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleWallpaperChange(option.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                      currentWallpaper === option.id
                        ? isDark
                          ? "bg-gray-700/80 text-gray-100"
                          : "bg-gray-100/80 text-gray-900"
                        : isDark
                          ? "hover:bg-gray-700/50 text-gray-200"
                          : "hover:bg-gray-50/80 text-gray-700"
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ background: option.gradient }}
                    />
                    <span>{option.name}</span>
                    {currentWallpaper === option.id && (
                      <Check className={`ml-auto h-4 w-4 ${isDark ? "text-blue-400" : "text-blue-500"}`} />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
