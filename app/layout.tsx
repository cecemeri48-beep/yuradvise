import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import PWAInstallPrompt from '@/components/PWAInstallPrompt'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'YurAdvise — Asisten Hukum Gratis untuk Warga',
  description: 'Aplikasi AI-powered untuk membantu warga Indonesia mengakses bantuan hukum dasar secara gratis.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'YurAdvise',
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
  return (
    <html lang="id">
      <head>
        <meta name="theme-color" content="#0284c7" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="YurAdvise" />
      </head>
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        <PWAInstallPrompt />
        <footer className="bg-gray-800 text-white py-8 mt-16">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="text-gray-400">
              © 2026 YurAdvise — Dibuat dengan ❤️ untuk rakyat kecil Indonesia
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Disclaimer: Output AI adalah referensi pendidikan, bukan pengganti konsultasi hukum profesional.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
