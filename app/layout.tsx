import type { Metadata } from 'next'
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
      <body className="antialiased">{children}</body>
    </html>
  )
}
