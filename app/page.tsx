import { supabase } from '@/lib/supabase'
import CatalogClient from '@/components/CatalogClient'

export const revalidate = 60

export default async function HomePage() {
  const { data: properties } = await supabase
    .from('properties')
    .select('id,slug,title,title_en,price,location,neighborhood,bedrooms,bathrooms,square_meters,property_type,listing_type,main_image,images')
    .eq('hidden', false)
    .order('created_at', { ascending: false })

  return <CatalogClient properties={properties || []} />
}
