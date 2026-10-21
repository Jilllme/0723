"use client"
/** Supabase REST client: no service-role key is ever used in the browser. */
import {validateContent, type PhoneContent} from './content-model'

export type LiveEvent = {id:string;kind:'wechat'|'call';contact_id:string;sender:'self'|'other';text:string;created_at:string;created_by:string}
export type CloudDocument = {id:string;content:PhoneContent;revision:number;updated_at:string}
export type PhoneSession = {access_token:string;refresh_token:string;expires_at:number;email:string}
const SESSION_KEY='jeremy-visual-preview-session'
const URL=(process.env.NEXT_PUBLIC_SUPABASE_URL||'').replace(/\/$/,'')
const KEY=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||''
export const cloudConfigured=false && Boolean(/^https:\/\/[a-zA-Z0-9.-]+\.supabase\.co$/.test(URL) && KEY.length>30)
let currentSession:PhoneSession|null=null

function authHeaders(access?:string,extra?:Record<string,string>):HeadersInit{return {'apikey':KEY,...(access?{'Authorization':'Bearer '+access}:{}),...extra}}
async function query<T>(path:string,opts:RequestInit={},access?:string):Promise<T>{
 if(!cloudConfigured)throw new Error('云端尚未配置 Supabase，当前只能使用本地模式。')
 const response=await fetch(URL+path,{...opts,headers:{...authHeaders(access),...opts.headers},cache:'no-store'})
 if(!response.ok){let data:Record<string,unknown>={};try{data=await response.json()}catch{}
  throw new Error(String(data.message||data.error_description||data.details||data.hint||data.error||`云端请求失败（${response.status}）`))}
 if(response.status===204)return undefined as T
 const data=await response.text();return (data?JSON.parse(data):undefined) as T
}
function saveSession(session:PhoneSession|null){currentSession=session;if(typeof window!=='undefined'){if(session)localStorage.setItem(SESSION_KEY,JSON.stringify(session));else localStorage.removeItem(SESSION_KEY)}}
export function sessionEmail(){return currentSession?.email||''}
export function forgetSession(){saveSession(null)}
export async function restoreSession():Promise<PhoneSession|null>{
 if(!cloudConfigured)return null
 if(!currentSession&&typeof window!=='undefined'){
  try{const data=localStorage.getItem(SESSION_KEY);if(data){const obj=JSON.parse(data) as PhoneSession;if(obj.access_token&&obj.refresh_token)currentSession=obj}}catch{}}
 // A Supabase magic link may contain tokens in the URL fragment. Remove them immediately.
 if(typeof window!=='undefined'){
  const fragment=new URLSearchParams(window.location.hash.slice(1))
  if(fragment.has('access_token')&&fragment.has('refresh_token')){
   const jwt=fragment.get('access_token')!,refresh=fragment.get('refresh_token')!
   const user=await query<{email:string}>('/auth/v1/user',{},jwt)
   saveSession({access_token:jwt,refresh_token:refresh,email:user.email,expires_at:Date.now()+Number(fragment.get('expires_in')||3600)*1000})
   history.replaceState(null,'',location.pathname+location.search)
  }
 }
 if(currentSession&&Date.now()+60_000>currentSession.expires_at){
  try{const next=await query<{access_token:string;refresh_token:string;expires_in:number;user:{email:string}}>(
   '/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({refresh_token:currentSession.refresh_token})})
   saveSession({access_token:next.access_token,refresh_token:next.refresh_token,email:next.user.email,expires_at:Date.now()+next.expires_in*1000})
  }catch{saveSession(null)}
 }
 return currentSession
}
export async function requestLogin(email:string){
 if(!/^\S+@\S+\.\S+$/.test(email))throw new Error('请输入有效的邮箱地址。')
 await query('/auth/v1/otp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,create_user:true,options:{email_redirect_to:typeof location!=='undefined'?location.origin+'/ios':undefined}})})
}
export async function verifyLogin(email:string,token:string){
 const result=await query<{access_token:string;refresh_token:string;expires_in:number;user:{email:string}}>(
  '/auth/v1/verify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,token,type:'email'})})
 saveSession({access_token:result.access_token,refresh_token:result.refresh_token,email:result.user.email,expires_at:Date.now()+result.expires_in*1000})
}
async function token(){const s=await restoreSession();if(!s)throw new Error('请先登录协作账号。');return s.access_token}
export async function isAllowedEditor(){const access=await token();const email=currentSession!.email.toLowerCase();const list=await query<Array<{email:string}>>(`/rest/v1/phone_editors?select=email&email=eq.${encodeURIComponent(email)}`,{},access);return list.length>0}
export async function loadCloudContent(){const result=await query<CloudDocument[]>('/rest/v1/phone_documents?select=id,content,revision,updated_at&id=eq.main&limit=1');const doc=result[0];return doc?{...doc,content:validateContent(doc.content)}:null}
export async function loadLiveEvents(){const items=await query<LiveEvent[]>('/rest/v1/phone_events?select=id,kind,contact_id,sender,text,created_at,created_by&order=created_at.desc&limit=150');return items.reverse()}
function bytesToBlob(dataUrl:string):Blob{const [head,data]=dataUrl.split(',');const mime=/^data:(image\/(?:jpeg|png|webp));base64$/.exec(head)?.[1];if(!mime||!data)throw new Error('无法上传此图片。');const bytes=atob(data);const array=new Uint8Array(bytes.length);for(let i=0;i<bytes.length;i++)array[i]=bytes.charCodeAt(i);return new Blob([array],{type:mime})}
async function cloudImage(src:string){if(!src.startsWith('data:'))return src;const auth=await token(),file=bytesToBlob(src);if(file.size>3.8*1024*1024)throw new Error('一张照片超过 3.8 MB，请压缩后再上传。');const ext=file.type==='image/png'?'png':file.type==='image/webp'?'webp':'jpg';const path=`shared/${crypto.randomUUID()}.${ext}`;await query(`/storage/v1/object/phone-images/${path}`,{method:'POST',headers:{'Content-Type':file.type,'cache-control':'max-age=31536000'},body:file},auth);return `${URL}/storage/v1/object/public/phone-images/${path}`}
export async function moveCloudPhotos(value:PhoneContent){
 const doc=structuredClone(value);const urlMap=new Map<string,string>()
 async function x(url:string){if(!url.startsWith('data:'))return url;if(!urlMap.has(url))urlMap.set(url,await cloudImage(url));return urlMap.get(url)!}
 doc.profile.avatar=await x(doc.profile.avatar);doc.profile.wallpaper=doc.profile.wallpaper?await x(doc.profile.wallpaper):''
 for(const p of doc.photos)p.url=await x(p.url)
 for(const c of doc.contacts)c.avatar=await x(c.avatar)
 return validateContent(doc)
}
export async function publishCloudContent(content:PhoneContent,expectedRevision:number){
 const access=await token();const data=await moveCloudPhotos(content)
 if(expectedRevision===0){
  const rows=await query<CloudDocument[]>('/rest/v1/phone_documents?select=revision,updated_at,content',{method:'POST',headers:{'Content-Type':'application/json','Prefer':'return=representation'},body:JSON.stringify({id:'main',content:data,revision:1})},access)
  return {doc:rows[0],content:data}
 }
 const rows=await query<CloudDocument[]>(`/rest/v1/phone_documents?id=eq.main&revision=eq.${expectedRevision}&select=revision,updated_at,content`,{method:'PATCH',headers:{'Content-Type':'application/json','Prefer':'return=representation'},body:JSON.stringify({content:data,revision:expectedRevision+1,updated_at:new Date().toISOString()})},access)
 if(!rows.length)throw new Error('协作者已经修改了这部手机。请先返回并重新打开编辑页，确认新内容后再修改，避免覆盖对方。')
 return {doc:rows[0],content:data}
}
export async function pushLiveEvent(e:{kind:'wechat'|'call';contact_id:string;sender:'self'|'other';text:string}){
 const access=await token();if(!e.contact_id||e.text.length>5000)throw new Error('消息内容不符合要求。')
 const list=await query<LiveEvent[]>('/rest/v1/phone_events?select=id,kind,contact_id,sender,text,created_at,created_by',{method:'POST',headers:{'Content-Type':'application/json','Prefer':'return=representation'},body:JSON.stringify(e)},access)
 return list[0]
}
