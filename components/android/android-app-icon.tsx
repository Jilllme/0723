"use client"

import { motion } from "framer-motion"
import { useAndroidAppState } from "@/lib/android-app-state"
import {
  Phone,
  MessageCircle,
  Camera,
  ImageIcon,
  Chrome,
  Mail,
  MapPin,
  Play,
  Settings,
  Clock,
  Calculator,
  Music,
  StickyNote,
  HardDrive,
  ShoppingBag,
  Users,
  Calendar,
  FileText,
  CloudRain,
  Mic,
} from "lucide-react"

interface AndroidAppIconProps {
  id: string
  name: string
  color: string
  size?: "normal" | "small"
}

export function AndroidAppIcon({ id, name, color, size = "normal" }: AndroidAppIconProps) {
  const { openApp } = useAndroidAppState()

  const getIcon = () => {
    const iconMap = {
      phone: Phone,
      messages: MessageCircle,
      camera: Camera,
      photos: ImageIcon,
      chrome: Chrome,
      gmail: Mail,
      maps: MapPin,
      youtube: Play,
      settings: Settings,
      clock: Clock,
      calculator: Calculator,
      music: Music,
      notes: StickyNote,
      drive: HardDrive,
      "play-store": ShoppingBag,
      contacts: Users,
      calendar: Calendar,
      files: FileText,
      weather: CloudRain,
      assistant: Mic,
    }

    const IconComponent = iconMap[id as keyof typeof iconMap] || Settings
    return <IconComponent className="h-6 w-6 text-white" />
  }

  return (
    <div className="flex flex-col items-center">
      <motion.div
        className={`${color} rounded-2xl shadow-lg flex items-center justify-center cursor-pointer`}
        style={{
          width: size === "small" ? "48px" : "56px",
          height: size === "small" ? "48px" : "56px",
        }}
        whileTap={{ scale: 0.9 }}
        onClick={() => openApp(id)}
      >
        {getIcon()}
      </motion.div>
      {size === "normal" && <div className="text-xs text-white mt-2 text-center max-w-[60px] truncate">{name}</div>}
    </div>
  )
}
