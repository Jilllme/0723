"use client"
import {useRef,useState} from 'react'
import {StatusBar} from './status-bar'
import {useAppState} from '@/lib/app-state'
import {Camera,Flashlight,LockKeyhole,ChevronUp} from 'lucide-react'
export function LockScreen({time}:{time:Date}){
 const {unlockDevice,openApp}=useAppState();const [flash,setFlash]=useState(false);const start=useRef<number|null>(null)
 return <div className={'lock-screen '+(flash?'flash-preview':'')} onTouchStart={e=>{start.current=e.touches[0].clientY}} onTouchEnd={e=>{if(start.current!==null&&start.current-e.changedTouches[0].clientY>45)unlockDevice();start.current=null}}>
 <StatusBar time={time} dark/><div className="lock-clock"><LockKeyhole size={19} strokeWidth={2}/><p>{time.toLocaleDateString('zh-CN',{month:'long',day:'numeric',weekday:'long'})}</p><strong>{time.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}</strong></div>
 <div className="lock-quiet"><span>保持热爱，去见山海。</span></div>
 <div className="lock-bottom"><button aria-label="手电筒预览" aria-pressed={flash} onClick={()=>setFlash(!flash)} className={flash?'selected':''}><Flashlight size={22}/></button><button className="unlock-label" onClick={unlockDevice}><ChevronUp size={16}/>轻点或上滑打开</button><button aria-label="打开相机" onClick={()=>{unlockDevice();openApp('camera')}}><Camera size={23}/></button></div><button aria-label="解锁手机" onClick={unlockDevice} className="home-gesture"><span/></button></div>
}
