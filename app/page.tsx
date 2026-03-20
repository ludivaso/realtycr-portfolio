import { supabase, Property, isAvailable } from '@/lib/supabase'
import CatalogClient from '@/components/CatalogClient'

export const revalidate = 60

export default async function HomePage() {
  const { data } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })

  // Filter out sold/rented server-side
  const available = ((data as Property[]) || []).filter(isAvailable)

  return <CatalogClient properties={available} />
}
