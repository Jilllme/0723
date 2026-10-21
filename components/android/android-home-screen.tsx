"use client"

import { useState, useEffect } from "react"
import { AndroidStatusBar } from "./android-status-bar"
import { AndroidAppIcon } from "./android-app-icon"
import { AndroidWidget } from "./android-widget"
import { motion, AnimatePresence } from "framer-motion"
import { useAndroidAppState } from "@/lib/android-app-state"
import { useAndroidWallpaper } from "@/lib/android-wallpaper-state"
import { Search, Mic } from "lucide-react"

interface AndroidHomeScreenProps {
  time: Date
}

export function AndroidHomeScreen({ time }: AndroidHomeScreenProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const { openNotificationPanel, openApp } = useAndroidAppState()
  const { getWallpaperGradient } = useAndroidWallpaper()
  const dayOfMonth = time.getDate()

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x < -50 && currentPage < 1) {
      setCurrentPage(currentPage + 1)
    } else if (info.offset.x > 50 && currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  // Handle swipe down for notifications
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY
      if (touchY < 60) {
        const handleTouchMove = (moveEvent: TouchEvent) => {
          const currentY = moveEvent.touches[0].clientY
          if (currentY - touchY > 50) {
            openNotificationPanel()
            document.removeEventListener("touchmove", handleTouchMove)
          }
        }
        document.addEventListener("touchmove", handleTouchMove, { once: true })
      }
    }

    document.addEventListener("touchstart", handleTouchStart)
    return () => document.removeEventListener("touchstart", handleTouchStart)
  }, [openNotificationPanel])

  return (
    <div
      className="h-full w-full flex flex-col relative"
      style={{
        background: getWallpaperGradient(),
      }}
    >
      <AndroidStatusBar time={time} dark />

      {/* Pages Container */}
      <motion.div
        className="flex-1 relative"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {currentPage === 0 && (
            <motion.div
              key="page-0"
              className="absolute inset-0 px-4 pt-4 pb-6 flex flex-col"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              {/* Google Search Widget */}
              <div className="mb-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-3 flex items-center shadow-lg">
                  <Search className="h-5 w-5 text-gray-600 mr-3" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="flex-1 bg-transparent outline-none text-gray-800"
                    readOnly
                  />
                  <Mic className="h-5 w-5 text-gray-600 ml-3" />
                </div>
              </div>

              {/* Weather Widget */}
              <div className="mb-6">
                <AndroidWidget
                  className="bg-white/20 backdrop-blur-md"
                  content={
                    <div className="text-white p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm opacity-80">Cupertino</div>
                          <div className="text-3xl font-light">22°C</div>
                          <div className="text-sm opacity-80">Sunny</div>
                        </div>
                        <div className="text-4xl">☀️</div>
                      </div>
                      <div className="flex justify-between mt-4 text-sm">
                        <span>H:27°</span>
                        <span>L:18°</span>
                      </div>
                    </div>
                  }
                />
              </div>

              {/* App Icons Grid */}
              <div className="grid grid-cols-4 gap-6 mb-6">
                <AndroidAppIcon id="phone" name="Phone" color="bg-green-500" />
                <AndroidAppIcon id="messages" name="Messages" color="bg-blue-500" />
                <AndroidAppIcon id="camera" name="Camera" color="bg-gray-800" />
                <AndroidAppIcon id="photos" name="Photos" color="bg-purple-500" />
              </div>

              <div className="grid grid-cols-4 gap-6 mb-6">
                <AndroidAppIcon id="chrome" name="Chrome" color="bg-red-500" />
                <AndroidAppIcon id="gmail" name="Gmail" color="bg-red-600" />
                <AndroidAppIcon id="maps" name="Maps" color="bg-green-600" />
                <AndroidAppIcon id="youtube" name="YouTube" color="bg-red-500" />
              </div>

              <div className="grid grid-cols-4 gap-6">
                <AndroidAppIcon id="settings" name="Settings" color="bg-gray-600" />
                <AndroidAppIcon id="clock" name="Clock" color="bg-blue-600" />
                <AndroidAppIcon id="calculator" name="Calculator" color="bg-orange-500" />
                <AndroidAppIcon id="music" name="Music" color="bg-orange-600" />
              </div>
            </motion.div>
          )}

          {currentPage === 1 && (
            <motion.div
              key="page-1"
              className="absolute inset-0 px-4 pt-4 pb-6 flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              {/* Calendar Widget */}
              <div className="mb-6">
                <AndroidWidget
                  className="bg-white/20 backdrop-blur-md"
                  content={
                    <div className="text-white p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm opacity-80">MONDAY</div>
                          <div className="text-4xl font-light">{dayOfMonth}</div>
                          <div className="text-sm opacity-80">December</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm opacity-80">2 events</div>
                          <div className="text-xs opacity-60 mt-1">Meeting at 2 PM</div>
                        </div>
                      </div>
                    </div>
                  }
                />
              </div>

              {/* More Apps */}
              <div className="grid grid-cols-4 gap-6 mb-6">
                <AndroidAppIcon id="notes" name="Keep" color="bg-yellow-500" />
                <AndroidAppIcon id="drive" name="Drive" color="bg-blue-500" />
                <AndroidAppIcon id="play-store" name="Play Store" color="bg-green-500" />
                <AndroidAppIcon id="contacts" name="Contacts" color="bg-blue-600" />
              </div>

              <div className="grid grid-cols-4 gap-6">
                <AndroidAppIcon id="calendar" name="Calendar" color="bg-blue-500" />
                <AndroidAppIcon id="files" name="Files" color="bg-gray-600" />
                <AndroidAppIcon id="weather" name="Weather" color="bg-blue-400" />
                <AndroidAppIcon id="assistant" name="Assistant" color="bg-purple-500" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Page Indicators */}
      <div className="flex justify-center mb-4">
        <div className="flex gap-2">
          <button
            className={`w-2 h-2 rounded-full ${currentPage === 0 ? "bg-white" : "bg-white/40"}`}
            onClick={() => setCurrentPage(0)}
          />
          <button
            className={`w-2 h-2 rounded-full ${currentPage === 1 ? "bg-white" : "bg-white/40"}`}
            onClick={() => setCurrentPage(1)}
          />
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-black/20 backdrop-blur-sm px-6 py-3">
        <div className="flex justify-center">
          <div className="flex gap-8">
            <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm" />
            <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm" />
            <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm" />
          </div>
        </div>
      </div>
    </div>
  )
}
