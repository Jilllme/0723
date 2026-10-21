import type {Metadata} from 'next'
import './globals.css'
import './phone.css'
import './visual-refresh.css'
import './iphone-reference-preview.css'
import './lock-reference.css'
import {Providers} from './providers'
export const metadata:Metadata={title:'JEREMY 的手机',description:'张极普通人 AU · 虚构手机探索'}
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="zh-CN" suppressHydrationWarning><body><Providers>{children}</Providers></body></html>}
