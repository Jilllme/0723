import { Battery, Signal, Wifi } from "lucide-react"
import { formatTime } from "@/lib/utils"

interface AndroidStatusBarProps {
  time: Date
  dark?: boolean
}

export function AndroidStatusBar({ time, dark = false }: AndroidStatusBarProps) {
  return (
    <div
      className={`flex justify-between items-center px-4 py-2 text-sm font-medium ${
        dark ? "text-white" : "text-black"
      }`}
    >
      <div className="flex items-center gap-1">
        <div>{formatTime(time, false)}</div>
      </div>
      <div className="flex items-center gap-1">
        <Signal className="h-4 w-4" />
        <Wifi className="h-4 w-4" />
        <div className="flex items-center">
          <Battery className="h-4 w-4" />
          <span className="text-xs ml-1">85%</span>
        </div>
      </div>
    </div>
  )
}
