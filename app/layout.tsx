import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
export const metadata: Metadata = {
  title: {
    default: 'PocketMine Tools',
    template: '%s - PocketMine Tools',
  },
  keywords: 'PocketMine,PocketMine Tools,PMT,pmt.mcpe.fun,pmt,mcpe.fun',
  icons: {
    icon: '/static/favicon.ico',
  },
};
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1958001180266248"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
