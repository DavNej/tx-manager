import type { Metadata } from 'next'
import Providers from '@/components/providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'TX manager',
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
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
