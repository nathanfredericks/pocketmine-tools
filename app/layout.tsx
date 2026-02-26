import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { Inter } from 'next/font/google';
const inter = Inter({subsets:['latin'],variable:'--font-sans'});
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
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen font-sans antialiased">
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZCDKXW5899"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZCDKXW5899');
          `}
        </Script>
      </body>
    </html>
  );
}
