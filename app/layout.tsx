import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PWAInstallPrompt from '@/components/PWAInstallPrompt'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BADIK — RCS.CBS Reformasi Kebijakan dan Sistem',
  description: 'BADIK (RCS.CBS) - Aplikasi AI-powered untuk membantu warga Indonesia mengakses bantuan hukum dasar secara gratis selamanya.',
  openGraph: {
    type: 'website',
    siteName: 'BADIK',
    title: 'BADIK — RCS.CBS Reformasi Kebijakan dan Sistem',
    description: 'Akses informasi hukum dan keadilan dengan mudah. Konsultasi hukum gratis powered by AI.',
    images: [
      {
        url: 'https://yuradvise.vercel.app/thumbnails/og-facebook.png',
        width: 1200,
        height: 630,
        alt: 'BADIK - RCS.CBS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BADIK — RCS.CBS Reformasi Kebijakan dan Sistem',
    description: 'Akses informasi hukum dan keadilan dengan mudah. Konsultasi hukum gratis powered by AI.',
    images: ['https://yuradvise.vercel.app/thumbnails/og-facebook.png'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'BADIK',
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isDark = typeof window !== 'undefined' && localStorage.getItem('badik_dark_mode') === 'true'
  
  return (
    <html lang="id" className={`scroll-smooth ${isDark ? 'dark' : ''}`}>
      <head>
        <meta name="theme-color" content="#0b132b" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="BADIK" />
      </head>
      <body className={`${inter.className} bg-slate-950 text-slate-100 transition-colors duration-300 antialiased`}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <PWAInstallPrompt />
      </body>
    </html>
  )
}
