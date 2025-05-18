import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Footer } from '@/components/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'KotakDrama - Nonton Drama Pendek Sepuasnya Gratis',
  description: 'Nonton Drama Pendek Sepuasnya GRATIS. Update setiap hari dengan kualitas terbaik.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {children}
        <Footer />
      </body>
    </html>
  )
}
