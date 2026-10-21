"use client"
import {ChevronLeft,Heart,Bookmark} from 'lucide-react'
import {useAppState} from '@/lib/app-state'
import {usePhoneStore} from '@/lib/phone-store'
import {useContentView} from '@/lib/content-store'
import type {ImgHTMLAttributes,ReactNode} from 'react'
export function AppHeader({title,back,right}:{title:string;back?:()=>void;right?:ReactNode}){const {closeApp}=useAppState();return <header className="jhead"><button aria-label={back?'返回上一页':'返回主屏幕'} className="jback" onClick={back||closeApp}><ChevronLeft size={26}/></button><span>{title}</span><div className="header-action">{right}</div></header>}
export function Picture({i,...props}:{i:number}&ImgHTMLAttributes<HTMLImageElement>){const {photos}=useContentView();const index=((i%photos.length)+photos.length)%photos.length;return <img src={photos[index].url} alt={photos[index].caption||'相册照片'} loading="lazy" draggable={false} {...props}/>}
export function Avatar({contact,...props}:{contact?:number}&ImgHTMLAttributes<HTMLImageElement>){const {profile,contacts}=useContentView();return <img src={contact===undefined?profile.avatar:contacts[contact]?.avatar||profile.avatar} alt={contact===undefined?profile.name:contacts[contact]?.name||'联系人头像'} loading="lazy" draggable={false} {...props}/>}
export function LikeButton({id,count}:{id:number|string;count?:number}){const {likes,toggleLike}=usePhoneStore();const liked=likes.includes(id);return <button aria-label={liked?'取消喜欢':'喜欢'} aria-pressed={liked} className={'post-like '+(liked?'liked':'')} onClick={()=>toggleLike(id)}><Heart size={21} strokeWidth={1.7} fill={liked?'currentColor':'none'}/><span>{(count??(23+(typeof id==='number'?id%10*7:0)))+(liked?1:0)}</span></button>}
export function SaveButton({id}:{id:number|string}){const {saved,toggleSaved}=usePhoneStore();const selected=saved.includes(id);return <button aria-label={selected?'取消收藏':'收藏'} aria-pressed={selected} className={'save-post '+(selected?'saved':'')} onClick={()=>toggleSaved(id)}><Bookmark size={22} fill={selected?'currentColor':'none'} strokeWidth={1.7}/></button>}
