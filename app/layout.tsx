import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Footer } from '@/components/footer'
import { Analytics } from '@vercel/analytics/next';


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'KotakDrama - Nonton Drama Pendek Sepuasnya Gratis',
  description: 'Nonton Drama Pendek Sepuasnya GRATIS. Update setiap hari dengan kualitas terbaik.',
  icons: {
    icon: [
      { url: '/icons/favicon.ico' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/icons/android-chrome-192x192.png',
      },
      {
        rel: 'android-chrome-512x512',
        url: '/icons/android-chrome-512x512.png',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <link rel="manifest" href="/icons/site.webmanifest" />
      <meta name="theme-color" content="#00d4bd" />
      <body className={inter.className}>
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
