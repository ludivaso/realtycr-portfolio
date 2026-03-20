import { supabase, Property, isAvailable, getPrice, getMainImage, UNAVAILABLE_STATUSES } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import PropertyDetail from '@/components/PropertyDetail'
import UnavailablePage from '@/components/UnavailablePage'

export const revalidate = 60

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { data } = await supabase.from('properties').select('title_en,title,images').eq('slug', params.slug).single()
  if (!data) return {}
  return {
    title: data.title_en || data.title,
    openGraph: { images: data.images?.[0] ? [data.images[0]] : [] }
  }
}

export default async function PropertyPage({ params }: { params: { slug: string } }) {
  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!property) notFound()

  // Show "no longer available" for sold/rented
  if (!isAvailable(property as Property)) {
    return <UnavailablePage />
  }

  const { data: similar } = await supabase
    .from('properties')
    .select('id,slug,title,title_en,price_sale,price_rent_monthly,currency,bedrooms,bathrooms,construction_size_sqm,property_type,location_name,images,status')
    .eq('property_type', property.property_type)
    .neq('id', property.id)
    .not('status', 'in', `(${UNAVAILABLE_STATUSES.map(s => `"${s}"`).join(',')})`)
    .order('created_at', { ascending: false })
    .limit(3)

  return <PropertyDetail property={property as Property} similar={(similar as Property[]) || []} />
}
