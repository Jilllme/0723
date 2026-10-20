"use client"
import {create} from 'zustand'
import {cloudConfigured,forgetSession,isAllowedEditor,loadCloudContent,loadLiveEvents,loginWithPassword,publishCloudContent,pushLiveEvent,requestLogin,restoreSession,sessionEmail,verifyLogin,type LiveEvent} from './collab-api'
import {useContentStore} from './content-store'
import type {PhoneContent} from './content-model'

type CloudStatus='local'|'connecting'|'online'|'error'
type State={
 configured:boolean; status:CloudStatus;error:string;email:string;isEditor:boolean;revision:number;
 events:LiveEvent[];notification:LiveEvent|null;newCount:number;
 start:()=>void;stop:()=>void;reload:()=>Promise<void>;
 login:(email:string)=>Promise<void>;passwordLogin:(email:string,password:string)=>Promise<void>;verify:(email:string,code:string)=>Promise<void>;logout:()=>void;
 publish:(data:PhoneContent,expectedRevision?:number)=>Promise<PhoneContent>;
 send:(contact_id:string,sender:'self'|'other',text:string)=>Promise<void>;
 call:(contact_id:string)=>Promise<void>;dismiss:()=>void;
}
let timer:ReturnType<typeof setInterval>|null=null
let pending=false
let initializedEvents=false
let knownEvents=new Set<string>()
async function refreshPermission(){const session=await restoreSession();if(!session){useCollabStore.setState({email:'',isEditor:false});return}const authorized=await isAllowedEditor().catch(()=>false);useCollabStore.setState({email:sessionEmail(),isEditor:authorized})}
async function syncData(){
 if(pending||!cloudConfigured)return
 pending=true
 try{
  await restoreSession()
  const [doc,events]=await Promise.all([loadCloudContent(),loadLiveEvents()]);const state=useCollabStore.getState()
  if(doc && doc.revision>state.revision){useContentStore.getState().applyRemote(doc.content);useCollabStore.setState({revision:doc.revision})}
  if(initializedEvents){
   const unseen=events.filter(e=>!knownEvents.has(e.id))
   const notice=unseen.filter(e=>e.sender==='other'||e.kind==='call').at(-1)
   if(notice)useCollabStore.setState({notification:notice,newCount:state.newCount+unseen.length})
  }
  knownEvents=new Set(events.map(e=>e.id));initializedEvents=true
  useCollabStore.setState({events,status:'online',error:''})
 }catch(e){useCollabStore.setState({status:'error',error:e instanceof Error?e.message:'云端暂时不可用'})}
 finally{pending=false}
}
export const useCollabStore=create<State>((set,get)=>({
 configured:cloudConfigured,status:cloudConfigured?'connecting':'local',error:'',email:'',isEditor:false,revision:0,events:[],notification:null,newCount:0,
 start:()=>{
  if(!cloudConfigured||timer)return
  void (async()=>{try{await refreshPermission();await syncData()}catch(e){set({status:'error',error:String(e)})}})()
  timer=setInterval(()=>{void syncData()},2300)
 },
 stop:()=>{if(timer){clearInterval(timer);timer=null}},
 reload:async()=>{if(!cloudConfigured)return;pending=false;const doc=await loadCloudContent();if(doc){useContentStore.getState().applyRemote(doc.content);set({revision:doc.revision})}await syncData()},
 login:async(email)=>{await requestLogin(email)},
 passwordLogin:async(email,password)=>{await loginWithPassword(email,password);await refreshPermission();if(!get().isEditor){forgetSession();set({email:'',isEditor:false});throw new Error('该邮箱没有编辑权限。请使用已经加入双人白名单的账号。')}await syncData()},
 verify:async(email,code)=>{await verifyLogin(email,code);await refreshPermission();if(!get().isEditor)throw new Error('邮箱已经登录，但没有这部手机的编辑权限。请让项目负责人将邮箱加入双人编辑名单。');await syncData()},
 logout:()=>{forgetSession();set({email:'',isEditor:false})},
 publish:async(content,expectedRevision)=>{
  const state=get()
  if(!cloudConfigured)return content
  if(!state.isEditor)throw new Error('只有两位获授权的编辑者可以发布修改。')
  if(state.status!=='online')throw new Error('当前云端连接失败，请恢复网络后再保存。')
  const result=await publishCloudContent(content,expectedRevision??state.revision)
  set({revision:result.doc.revision});return result.content
 },
 send:async(contact_id,sender,text)=>{
  if(!get().isEditor)throw new Error('请使用获授权的编辑账号登录。')
  const message=text.trim();if(!message||message.length>5000)throw new Error('请输入不超过 5000 字的消息。')
  const event=await pushLiveEvent({kind:'wechat',contact_id,sender,text:message})
  set({events:[...get().events,event].slice(-150)});knownEvents.add(event.id)
 },
 call:async(contact_id)=>{
  if(!get().isEditor)throw new Error('请先登录编辑账号。')
  const event=await pushLiveEvent({kind:'call',contact_id,sender:'other',text:'来电邀请'})
  set({events:[...get().events,event].slice(-150)});knownEvents.add(event.id)
 },
 dismiss:()=>set({notification:null,newCount:0})
}))
