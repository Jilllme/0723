import type {Metadata} from 'next'
import './globals.css'
import './phone.css'
import './visual-preview.css'
import {Providers} from './providers'
export const metadata:Metadata={title:'Jeremy 的手机 · 独立预览',description:'张极普通人 AU · 虚构手机探索'}
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="zh-CN" suppressHydrationWarning><body><Providers>{children}</Providers></body></html>}
