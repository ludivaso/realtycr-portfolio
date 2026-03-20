import { supabase, Property, isAvailable } from '@/lib/supabase'
import CatalogClient from '@/components/CatalogClient'

export const revalidate = 3600

export default async function HomePage() {
  const { data } = await supabase
    .from('properties')
    .select('id,slug,title,title_en,price_sale,price_rent_monthly,bedrooms,bathrooms,construction_size_sqm,location_name,property_type,status,images,featured')
    .order('created_at', { ascending: false })
  const available = ((data as Property[]) || []).filter(isAvailable)
  return <CatalogClient properties={available} />
}
