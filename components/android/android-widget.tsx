import type { ReactNode } from "react"

interface AndroidWidgetProps {
  content: ReactNode
  className?: string
}

export function AndroidWidget({ content, className = "" }: AndroidWidgetProps) {
  return <div className={`rounded-2xl shadow-lg ${className}`}>{content}</div>
}
