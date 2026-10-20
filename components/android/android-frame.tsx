import type React from "react"

interface AndroidFrameProps {
  children?: React.ReactNode
  className?: string
}

export function AndroidFrame({ children, className = "" }: AndroidFrameProps) {
  return (
    <div className="relative w-full max-w-[375px] aspect-[375/812] mx-auto">
      {/* Android outer frame */}
      <div className="absolute inset-0 rounded-[25px] bg-black shadow-2xl">
        {/* Screen */}
        <div className="absolute inset-[2px] rounded-[23px] bg-black overflow-hidden">
          {/* Content area */}
          <div className="w-full h-full rounded-[21px] overflow-hidden bg-white">{children}</div>
        </div>

        {/* Power button */}
        <div className="absolute right-[-2px] top-[120px] w-[3px] h-[60px] bg-gray-800 rounded-r-sm" />

        {/* Volume buttons */}
        <div className="absolute left-[-2px] top-[100px] w-[3px] h-[40px] bg-gray-800 rounded-l-sm" />
        <div className="absolute left-[-2px] top-[150px] w-[3px] h-[40px] bg-gray-800 rounded-l-sm" />
      </div>
    </div>
  )
}
