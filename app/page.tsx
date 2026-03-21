import { supabase, Property } from '@/lib/supabase'
import CatalogClient from '@/components/CatalogClient'

export const revalidate = 3600

export const metadata = {
  title: 'Costa Rica Luxury Real Estate | Properties',
  description: 'Curated luxury properties in Escazú, Santa Ana, La Guácima and the Western GAM Corridor of Costa Rica.',
  openGraph: {
    title: 'Costa Rica Luxury Real Estate',
    description: 'Curated luxury properties in Escazú, Santa Ana, La Guácima and the Western GAM Corridor.',
    images: [],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Costa Rica Luxury Real Estate',
    description: 'Curated luxury properties in Escazú, Santa Ana and the Western GAM Corridor.',
  },
}

export default async function HomePage() {
  const { data } = await supabase
    .from('properties')
    .select('id,slug,title,title_en,price_sale,price_rent_monthly,bedrooms,bathrooms,construction_size_sqm,location_name,property_type,status,images,featured')
    .eq('hidden', false)
    .order('created_at', { ascending: false })

  return <CatalogClient properties={(data as Property[]) || []} />
}
