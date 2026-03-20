import { supabase, Property } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import PropertyDetail from '@/components/PropertyDetail'

export const revalidate = 60

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { data } = await supabase.from('properties').select('title_en,title,main_image').eq('slug', params.slug).single()
  if (!data) return {}
  return {
    title: data.title_en || data.title,
    openGraph: { images: data.main_image ? [data.main_image] : [] }
  }
}

export default async function PropertyPage({ params }: { params: { slug: string } }) {
  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('slug', params.slug)
    .eq('hidden', false)
    .single()

  if (!property) notFound()

  const { data: similar } = await supabase
    .from('properties')
    .select('id,slug,title,title_en,price,bedrooms,bathrooms,square_meters,property_type,listing_type,location,neighborhood,main_image,images')
    .eq('hidden', false)
    .eq('property_type', property.property_type)
    .neq('id', property.id)
    .order('created_at', { ascending: false })
    .limit(3)

  return <PropertyDetail property={property as Property} similar={(similar as Property[]) || []} />
}
