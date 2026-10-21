"use client"
import {memo} from 'react'
import {HomeIndicator} from "./home-indicator"
import {JeremyApp} from "./jeremy-apps"
import {StatusBar} from "./status-bar"
export const AppView=memo(function AppView({appId}:{appId:string}){return <HomeIndicator><div className="h-full flex flex-col bg-[#f6f6f6] text-black"><div className="h-[49px] shrink-0"><StatusBar time={new Date()}/></div><div className="flex-1 min-h-0 overflow-hidden pb-6"><JeremyApp id={appId}/></div></div></HomeIndicator>})
