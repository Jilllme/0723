"use client"
import {useState} from 'react'
import {BellRing,Check,Cloud,LogIn,LogOut,PhoneCall,RefreshCw,Send,Users} from 'lucide-react'
import {useCollabStore} from '@/lib/collab-store'
import {useContentView} from '@/lib/content-store'

export function CollabPanel({compact=false}:{compact?:boolean}){
 const sync=useCollabStore();const {contacts,profile}=useContentView()
 const [email,setEmail]=useState(''),[code,setCode]=useState(''),[sent,setSent]=useState(false),[contact,setContact]=useState(''),[sender,setSender]=useState<'self'|'other'>('other'),[message,setMessage]=useState('')
 const [busy,setBusy]=useState(false),[feedback,setFeedback]=useState(''),[error,setError]=useState('');const [alertsEnabled,setAlertsEnabled]=useState(false)
 const chosen=contact||contacts[0]?.id||''
 async function task(callback:()=>Promise<unknown>,success:string){if(busy)return;setBusy(true);setFeedback('');setError('');try{await callback();setFeedback(success)}catch(e){setError(e instanceof Error?e.message:'发生错误，请重试')}finally{setBusy(false)}}
 async function allowNotifications(){try{
   if(typeof Notification==='undefined'){setError('当前浏览器不支持通知权限，页面内提醒仍可使用。');return}
   const choice=await Notification.requestPermission();setAlertsEnabled(choice==='granted');setFeedback(choice==='granted'?'已允许浏览器通知。需保持网页打开；关闭网页后的推送尚未配置。':'未获得系统通知权限，可继续收到页面内提醒。')
  }catch{setError('此浏览器不支持请求通知权限。')}}
 return <div className={'collab-page '+(compact?'collab-compact':'')}>
  {!compact&&<header className="collab-title"><Cloud size={22}/><div><strong>共同编辑这部手机</strong><small>Jeremy's Phone · Studio</small></div></header>}
  <section className="collab-card"><div className="collab-row"><span className={'collab-dot '+sync.status}/><div><b>{!sync.configured?'未连接云端':sync.status==='online'?'云端在线':sync.status==='connecting'?'正在连接':`连接异常`}</b><small>{!sync.configured?'当前内容只保存在本机':sync.isEditor?`编辑者 · ${sync.email}`:sync.email?`只读账号 · ${sync.email}`:'访客浏览模式'}</small></div><button aria-label="重新同步" title="重新同步" disabled={!sync.configured||busy} onClick={()=>void task(sync.reload,'已经读取最新的云端内容。')}><RefreshCw size={17}/></button></div>
   {!sync.configured&&<p className="collab-note">双人协作需要先为网站设置 Supabase 项目 URL 和公开 anon key，并执行附带的数据库建表 SQL。未连接前，编辑只会保存在浏览器本地。</p>}
   {sync.error&&<p role="alert" className="collab-error">{sync.error}</p>}
  </section>
  {sync.configured&&!sync.isEditor&&<section className="collab-card"><h2><LogIn size={18}/>编辑者登录</h2><p className="collab-note">只有被加入白名单的两位邮箱能修改内容。系统将发送一次性验证码 / 登录邮件。</p><form onSubmit={e=>{e.preventDefault();void task(async()=>{await sync.login(email);setSent(true)},'邮件已发送，请检查收件箱及垃圾邮件。')}}><label className="collab-field">邮箱<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" autoComplete="email"/></label><button className="collab-main" disabled={busy} type="submit">{busy?'处理中':'发送登录邮件'}</button></form>{sent&&<form onSubmit={e=>{e.preventDefault();void task(()=>sync.verify(email,code),'登录成功。')}}><label className="collab-field">邮件中的一次性验证码<input value={code} onChange={e=>setCode(e.target.value)} inputMode="numeric" placeholder="输入验证码"/></label><button className="collab-main" disabled={busy||!code} type="submit">验证并进入工作台</button></form>}{sync.email&&!sync.isEditor&&<p className="collab-note">如果已登录但显示只读，请先把这个邮箱加入 SQL 编辑者名单。</p>}</section>}
  {sync.configured&&sync.isEditor&&<>
   <section className="collab-card"><h2><Users size={18}/>实时微信 / 模拟来电</h2><p className="collab-note">发送后，另一台打开此网址的设备约 2–3 秒内更新；来电会弹出接听界面。消息不会发到真正的微信或电话。</p><label className="collab-field">选择联系人<select value={chosen} onChange={e=>setContact(e.target.value)}>{contacts.map(c=><option value={c.id} key={c.id}>{c.name}</option>)}</select></label><label className="collab-field">消息显示为<select value={sender} onChange={e=>setSender(e.target.value as 'self'|'other')}><option value="other">联系人发送给 {profile.name}</option><option value="self">{profile.name} 发给联系人</option></select></label><label className="collab-field">消息内容<textarea rows={3} value={message} maxLength={5000} onChange={e=>setMessage(e.target.value)} placeholder="写一条微信消息…"/></label><div className="collab-actions"><button disabled={busy||!chosen||!message.trim()} onClick={()=>void task(async()=>{await sync.send(chosen,sender,message);setMessage('')},'微信消息已发布到模拟手机。')}><Send size={17}/>发送微信</button><button disabled={busy||!chosen} onClick={()=>void task(()=>sync.call(chosen),'已向其他打开的模拟手机发送来电提醒。')}><PhoneCall size={17}/>模拟来电</button></div></section>
   <section className="collab-card"><h2><BellRing size={18}/>通知设置</h2><p className="collab-note">页面内提醒默认开启。允许浏览器通知后，手机切到其他应用时也可显示提醒；网页完全关闭时不支持推送。</p><button className="collab-secondary" onClick={()=>void allowNotifications()}><BellRing size={17}/>{alertsEnabled?'已允许浏览器通知':'启用浏览器通知'}</button><button className="collab-secondary" onClick={()=>sync.logout()}><LogOut size={17}/>退出编辑账号</button></section>
  </>}
  {feedback&&<p className="collab-feedback" role="status"><Check size={16}/>{feedback}</p>}{error&&<p className="collab-error" role="alert">{error}</p>}
  <p className="collab-footnote">本项目为虚构手机互动创作。实时数据对网站访客可见，请勿录入真实的隐私聊天。</p>
 </div>
}

export function EditorGate(){const configured=useCollabStore(s=>s.configured),editor=useCollabStore(s=>s.isEditor),status=useCollabStore(s=>s.status);if(configured&&(!editor||status!=='online'))return <div className="editor-gate"><CollabPanel/></div>;return null}
