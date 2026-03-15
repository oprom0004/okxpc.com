import { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Providers } from './providers';
import BackToTop from '@/components/BackToTop';
import MobileStickyFooter from '@/components/MobileStickyFooter';
import { GatewayTrigger } from '@/features/DownloadGateway/GatewayContext';



export const metadata: Metadata = {
  metadataBase: new URL('https://okxpc.com'),
  alternates: {
    canonical: '/',
  },
  title: {
    template: '%s - OKX官方网址',
    default: 'OKX下载中心 | OKX电脑版/APP/桌面端官方下载网关',
  },
  description: 'OKX Web3节点入口。致力于为您提供最新OKX桌面客户端获取策略、手机端原装包校验流程及网页版连通性指南，保障全平台安全同步。',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://okxpc.com',
    siteName: 'OKX 桌面技术节点',
    title: 'OKX桌面端分发枢纽 | 提供全面下载及连接解决方案',
    description: '专业的OKX桌面与客户端接入向导。直达官方分发节点，保障安全连通性。',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased font-sans" suppressHydrationWarning>
        <Providers>
          <Header />
          <main className="min-h-screen bg-[#0f172a]">
            {children}
          </main>
          <Footer />
          <BackToTop />
          <MobileStickyFooter>
            <GatewayTrigger className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center transition-colors shadow-lg">
              访问 OKX 官网
            </GatewayTrigger>
          </MobileStickyFooter>
        </Providers>
      </body>
    </html>
  );
}
