import { supabase, Property, isAvailable } from '@/lib/supabase'
import CatalogClient from '@/components/CatalogClient'

export const revalidate = 60

export default async function HomePage() {
  const { data, error } = await supabase
    .from('properties')
    .select('id,slug,title,title_en,price_sale,price_rent_monthly,currency,bedrooms,bathrooms,construction_size_sqm,location_name,property_type,status,images,featured')
    .eq('hidden', false)
    .order('created_at', { ascending: false })

  const available = ((data as Property[]) || []).filter(isAvailable)
  return <CatalogClient properties={available} />
}
