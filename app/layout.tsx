import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Properties | Costa Rica Real Estate',
  description: 'Curated luxury properties in Costa Rica — Escazú, Santa Ana, La Guácima, Ruta 27',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
