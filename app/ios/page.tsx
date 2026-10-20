"use client"
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { LockScreen } from "@/components/lock-screen"
import { HomeScreen } from "@/components/home-screen"
import { AppView } from "@/components/app-view"
import {useCollabStore} from "@/lib/collab-store"
import {PhoneAlerts} from "@/components/phone-alerts"
import {useContentStore} from "@/lib/content-store"
import { usePhoneStore } from "@/lib/phone-store"
import { useAppState } from "@/lib/app-state"
import { IPhoneFrame } from "@/components/iphone-frame"
import { ControlCenter } from "@/components/control-center/control-center"
export default function Phone(){
 const content=useContentStore(s=>s.data);const contentReady=useContentStore(s=>s.ready);
 const {currentApp,isLocked,closeApp,closeControlCenter}=useAppState();const wallpaper=usePhoneStore(s=>s.wallpaper);const [time,setTime]=useState<Date|null>(null)
 useEffect(()=>{usePhoneStore.persist.rehydrate();void useContentStore.getState().hydrate().then(()=>useCollabStore.getState().start());setTime(new Date());const t=setInterval(()=>setTime(new Date()),1000);return()=>{clearInterval(t);useCollabStore.getState().stop()}},[])
 useEffect(()=>{const handler=(e:KeyboardEvent)=>{if(e.key==='Escape'){closeApp();closeControlCenter()}};document.addEventListener('keydown',handler);return()=>document.removeEventListener('keydown',handler)},[closeApp,closeControlCenter])
 if(!time||!contentReady)return <main className="phone-stage"><p className="text-sm text-gray-500">正在打开手机…</p></main>
 return <main className="phone-stage"><IPhoneFrame><div className={"relative h-full overflow-hidden phone-wallpaper wallpaper-"+wallpaper} style={content.profile.wallpaper?{backgroundImage:`url(${content.profile.wallpaper})`,backgroundSize:"cover",backgroundPosition:"center"}:undefined}><AnimatePresence mode="wait"><motion.div key={isLocked?'lock':currentApp||'home'} initial={{opacity:0,scale:.98}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:1.02}} transition={{duration:.18}} className="absolute inset-0">{isLocked?<LockScreen time={time}/>:currentApp?<AppView appId={currentApp}/>:<HomeScreen time={time}/>}</motion.div></AnimatePresence><ControlCenter/><PhoneAlerts/></div></IPhoneFrame></main>
}
