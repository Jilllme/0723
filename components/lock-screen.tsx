"use client"
import {useRef,useState} from 'react'
import {StatusBar} from './status-bar'
import {useAppState} from '@/lib/app-state'
import {Camera,Flashlight,Globe2,ListTodo} from 'lucide-react'

export function LockScreen({time}:{time:Date}){
 const {unlockDevice}=useAppState()
 const [passcode,setPasscode]=useState(false)
 const [digits,setDigits]=useState('')
 const [flash,setFlash]=useState(false)
 const [error,setError]=useState(false)
 const [language,setLanguage]=useState(false)
 const touchStart=useRef<number|null>(null)
 const openPassword=()=>{setPasscode(true);setDigits('');setError(false)}
 const press=(n:string)=>{
   if(digits.length>=4)return
   const value=digits+n
   setDigits(value)
   if(value.length===4){
     // Visual-only preview. This branch must not change or attempt to validate production credentials.
     setTimeout(()=>{setDigits('');setError(true)},250)
   }
 }
 return <div className={'reference-lock '+(passcode?'reference-passcode':'')} onTouchStart={e=>{touchStart.current=e.touches[0].clientY}} onTouchEnd={e=>{if(!passcode&&touchStart.current!==null&&touchStart.current-e.changedTouches[0].clientY>45)openPassword();touchStart.current=null}}>
 <div className="reference-background"/>
 <StatusBar time={time} dark/>
 {!passcode?<>
   <div className="reference-clock">
     <div className="reference-date">{time.toLocaleDateString('zh-CN',{month:'long',day:'numeric',weekday:'long'})}</div>
     <div className="reference-bigtime">{time.toLocaleTimeString('en-GB',{hour:'numeric',minute:'2-digit'})}</div>
     <button className="reference-language" onClick={()=>setLanguage(!language)}><Globe2 size={15}/>{language?'English':'简体中文'}</button>
   </div>
   <div className="reference-notification"><div className="reference-reminder-icon"><ListTodo size={24}/></div><div className="reference-notification-text"><strong>张极的生日 🎂</strong><div>2月3日 · 生日提醒</div></div><span className="reference-notification-now">现在</span></div>
   <div className="reference-lock-actions">
     <button aria-label="手电筒" aria-pressed={flash} onClick={()=>setFlash(!flash)}><Flashlight size={22}/></button>
     <button aria-label="打开密码输入" className="reference-unlock-label" onClick={openPassword}>向上轻扫以打开</button>
     <button aria-label="相机" onClick={openPassword}><Camera size={24}/></button>
   </div>
   <button className="reference-home-line-button" aria-label="上滑解锁" onClick={openPassword}><span/></button>
 </>:<>
   <div className="reference-passcode-content">
     <h1>输入密码</h1>
     <div className="reference-dots" aria-label={'已输入'+digits.length+'位密码'}>{[0,1,2,3].map(i=><i key={i} className={i<digits.length?'filled':''}/>)}</div>
     <div className="reference-numpad">{['1','2','3','4','5','6','7','8','9','','0',''].map((n,i)=>n?<button key={i} onClick={()=>press(n)}><strong>{n}</strong><small>{({2:'ABC',3:'DEF',4:'GHI',5:'JKL',6:'MNO',7:'PQRS',8:'TUV',9:'WXYZ'} as Record<number,string>)[Number(n)]||'\u00a0'}</small></button>:<span key={i}/>)}</div>
     {error&&<p className="reference-passcode-error">这只是视觉预览，未连接正式锁屏密码。</p>}
   </div>
   <div className="reference-passcode-footer"><button onClick={()=>setError(true)}>紧急情况</button><button onClick={()=>digits?setDigits(digits.slice(0,-1)):(setPasscode(false),setError(false))}>{digits?'删除':'取消'}</button></div>
   <button className="reference-home-line-button" aria-label="返回锁屏" onClick={()=>{setPasscode(false);setDigits('')}}><span/></button>
 </>}
 </div>
}