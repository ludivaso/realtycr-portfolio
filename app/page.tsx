import CatalogClient from '@/components/CatalogClient'

export const metadata = {
  title: 'Costa Rica Luxury Real Estate | Properties',
  description: 'Curated luxury properties in Escazú, Santa Ana, La Guácima and the Western GAM Corridor.',
  openGraph: {
    title: 'Costa Rica Luxury Real Estate',
    description: 'Curated luxury properties in Escazú, Santa Ana, La Guácima and the Western GAM Corridor.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Costa Rica Luxury Real Estate',
    description: 'Curated luxury properties in Escazú, Santa Ana and the Western GAM Corridor.',
  },
}

export default function HomePage() {
  // No server-side fetch — catalog fetches client-side to respect live hidden flags
  return <CatalogClient properties={[]} />
}
