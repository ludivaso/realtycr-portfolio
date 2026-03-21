import { supabase } from '@/lib/supabase'
import PropertyPageClient from '@/components/PropertyPageClient'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const { data } = await supabase
    .from('properties')
    .select('title_en,title,description_en,description,images,price_sale,price_rent_monthly,location_name')
    .eq('slug', slug)
    .eq('hidden', false)
    .maybeSingle()

  if (!data) return { title: 'Property | Costa Rica Real Estate' }

  const title = data.title_en || data.title || 'Property'
  const description = data.description_en || data.description || ''
  const image = data.images?.[0] || ''
  const price = data.price_sale
    ? `$${Number(data.price_sale).toLocaleString()}`
    : data.price_rent_monthly
    ? `$${Number(data.price_rent_monthly).toLocaleString()}/mo`
    : ''
  const fullTitle = price ? `${title} — ${price}` : title
  const fullDesc = [data.location_name, description.slice(0, 150)].filter(Boolean).join(' · ')

  return {
    title: fullTitle,
    description: fullDesc,
    openGraph: {
      title: fullTitle,
      description: fullDesc,
      images: image ? [{ url: image, width: 1200, height: 630, alt: title }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDesc,
      images: image ? [image] : [],
    },
  }
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // Block hidden properties at server level — no client fetch attempted
  const { data } = await supabase
    .from('properties')
    .select('slug')
    .eq('slug', slug)
    .eq('hidden', false)
    .maybeSingle()

  if (!data) notFound()

  return <PropertyPageClient slug={slug} />
}
