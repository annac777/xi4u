import type { Metadata, Viewport } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'溪间四时',description:'一隅回廊，一溪四季。可旋转的日式庭院三维沙盘。'};
export const viewport: Viewport = {width:'device-width',initialScale:1,viewportFit:'cover',themeColor:'#dce8de'};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="zh-CN"><body>{children}</body></html>;}
