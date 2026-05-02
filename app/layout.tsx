import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SmartNav } from '@/components/navigation/SmartNav';
import { Footer } from '@/components/ui/Footer';
import { InkTransitionProvider } from '@/components/ink-transition/InkTransitionContext';
import { InkTransitionWrapper } from '@/components/ink-transition/InkTransitionWrapper';

export const metadata: Metadata = {
  title: {
    default: '华夏志 · 中国历史可视化',
    template: '%s · 华夏志',
  },
  description: '探索中华五千年文明，从夏商周到明清，以时间线、地图、人物关系图谱沉浸式体验中国历史。',
  keywords: ['中国历史', '华夏文明', '朝代', '历史人物', '时间线', '可视化', '中华五千年'],
  authors: [{ name: '华夏志' }],
  creator: '华夏志',
  publisher: '华夏志',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://huaxia-history.vercel.app',
    siteName: '华夏志',
    title: '华夏志 · 中国历史可视化',
    description: '探索中华五千年文明，从夏商周到明清，以时间线、地图、人物关系图谱沉浸式体验中国历史。',
    images: [
      {
        url: '/images/hero-master.jpg',
        width: 3136,
        height: 1344,
        alt: '华夏志 — 中华文明五千年历史长河',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '华夏志 · 中国历史可视化',
    description: '探索中华五千年文明，从夏商周到明清，以时间线、地图、人物关系图谱沉浸式体验中国历史。',
    images: ['/images/hero-master.jpg'],
  },
  icons: {
    icon: '/huaxia-history/favicon.ico',
    apple: '/huaxia-history/apple-touch-icon.png',
  },
  manifest: '/huaxia-history/site.webmanifest',
  metadataBase: new URL('https://huaxia-history.vercel.app'),
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f0e8' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0f' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="paper-texture min-h-screen">
        <InkTransitionProvider>
          <InkTransitionWrapper />
          <SmartNav />
          <main>{children}</main>
          <Footer />
        </InkTransitionProvider>
      </body>
    </html>
  );
}
