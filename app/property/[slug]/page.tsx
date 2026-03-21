import PropertyPageClient from '@/components/PropertyPageClient'

// Next.js 15: params is a Promise — must be awaited
export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <PropertyPageClient slug={slug} />
}
