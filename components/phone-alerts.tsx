"use client"
import {useEffect,useRef,useState} from 'react'
import {Bell,MessageCircle,Phone,PhoneOff,X} from 'lucide-react'
import {useCollabStore} from '@/lib/collab-store'
import {useContentView} from '@/lib/content-store'
import {useAppState} from '@/lib/app-state'

export function PhoneAlerts(){
 const notice=useCollabStore(s=>s.notification),dismiss=useCollabStore(s=>s.dismiss)
 const {contacts,profile}=useContentView();const {openApp}=useAppState()
 const [answered,setAnswered]=useState(false);const last=useRef('')
 const who=notice?.sender==='self'?profile.name:contacts.find(c=>c.id===notice?.contact_id)?.name||'未知联系人'
 useEffect(()=>{if(!notice||last.current===notice.id)return;last.current=notice.id;setAnswered(false)
   if(typeof Notification!=='undefined'&&Notification.permission==='granted'&&document.visibilityState==='hidden'){
    try{const n=new Notification(notice.kind==='call'?`${who} · 模拟来电`:`微信 · ${who}`,{body:notice.kind==='call'?'你的模拟手机收到一通来电。':notice.text,tag:'phone-'+notice.id});n.onclick=()=>{window.focus();n.close()}}catch{}
   }
   if(notice.kind==='wechat'){const t=setTimeout(()=>{if(useCollabStore.getState().notification?.id===notice.id)dismiss()},5500);return()=>clearTimeout(t)}
 },[notice,who,dismiss])
 if(!notice)return null
 if(notice.kind==='call')return <div className="incoming-shade" role="dialog" aria-modal="true" aria-label="模拟来电"><div className="incoming-body"><div className="incoming-top"><span>JEREMY PHONE · 模拟通话</span><b>{who}</b><small>{answered?'模拟通话中 · 未连接真实电话':'邀请你接听来电'}</small></div><div className="incoming-actions">{!answered&&<button onClick={dismiss} className="reject"><PhoneOff size={25}/><span>拒绝</span></button>}{answered?<button onClick={dismiss} className="reject"><PhoneOff size={25}/><span>结束</span></button>:<button onClick={()=>setAnswered(true)} className="accept"><Phone size={25}/><span>接听</span></button>}</div></div></div>
 return <button className="incoming-banner" onClick={()=>{dismiss();openApp('wechat')}} aria-label="打开微信查看新消息"><span className="incoming-logo"><MessageCircle size={19}/></span><span><small>微信 · 刚刚</small><b>{who}</b><span>{notice.text}</span></span><X size={15} onClick={e=>{e.stopPropagation();dismiss()}}/></button>
}
