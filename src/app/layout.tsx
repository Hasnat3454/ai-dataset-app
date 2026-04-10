import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Datasets Explorer — Geo Knowledge Graph',
  description: 'Browse 93 top AI datasets curated and published to the Geo knowledge graph.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'AI Datasets Explorer',
    description: 'Browse top AI datasets on the Geo knowledge graph',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
