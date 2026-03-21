'use client'
import { useEffect, useState } from 'react'
import { supabase, Property, isAvailable, getPrice, getMainImage } from '@/lib/supabase'
import Link from 'next/link'
import PropertyCard from './PropertyCard'

type PropertyList = {
  id: string
  slug: string
  title: string
  description: string
  property_ids: string[]
}

export default function ListPageClient({ slug }: { slug: string }) {
  const [list, setList] = useState<PropertyList | null>(null)
  const [properties, setProperties] = useState<Property[]>([])
  const [status, setStatus] = useState<'loading' | 'found' | 'notfound'>('loading')

  useEffect(() => {
    supabase
      .from('property_lists')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()
      .then(({ data: listData }) => {
        if (!listData) { setStatus('notfound'); return }
        setList(listData as PropertyList)

        if (!listData.property_ids?.length) { setStatus('found'); return }

        supabase
          .from('properties')
          .select('id,slug,title,title_en,price_sale,price_rent_monthly,bedrooms,bathrooms,construction_size_sqm,location_name,property_type,status,images,featured')
          .in('id', listData.property_ids)
          .then(({ data: propsData }) => {
            // Preserve list order + filter unavailable
            const ordered = listData.property_ids
              .map((id: string) => (propsData || []).find((p: any) => p.id === id))
              .filter((p: any) => p && isAvailable(p as Property)) as Property[]
            setProperties(ordered)
            setStatus('found')
          })
      })
  }, [slug])

  if (status === 'loading') return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#F5F2EE' }}>
      <p style={{ fontFamily:'Poppins,sans-serif', color:'#6B6B6B', fontSize:14 }}>Loading...</p>
    </div>
  )

  if (status === 'notfound') return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#F5F2EE', textAlign:'center', padding:24 }}>
      <h1 style={{ fontFamily:'Lora,serif', fontSize:28, color:'#1A1A1A', marginBottom:12 }}>List Not Found</h1>
      <p style={{ color:'#6B6B6B', fontFamily:'Poppins,sans-serif', marginBottom:40 }}>This curated list does not exist or has been removed.</p>
      <Link href="/" style={{ padding:'14px 32px', background:'#C9A96E', color:'#fff', borderRadius:8, textDecoration:'none', fontWeight:500, fontFamily:'Poppins,sans-serif' }}>
        View All Properties
      </Link>
    </div>
  )

  return (
    <main style={{ background:'#F5F2EE', minHeight:'100vh', padding:'48px 24px' }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{ marginBottom:48 }}>
          <p style={{ color:'#C9A96E', fontFamily:'Poppins,sans-serif', fontSize:12, textTransform:'uppercase', letterSpacing:2, marginBottom:8 }}>
            Curated Selection
          </p>
          <h1 style={{ fontFamily:'Lora,serif', fontSize:36, color:'#1A1A1A', margin:'0 0 12px', lineHeight:1.2 }}>
            {list?.title || 'Property Selection'}
          </h1>
          {list?.description && (
            <p style={{ color:'#6B6B6B', fontFamily:'Poppins,sans-serif', fontSize:15, maxWidth:600, lineHeight:1.7 }}>
              {list.description}
            </p>
          )}
          <p style={{ color:'#6B6B6B', fontFamily:'Poppins,sans-serif', fontSize:13, marginTop:16 }}>
            {properties.length} {properties.length === 1 ? 'property' : 'properties'}
          </p>
        </div>

        {properties.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 0', color:'#6B6B6B', fontFamily:'Poppins,sans-serif' }}>
            No available properties in this selection.
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:28 }}>
            {properties.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        )}
      </div>
    </main>
  )
}
