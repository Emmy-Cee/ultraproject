import type { Metadata } from 'next'
import './globals.css'
import Navbar from '../components/Navbar'
import { SessionProvider } from 'next-auth/react'

export const metadata: Metadata = {
  title: 'UltraProject Marketplace',
  description: 'A scalable online marketplace built with Next.js App Router',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Navbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
