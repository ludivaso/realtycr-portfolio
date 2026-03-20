import { supabase, Property } from '@/lib/supabase'
import CatalogClient from '@/components/CatalogClient'

export const revalidate = 60

export default async function HomePage() {
  // Fetch all properties - RLS on the DB controls what anon can see
  const { data: properties, error } = await supabase
    .from('properties')
    .select('id,slug,title,title_en,price,bedrooms,bathrooms,square_meters,property_type,listing_type,location,neighborhood,main_image,images')
    .order('created_at', { ascending: false })

  if (error) console.error('Supabase error:', error.message)

  return <CatalogClient properties={(properties as Property[]) || []} />
}
