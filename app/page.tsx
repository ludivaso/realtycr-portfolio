import { supabase, Property } from '@/lib/supabase'
import CatalogClient from '@/components/CatalogClient'

export const revalidate = 60

export default async function HomePage() {
  const { data: properties, error } = await supabase
    .from('properties')
    .select('id,slug,title,title_en,price,bedrooms,bathrooms,square_meters,property_type,listing_type,location,neighborhood,main_image,images')
    .eq('hidden', false)
    .order('created_at', { ascending: false })

  if (error) console.error('Supabase error:', error)

  return <CatalogClient properties={(properties as Property[]) || []} />
}
