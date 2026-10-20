"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AndroidStatusBar } from "./android-status-bar"
import { formatDate, formatTime } from "@/lib/utils"
import { useAndroidAppState } from "@/lib/android-app-state"
import { Lock, Camera, Phone } from "lucide-react"

interface AndroidLockScreenProps {
  time: Date
}

export function AndroidLockScreen({ time }: AndroidLockScreenProps) {
  const { unlockDevice } = useAndroidAppState()
  const [swipeProgress, setSwipeProgress] = useState(0)

  const handleDragEnd = () => {
    if (swipeProgress > 0.3) {
      unlockDevice()
    }
    setSwipeProgress(0)
  }

  return (
    <div
      className="relative h-full w-full flex flex-col"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <AndroidStatusBar time={time} dark />

      {/* Lock screen content */}
      <div className="flex-1 flex flex-col items-center justify-center text-white px-6">
        {/* Time */}
        <div className="text-center mb-8">
          <div className="text-6xl font-light mb-2">{formatTime(time)}</div>
          <div className="text-lg opacity-80">{formatDate(time)}</div>
        </div>

        {/* Notifications preview */}
        <div className="w-full max-w-sm space-y-2 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-white text-sm">M</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">Messages</div>
                <div className="text-xs opacity-80">2 new messages</div>
              </div>
              <div className="text-xs opacity-60">now</div>
            </div>
          </div>
        </div>

        {/* Unlock hint */}
        <div className="text-center opacity-80 mb-4">
          <p className="text-sm">Swipe up to unlock</p>
        </div>
      </div>

      {/* Bottom shortcuts and unlock gesture */}
      <div className="relative pb-8">
        {/* Shortcuts */}
        <div className="flex justify-between items-center px-12 mb-6">
          <button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Camera className="h-6 w-6 text-white" />
          </button>
          <button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Phone className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Unlock gesture area */}
        <motion.div
          className="flex justify-center"
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.1}
          onDrag={(_, info) => {
            const progress = Math.min(Math.max(-info.offset.y / 100, 0), 1)
            setSwipeProgress(progress)
          }}
          onDragEnd={handleDragEnd}
        >
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <div className="w-8 h-1 bg-white/40 rounded-full" />
          </div>
        </motion.div>
      </div>

      {/* Overlay that fades out as you swipe */}
      <motion.div
        className="absolute inset-0 bg-black pointer-events-none"
        style={{ opacity: 0.2 - swipeProgress * 0.2 }}
      />
    </div>
  )
}
