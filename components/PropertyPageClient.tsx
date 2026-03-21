'use client'
import { useEffect, useState } from 'react'
import { supabase, Property, DETAIL_SELECT, getTitle, getDescription, getPrice, getMainImage, getListingLabel } from '@/lib/supabase'
import Link from 'next/link'
import PropertyCard from './PropertyCard'

export default function PropertyPageClient({ slug }: { slug: string }) {
  const [property, setProperty] = useState<Property | null>(null)
  const [similar, setSimilar] = useState<Property[]>([])
  const [status, setStatus] = useState<'loading' | 'found' | 'notfound'>('loading')
  const [activeImg, setActiveImg] = useState('')

  useEffect(() => {
    supabase
      .from('properties')
      .select(DETAIL_SELECT)
      .eq('slug', slug)
      .eq('hidden', false)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) { setStatus('notfound'); return }
        setProperty(data as Property)
        setActiveImg(data.featured_images?.[0] || data.images?.[0] || '')
        setStatus('found')
        supabase
          .from('properties')
          .select('id,slug,title_en,price_sale,price_rent_monthly,bedrooms,bathrooms,construction_size_sqm,property_type,location_name,images,featured_images,status,hidden')
          .eq('property_type', data.property_type)
          .eq('hidden', false)
          .neq('id', data.id)
          .limit(3)
          .then(({ data: sim }) => setSimilar((sim as Property[]) || []))
      })
  }, [slug])

  if (status === 'loading') return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#F5F2EE' }}>
      <p style={{ fontFamily:'Poppins,sans-serif', color:'#6B6B6B', fontSize:14 }}>Loading property...</p>
    </div>
  )

  if (status === 'notfound') return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#F5F2EE', textAlign:'center', padding:24 }}>
      <h1 style={{ fontFamily:'Lora,serif', fontSize:28, color:'#1A1A1A', marginBottom:12 }}>Property Not Found</h1>
      <p style={{ color:'#6B6B6B', fontFamily:'Poppins,sans-serif', marginBottom:40 }}>This property is not available.</p>
      <Link href="/" style={{ padding:'14px 32px', background:'#C9A96E', color:'#fff', borderRadius:8, textDecoration:'none', fontWeight:500, fontFamily:'Poppins,sans-serif' }}>View All Properties</Link>
    </div>
  )

  if (!property) return null

  const title = getTitle(property)
  const description = getDescription(property)
  const price = getPrice(property)
  const label = getListingLabel(property)
  const allImages = [...(property.featured_images || []), ...(property.images || [])].filter((v,i,a) => a.indexOf(v) === i)

  return (
    <main style={{ background:'#F5F2EE', minHeight:'100vh' }}>
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'24px 24px 0' }}>
        <Link href="/" style={{ color:'#6B6B6B', fontFamily:'Poppins,sans-serif', fontSize:13, textDecoration:'none' }}>← Back to properties</Link>
      </div>
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'24px' }}>

        <div style={{ borderRadius:12, overflow:'hidden', marginBottom:16, aspectRatio:'16/9', background:'#E8E3DC' }}>
          {activeImg && <img src={activeImg} alt={title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />}
        </div>

        {allImages.length > 1 && (
          <div className="thumb-strip">
            {allImages.map((img, i) => (
              <div key={i} onClick={() => setActiveImg(img)}
                style={{ flexShrink:0, width:80, height:60, borderRadius:6, overflow:'hidden', cursor:'pointer', border: activeImg === img ? '2px solid #C9A96E' : '2px solid transparent' }}>
                <img src={img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              </div>
            ))}
          </div>
        )}

        <div className="property-detail-grid">
          <div>
            <span style={{ background:'#C9A96E', color:'#fff', padding:'4px 12px', borderRadius:4, fontSize:11, fontFamily:'Poppins,sans-serif', display:'inline-block', marginBottom:12, textTransform:'capitalize' }}>
              {label} · {property.property_type}
            </span>
            <h1 style={{ fontFamily:'Lora,serif', fontSize:'clamp(22px, 4vw, 28px)', color:'#1A1A1A', margin:'8px 0 4px', lineHeight:1.2 }}>{title}</h1>
            <p style={{ color:'#6B6B6B', fontFamily:'Poppins,sans-serif', fontSize:14, marginBottom:24 }}>📍 {property.location_name}</p>

            <div style={{ display:'flex', gap:24, padding:'20px 0', borderTop:'1px solid #E8E3DC', borderBottom:'1px solid #E8E3DC', marginBottom:32, flexWrap:'wrap' }}>
              {property.bedrooms && <div style={{ textAlign:'center' }}><div style={{ fontSize:22 }}>🛏</div><div style={{ fontFamily:'Poppins,sans-serif', fontSize:13, fontWeight:500 }}>{property.bedrooms}</div><div style={{ fontFamily:'Poppins,sans-serif', fontSize:11, color:'#6B6B6B' }}>Bedrooms</div></div>}
              {property.bathrooms && <div style={{ textAlign:'center' }}><div style={{ fontSize:22 }}>🚿</div><div style={{ fontFamily:'Poppins,sans-serif', fontSize:13, fontWeight:500 }}>{property.bathrooms}</div><div style={{ fontFamily:'Poppins,sans-serif', fontSize:11, color:'#6B6B6B' }}>Bathrooms</div></div>}
              {property.construction_size_sqm && <div style={{ textAlign:'center' }}><div style={{ fontSize:22 }}>📐</div><div style={{ fontFamily:'Poppins,sans-serif', fontSize:13, fontWeight:500 }}>{property.construction_size_sqm} m²</div><div style={{ fontFamily:'Poppins,sans-serif', fontSize:11, color:'#6B6B6B' }}>Interior</div></div>}
              {property.land_size_sqm && <div style={{ textAlign:'center' }}><div style={{ fontSize:22 }}>🌿</div><div style={{ fontFamily:'Poppins,sans-serif', fontSize:13, fontWeight:500 }}>{property.land_size_sqm} m²</div><div style={{ fontFamily:'Poppins,sans-serif', fontSize:11, color:'#6B6B6B' }}>Lot</div></div>}
            </div>

            {description && (
              <div style={{ marginBottom:32 }}>
                <h2 style={{ fontFamily:'Lora,serif', fontSize:20, color:'#1A1A1A', marginBottom:12 }}>About this property</h2>
                <p style={{ fontFamily:'Poppins,sans-serif', fontSize:14, color:'#444', lineHeight:1.8, whiteSpace:'pre-wrap' }}>{description}</p>
              </div>
            )}

            {property.amenities_en?.length > 0 && (
              <div style={{ marginBottom:32 }}>
                <h2 style={{ fontFamily:'Lora,serif', fontSize:20, color:'#1A1A1A', marginBottom:16 }}>Amenities</h2>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                  {property.amenities_en.map((a, i) => <span key={i} style={{ padding:'6px 14px', background:'#fff', border:'1px solid #E8E3DC', borderRadius:20, fontFamily:'Poppins,sans-serif', fontSize:12, color:'#444' }}>{a}</span>)}
                </div>
              </div>
            )}

            {property.plusvalia_notes && (
              <div style={{ padding:24, background:'#fff', borderLeft:'4px solid #C9A96E', borderRadius:'0 8px 8px 0', marginBottom:32 }}>
                <h2 style={{ fontFamily:'Lora,serif', fontSize:18, color:'#1A1A1A', marginBottom:12 }}>Investment Perspective</h2>
                <p style={{ fontFamily:'Poppins,sans-serif', fontSize:13, color:'#444', lineHeight:1.8, margin:0 }}>{property.plusvalia_notes}</p>
              </div>
            )}
          </div>

          <div className="property-price-card">
            <div style={{ background:'#fff', borderRadius:12, border:'1px solid #E8E3DC', padding:28 }}>
              <p style={{ fontFamily:'Poppins,sans-serif', fontSize:12, color:'#6B6B6B', margin:'0 0 4px', textTransform:'uppercase', letterSpacing:1 }}>Asking Price</p>
              <p style={{ fontFamily:'Lora,serif', fontSize:28, color:'#C9A96E', margin:'0 0 20px', fontWeight:600 }}>{price}</p>
              <div style={{ borderTop:'1px solid #E8E3DC', paddingTop:16 }}>
                <p style={{ fontFamily:'Poppins,sans-serif', fontSize:12, color:'#6B6B6B', margin:'0 0 8px' }}>📍 {property.location_name}</p>
                <p style={{ fontFamily:'Poppins,sans-serif', fontSize:12, color:'#6B6B6B', margin:'0 0 8px', textTransform:'capitalize' }}>🏠 {property.property_type}</p>
                <p style={{ fontFamily:'Poppins,sans-serif', fontSize:12, color:'#C9A96E', margin:0, fontWeight:500 }}>{label}</p>
              </div>
            </div>
          </div>
        </div>

        {similar.length > 0 && (
          <div style={{ marginTop:60, paddingTop:40, borderTop:'1px solid #E8E3DC' }}>
            <h2 style={{ fontFamily:'Lora,serif', fontSize:24, color:'#1A1A1A', marginBottom:28 }}>Similar Properties</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:24 }}>
              {similar.map(s => <PropertyCard key={s.id} property={s} />)}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
