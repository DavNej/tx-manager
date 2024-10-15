import type { Metadata } from 'next'
import Providers from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tx Manager',
  description:
    'A transaction management module that simulate transaction process',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50">
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  )
}
