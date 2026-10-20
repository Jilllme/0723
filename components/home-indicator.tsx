"use client"
import {useRef,type ReactNode} from 'react'
import {useAppState} from '@/lib/app-state'
export function HomeIndicator({children}:{children:ReactNode}){const {closeApp}=useAppState();const start=useRef<number|null>(null);return <div className="relative h-full w-full overflow-hidden">{children}<button aria-label="返回主屏幕" onClick={closeApp} onTouchStart={e=>{start.current=e.touches[0].clientY;e.stopPropagation()}} onTouchEnd={e=>{if(start.current!==null&&start.current-e.changedTouches[0].clientY>15)closeApp();start.current=null}} className="home-gesture text-gray-500"><span/></button></div>}
