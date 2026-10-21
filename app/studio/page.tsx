"use client"
import {useEffect,useState} from 'react'
import {PhoneEditor} from '@/components/phone-editor'
import {useContentStore} from '@/lib/content-store'
export default function Studio(){const [ready,setReady]=useState(false);useEffect(()=>{void useContentStore.getState().hydrate().then(()=>setReady(true))},[]);return <main className="preview-studio"><header><a href="/">← 返回手机</a><div><strong>预览编辑台</strong><p>修改仅保存在当前浏览器 · 与正式站独立</p></div></header><section>{ready?<PhoneEditor onBack={()=>{location.href='/'}}/>:<p>正在载入…</p>}</section></main>}
