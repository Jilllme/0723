"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useAndroidAppState } from "@/lib/android-app-state"
import { AndroidStatusBar } from "./android-status-bar"
import {
  Wifi,
  Bluetooth,
  Flashlight,
  PlaneIcon as Airplane,
  RotateCcw,
  Volume2,
  Settings,
  Battery,
  X,
  MessageCircle,
  Mail,
  Calendar,
} from "lucide-react"
import { useState } from "react"

interface AndroidNotificationPanelProps {
  time: Date
}

export function AndroidNotificationPanel({ time }: AndroidNotificationPanelProps) {
  const { notificationPanelOpen, closeNotificationPanel, openQuickSettings } = useAndroidAppState()
  const [quickSettingsExpanded, setQuickSettingsExpanded] = useState(false)

  return (
    <AnimatePresence>
      {notificationPanelOpen && (
        <motion.div
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="absolute inset-0 z-50 bg-gray-900 text-white overflow-auto"
        >
          <AndroidStatusBar time={time} dark />

          {/* Quick Settings */}
          <div className="px-4 py-2">
            <div className="grid grid-cols-6 gap-3 mb-4">
              <QuickSettingsTile icon={Wifi} label="Wi-Fi" active />
              <QuickSettingsTile icon={Bluetooth} label="Bluetooth" active />
              <QuickSettingsTile icon={Flashlight} label="Flashlight" />
              <QuickSettingsTile icon={Airplane} label="Airplane" />
              <QuickSettingsTile icon={RotateCcw} label="Rotation" />
              <QuickSettingsTile icon={Volume2} label="Sound" active />
            </div>

            {quickSettingsExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="grid grid-cols-6 gap-3 mb-4"
              >
                <QuickSettingsTile icon={Battery} label="Battery" />
                <QuickSettingsTile icon={Settings} label="Settings" />
              </motion.div>
            )}

            <button
              onClick={() => setQuickSettingsExpanded(!quickSettingsExpanded)}
              className="w-full text-center text-blue-400 text-sm py-2"
            >
              {quickSettingsExpanded ? "Show less" : "Show more"}
            </button>
          </div>

          {/* Notifications */}
          <div className="px-4 py-2">
            <h3 className="text-sm font-medium mb-3 opacity-70">NOTIFICATIONS</h3>

            <div className="space-y-3">
              <NotificationItem
                icon={MessageCircle}
                app="Messages"
                title="New message from John"
                content="Hey, are we still on for lunch?"
                time="2 min ago"
                color="bg-green-500"
              />

              <NotificationItem
                icon={Mail}
                app="Gmail"
                title="Weekly report"
                content="Your weekly activity summary is ready"
                time="1 hour ago"
                color="bg-red-500"
              />

              <NotificationItem
                icon={Calendar}
                app="Calendar"
                title="Meeting reminder"
                content="Team standup in 15 minutes"
                time="15 min ago"
                color="bg-blue-500"
              />
            </div>
          </div>

          {/* Close gesture area */}
          <div className="flex justify-center py-4">
            <button onClick={closeNotificationPanel} className="w-12 h-1 bg-white/30 rounded-full" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function QuickSettingsTile({
  icon: Icon,
  label,
  active = false,
}: {
  icon: any
  label: string
  active?: boolean
}) {
  return (
    <button className={`flex flex-col items-center p-3 rounded-xl ${active ? "bg-blue-600" : "bg-gray-700"}`}>
      <Icon className="h-5 w-5 mb-1" />
      <span className="text-xs">{label}</span>
    </button>
  )
}

function NotificationItem({
  icon: Icon,
  app,
  title,
  content,
  time,
  color,
}: {
  icon: any
  app: string
  title: string
  content: string
  time: string
  color: string
}) {
  return (
    <div className="bg-gray-800 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center flex-shrink-0`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">{app}</span>
            <span className="text-xs opacity-60">{time}</span>
          </div>
          <div className="text-sm font-medium mb-1">{title}</div>
          <div className="text-sm opacity-80">{content}</div>
        </div>
        <button className="opacity-60 hover:opacity-100">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
