"use client"
import {useEffect,useState} from 'react'
import {HomeScreen} from '@/components/home-screen'
import {AppView} from '@/components/app-view'
import {IPhoneFrame} from '@/components/iphone-frame'
import {useAppState} from '@/lib/app-state'
import {useContentStore} from '@/lib/content-store'
import {usePhoneStore} from '@/lib/phone-store'
export default function HomePreview(){
 const {currentApp,closeApp}=useAppState()
 const [time,setTime]=useState<Date|null>(null)
 useEffect(()=>{
   usePhoneStore.persist.rehydrate()
   void useContentStore.getState().hydrate()
   setTime(new Date())
   const t=setInterval(()=>setTime(new Date()),10000)
   return()=>clearInterval(t)
 },[])
 if(!time)return <main className="phone-stage"><p>载入桌面预览…</p></main>
 return <main className="phone-stage home-preview-stage"><IPhoneFrame><div className="home-preview-surface">{currentApp?<div className="home-preview-app"><button className="home-preview-back" onClick={closeApp}>‹ 返回桌面</button><AppView appId={currentApp}/></div>:<HomeScreen time={time}/>}</div></IPhoneFrame></main>
}
