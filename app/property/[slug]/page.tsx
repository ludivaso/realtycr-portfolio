import { supabase } from '@/lib/supabase'
import PropertyDetailClient from '@/components/PropertyDetailClient'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const revalidate = 60

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { data } = await supabase
    .from('properties')
    .select('title,title_en,meta_description,meta_description_en,main_image')
    .eq('slug', params.slug)
    .eq('hidden', false)
    .single()

  if (!data) return { title: 'Property' }

  return {
    title: data.title_en || data.title,
    description: data.meta_description_en || data.meta_description || '',
    openGraph: {
      images: data.main_image ? [data.main_image] : [],
    },
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
    .select('id,slug,title,title_en,price,location,bedrooms,bathrooms,square_meters,main_image,property_type')
    .eq('hidden', false)
    .eq('property_type', property.property_type)
    .neq('id', property.id)
    .order('created_at', { ascending: false })
    .limit(3)

  return <PropertyDetailClient property={property} similar={similar || []} />
}
