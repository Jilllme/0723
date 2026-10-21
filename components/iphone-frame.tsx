"use client"
import type {ReactNode} from 'react'
import {useAppState} from '@/lib/app-state'
import {usePhoneStore} from '@/lib/phone-store'
export function IPhoneFrame({children}:{children?:ReactNode;className?:string}){const {lockDevice,openApp}=useAppState();const playing=usePhoneStore(s=>s.playing);const brightness=usePhoneStore(s=>s.brightness);return <div className="phone-device"><div className="phone-bezel"><div className="phone-screen">{children}<button aria-label={playing?'返回音乐':'锁定手机'} className={'dynamic-pill '+(playing?'pill-playing':'')} onClick={()=>playing?openApp('music'):lockDevice()}>{playing&&<><span className="pill-art"/><span className="sound-bars"><i/><i/><i/><i/></span></>}</button><div className="screen-dimmer" style={{opacity:(1-brightness)*.7}}/></div></div><span className="side-volume one"/><span className="side-volume two"/><button className="side-power" aria-label="锁定手机" onClick={lockDevice}/></div>}
