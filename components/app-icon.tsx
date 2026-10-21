"use client"
import {motion} from 'framer-motion'
import {useAppState} from '@/lib/app-state'
import type {ReactNode} from 'react'
export function AppIcon({id,name,color='',icon,customIcon,size='normal',label=true}:{id:string;name:string;color?:string;icon?:string|ReactNode;customIcon?:ReactNode;size?:'normal'|'small';label?:boolean}){const {openApp}=useAppState();const now=new Date();return <div className={'spring-app '+(size==='small'?'spring-small':'')}><motion.button aria-label={name} className={'spring-icon '+color} whileTap={{scale:.85,filter:'brightness(.85)'}} onClick={()=>openApp(id)}>{customIcon||icon||(id==='calendar'?<span className="calendar-icon"><span>{now.toLocaleDateString('zh-CN',{weekday:'long'})}</span><b>{now.getDate()}</b></span>:<img src={'/icons/'+id+'.svg'} alt="" draggable={false} width={60} height={60}/>)}</motion.button>{label&&size==='normal'&&<span className="spring-label">{name}</span>}</div>}
