"use client"
import {useEffect,useState} from 'react'
import {ArrowUpRight,ChevronLeft,Cloud,LockKeyhole,MessageCircle,Settings2,Smartphone,Users} from 'lucide-react'
import {useCollabStore} from '@/lib/collab-store'
import {useContentStore} from '@/lib/content-store'
import {CollabPanel} from '@/components/collab-panel'
import {PhoneEditor} from '@/components/phone-editor'

type Tab='control'|'edit'
export default function StudioPage(){
 const [tab,setTab]=useState<Tab>('control')
 const [ready,setReady]=useState(false)
 const {configured,isEditor,status,email,revision}=useCollabStore()
 useEffect(()=>{
   let alive=true
   void useContentStore.getState().hydrate().then(()=>{if(alive){setReady(true);useCollabStore.getState().start()}})
   return ()=>{alive=false;useCollabStore.getState().stop()}
 },[])
 const authorized=configured&&isEditor&&status==='online'&&ready
 return <main className="studio-shell">
  <div className="studio-layout">
    <header className="studio-header"><div className="studio-brand"><span className="studio-brand-mark">J<span>·</span></span><div><strong>JEREMY'S PHONE</strong><small>PRIVATE STUDIO / 02.03</small></div></div><a href="/ios" className="studio-view-link"><Smartphone size={16}/>观众手机 <ArrowUpRight size={15}/></a></header>
    <section className="studio-hero"><div className="studio-eyebrow"><span/> EDITOR WORKSPACE / TWO OPERATORS</div><h1>手机背后的<br/><em>两位操控者。</em></h1><p>你和朋友在这里共同管理。微信消息、模拟来电、相册与资料发布后，观众正在浏览的手机会自动更新。</p></section>
    {!ready&&<div className="studio-state">正在载入工作台…</div>}
    {ready&&!configured&&<div className="studio-setup"><LockKeyhole size={22}/><div><strong>后台还未连接云端</strong><p>为保护内容，未配置数据库前不会开放编辑权限。请先按项目里的《部署及双人后台说明.md》配置 Supabase；之后邀请你与朋友使用各自的邮箱登录。</p></div></div>}
    {ready&&configured&&!authorized&&<div className="studio-auth"><div className="studio-auth-copy"><LockKeyhole size={20}/><h2>仅限两位编辑者</h2><p>观众页面不会显示后台入口；即使知道这个地址，未授权的账号也无法保存、发送消息或触发来电。</p></div><CollabPanel/></div>}
    {authorized&&<>
      <div className="studio-summary"><span><Cloud size={16}/> 云端已连接</span><span><Users size={16}/> {email}</span><span>内容版本 R{revision}</span></div>
      <nav className="studio-navigation" aria-label="后台功能"><button className={tab==='control'?'selected':''} onClick={()=>setTab('control')}><MessageCircle size={17}/>实时控制台</button><button className={tab==='edit'?'selected':''} onClick={()=>setTab('edit')}><Settings2 size={17}/>编辑手机内容</button></nav>
      {tab==='control'?<section className="studio-control"><CollabPanel/></section>:<section className="studio-editor"><PhoneEditor onBack={()=>setTab('control')}/></section>}
    </>}
    <footer className="studio-footer">JEREMY · TWO OPERATORS, ONE PHONE <span>这里的消息与来电仅用于虚构手机的互动展示，不会联系真实微信或电话号码。</span></footer>
  </div>
 </main>
}
