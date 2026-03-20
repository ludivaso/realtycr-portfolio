import PropertyPageClient from '@/components/PropertyPageClient'

export default function PropertyPage({ params }: { params: { slug: string } }) {
  return <PropertyPageClient slug={params.slug} />
}
