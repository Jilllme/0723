"use client"

import { motion } from "framer-motion"
import { ArrowLeft, MoreVertical } from "lucide-react"
import { useAndroidAppState } from "@/lib/android-app-state"
import { AndroidStatusBar } from "./android-status-bar"

interface AndroidAppViewProps {
  appId: string
  time: Date
}

export function AndroidAppView({ appId, time }: AndroidAppViewProps) {
  const { closeApp } = useAndroidAppState()

  const getAppContent = () => {
    switch (appId) {
      case "phone":
        return <PhoneApp />
      case "messages":
        return <MessagesApp />
      case "camera":
        return <CameraApp />
      case "settings":
        return <SettingsApp />
      case "chrome":
        return <ChromeApp />
      case "gmail":
        return <GmailApp />
      case "maps":
        return <MapsApp />
      case "youtube":
        return <YouTubeApp />
      case "clock":
        return <ClockApp />
      case "calculator":
        return <CalculatorApp />
      case "music":
        return <MusicApp />
      case "photos":
        return <PhotosApp />
      default:
        return <DefaultApp appId={appId} />
    }
  }

  const getAppName = () => {
    const names: { [key: string]: string } = {
      phone: "Phone",
      messages: "Messages",
      camera: "Camera",
      settings: "Settings",
      chrome: "Chrome",
      gmail: "Gmail",
      maps: "Maps",
      youtube: "YouTube",
      clock: "Clock",
      calculator: "Calculator",
      music: "Music",
      photos: "Photos",
    }
    return names[appId] || appId
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="h-full w-full bg-white flex flex-col"
    >
      <AndroidStatusBar time={time} />

      {/* App Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <button onClick={closeApp} className="p-2 -ml-2">
          <ArrowLeft className="h-6 w-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-medium text-gray-900">{getAppName()}</h1>
        <button className="p-2 -mr-2">
          <MoreVertical className="h-6 w-6 text-gray-700" />
        </button>
      </div>

      {/* App Content */}
      <div className="flex-1 overflow-auto">{getAppContent()}</div>
    </motion.div>
  )
}

// Sample app components
function PhoneApp() {
  return (
    <div className="p-4">
      <div className="text-center mb-8">
        <div className="text-4xl font-light mb-4">Phone</div>
        <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map((key) => (
            <button
              key={key}
              className="aspect-square rounded-full bg-gray-100 flex items-center justify-center text-xl font-medium hover:bg-gray-200"
            >
              {key}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function MessagesApp() {
  return (
    <div className="p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
            J
          </div>
          <div className="flex-1">
            <div className="font-medium">John Doe</div>
            <div className="text-sm text-gray-600">Hey, how are you?</div>
          </div>
          <div className="text-xs text-gray-500">2:30 PM</div>
        </div>

        <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
          <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-medium">
            S
          </div>
          <div className="flex-1">
            <div className="font-medium">Sarah Wilson</div>
            <div className="text-sm text-gray-600">Thanks for the help!</div>
          </div>
          <div className="text-xs text-gray-500">1:15 PM</div>
        </div>
      </div>
    </div>
  )
}

function CameraApp() {
  return (
    <div className="bg-black h-full flex items-center justify-center">
      <div className="text-white text-center">
        <div className="w-24 h-24 rounded-full border-4 border-white mb-4 mx-auto"></div>
        <div className="text-lg">Camera</div>
        <div className="text-sm opacity-70">Tap to take photo</div>
      </div>
    </div>
  )
}

function SettingsApp() {
  return (
    <div className="p-4">
      <div className="space-y-1">
        {[
          "Network & internet",
          "Connected devices",
          "Apps",
          "Notifications",
          "Battery",
          "Storage",
          "Sound & vibration",
          "Display",
          "Wallpaper & style",
          "Security",
          "Privacy",
          "Location",
          "Safety & emergency",
          "Passwords & accounts",
          "Digital Wellbeing",
          "Google",
          "System",
        ].map((setting) => (
          <div key={setting} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
            <span className="text-gray-900">{setting}</span>
            <ArrowLeft className="h-5 w-5 text-gray-400 rotate-180" />
          </div>
        ))}
      </div>
    </div>
  )
}

function ChromeApp() {
  return (
    <div className="p-4">
      <div className="bg-gray-100 rounded-lg p-4 mb-4">
        <div className="text-center text-gray-600">
          <div className="text-2xl mb-2">🌐</div>
          <div>Chrome Browser</div>
          <div className="text-sm mt-2">Search or type web address</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">📰</div>
          <div className="text-sm">News</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">🛒</div>
          <div className="text-sm">Shopping</div>
        </div>
      </div>
    </div>
  )
}

function GmailApp() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <div className="border-l-4 border-blue-500 bg-gray-50 p-4 rounded-r-lg">
          <div className="flex justify-between items-start mb-2">
            <div className="font-medium">Google</div>
            <div className="text-xs text-gray-500">10:30 AM</div>
          </div>
          <div className="text-sm font-medium mb-1">Welcome to Gmail</div>
          <div className="text-sm text-gray-600">Get started with your new Gmail account...</div>
        </div>

        <div className="border-l-4 border-green-500 bg-gray-50 p-4 rounded-r-lg">
          <div className="flex justify-between items-start mb-2">
            <div className="font-medium">Team</div>
            <div className="text-xs text-gray-500">9:15 AM</div>
          </div>
          <div className="text-sm font-medium mb-1">Weekly Update</div>
          <div className="text-sm text-gray-600">Here's what happened this week...</div>
        </div>
      </div>
    </div>
  )
}

function MapsApp() {
  return (
    <div className="bg-green-100 h-full flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🗺️</div>
        <div className="text-lg font-medium">Google Maps</div>
        <div className="text-sm text-gray-600 mt-2">Explore places around you</div>
      </div>
    </div>
  )
}

function YouTubeApp() {
  return (
    <div className="p-4">
      <div className="space-y-4">
        <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-4xl mb-2">▶️</div>
            <div>Video Player</div>
          </div>
        </div>
        <div>
          <div className="font-medium mb-2">Recommended Videos</div>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-24 h-16 bg-gray-200 rounded flex-shrink-0"></div>
              <div className="flex-1">
                <div className="text-sm font-medium">Sample Video Title</div>
                <div className="text-xs text-gray-600">Channel Name • 1M views</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ClockApp() {
  return (
    <div className="p-4 text-center">
      <div className="mb-8">
        <div className="text-6xl font-light mb-4">12:34</div>
        <div className="text-lg text-gray-600">Monday, December 11</div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl mb-2">⏰</div>
          <div className="text-xs">Alarm</div>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-2">🌍</div>
          <div className="text-xs">Clock</div>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-2">⏱️</div>
          <div className="text-xs">Timer</div>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-2">⏲️</div>
          <div className="text-xs">Stopwatch</div>
        </div>
      </div>
    </div>
  )
}

function CalculatorApp() {
  return (
    <div className="p-4">
      <div className="bg-gray-100 rounded-lg p-4 mb-4 text-right">
        <div className="text-3xl font-light">0</div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {["C", "±", "%", "÷", "7", "8", "9", "×", "4", "5", "6", "-", "1", "2", "3", "+", "0", ".", "="].map(
          (btn, i) => (
            <button
              key={i}
              className={`aspect-square rounded-lg flex items-center justify-center text-lg font-medium ${
                ["C", "±", "%"].includes(btn)
                  ? "bg-gray-300"
                  : ["÷", "×", "-", "+", "="].includes(btn)
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200"
              } ${btn === "0" ? "col-span-2" : ""}`}
            >
              {btn}
            </button>
          ),
        )}
      </div>
    </div>
  )
}

function MusicApp() {
  return (
    <div className="p-4">
      <div className="text-center mb-8">
        <div className="w-48 h-48 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg mx-auto mb-4 flex items-center justify-center">
          <div className="text-white text-6xl">🎵</div>
        </div>
        <div className="text-lg font-medium mb-1">Song Title</div>
        <div className="text-gray-600">Artist Name</div>
      </div>
      <div className="flex justify-center items-center gap-8">
        <button className="text-2xl">⏮️</button>
        <button className="text-4xl">▶️</button>
        <button className="text-2xl">⏭️</button>
      </div>
    </div>
  )
}

function PhotosApp() {
  return (
    <div className="p-4">
      <div className="grid grid-cols-3 gap-1">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="aspect-square bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  )
}

function DefaultApp({ appId }: { appId: string }) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="text-4xl mb-4">📱</div>
        <div className="text-lg font-medium capitalize">{appId}</div>
        <div className="text-gray-600 mt-2">App content goes here</div>
      </div>
    </div>
  )
}
