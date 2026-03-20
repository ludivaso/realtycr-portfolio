import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Properties — Costa Rica',
  description: 'Curated property listings in Costa Rica.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
