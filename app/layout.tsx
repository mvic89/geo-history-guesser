import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Geo History Guesser',
  description: 'Test your historical geography knowledge',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
