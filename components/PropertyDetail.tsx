'use client'
import { Property } from '@/lib/supabase'
import Link from 'next/link'
import { useState } from 'react'
import PropertyCard from './PropertyCard'

export default function PropertyDetail({ property: p, similar }: { property: Property, similar: Property[] }) {
  const [activeImg, setActiveImg] = useState(p.main_image || (p.images && p.images[0]) || '')
  const allImages = p.images?.length ? p.images : p.main_image ? [p.main_image] : []
  const price = p.price ? `$${p.price.toLocaleString()}` : 'Price on request'

  return (
    <main style={{ background: '#F5F2EE', minHeight: '100vh' }}>
      {/* Back */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px 0' }}>
        <Link href="/" style={{ color: '#6B6B6B', fontFamily: 'Poppins', fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          ← Back to properties
        </Link>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px' }}>
        {/* Hero Image */}
        <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 16, aspectRatio: '16/9', background: '#e8e3dc' }}>
          {activeImg && <img src={activeImg} alt={p.title_en || p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
        </div>

        {/* Thumbnails */}
        {allImages.length > 1 && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 32, overflowX: 'auto', paddingBottom: 4 }}>
            {allImages.map((img, i) => (
              <div key={i} onClick={() => setActiveImg(img)} style={{ flexShrink: 0, width: 80, height: 60, borderRadius: 6, overflow: 'hidden', cursor: 'pointer', border: activeImg === img ? '2px solid #C9A96E' : '2px solid transparent' }}>
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 40, alignItems: 'start' }}>
          {/* Left */}
          <div>
            <span style={{ background: '#C9A96E', color: '#fff', padding: '4px 12px', borderRadius: 4, fontSize: 11, fontFamily: 'Poppins', textTransform: 'capitalize', marginBottom: 16, display: 'inline-block' }}>
              {p.listing_type} · {p.property_type}
            </span>
            <h1 style={{ fontFamily: 'Lora, serif', fontSize: 30, color: '#1A1A1A', margin: '8px 0 4px', lineHeight: 1.2 }}>
              {p.title_en || p.title}
            </h1>
            <p style={{ color: '#6B6B6B', fontFamily: 'Poppins', fontSize: 14, margin: '0 0 24px' }}>
              📍 {p.neighborhood ? `${p.neighborhood}, ` : ''}{p.location}
            </p>

            {/* Specs */}
            <div style={{ display: 'flex', gap: 24, padding: '20px 0', borderTop: '1px solid #E8E3DC', borderBottom: '1px solid #E8E3DC', marginBottom: 32, flexWrap: 'wrap' }}>
              {p.bedrooms && <div style={{ textAlign: 'center' }}><div style={{ fontSize: 22 }}>🛏</div><div style={{ fontFamily: 'Poppins', fontSize: 13, color: '#1A1A1A', fontWeight: 500 }}>{p.bedrooms}</div><div style={{ fontFamily: 'Poppins', fontSize: 11, color: '#6B6B6B' }}>Bedrooms</div></div>}
              {p.bathrooms && <div style={{ textAlign: 'center' }}><div style={{ fontSize: 22 }}>🚿</div><div style={{ fontFamily: 'Poppins', fontSize: 13, color: '#1A1A1A', fontWeight: 500 }}>{p.bathrooms}</div><div style={{ fontFamily: 'Poppins', fontSize: 11, color: '#6B6B6B' }}>Bathrooms</div></div>}
              {p.square_meters && <div style={{ textAlign: 'center' }}><div style={{ fontSize: 22 }}>📐</div><div style={{ fontFamily: 'Poppins', fontSize: 13, color: '#1A1A1A', fontWeight: 500 }}>{p.square_meters} m²</div><div style={{ fontFamily: 'Poppins', fontSize: 11, color: '#6B6B6B' }}>Interior</div></div>}
              {p.lot_size && <div style={{ textAlign: 'center' }}><div style={{ fontSize: 22 }}>🌿</div><div style={{ fontFamily: 'Poppins', fontSize: 13, color: '#1A1A1A', fontWeight: 500 }}>{p.lot_size} m²</div><div style={{ fontFamily: 'Poppins', fontSize: 11, color: '#6B6B6B' }}>Lot</div></div>}
            </div>

            {/* Description */}
            {(p.description_en || p.description) && (
              <div style={{ marginBottom: 32 }}>
                <h2 style={{ fontFamily: 'Lora, serif', fontSize: 20, color: '#1A1A1A', marginBottom: 12 }}>About this property</h2>
                <p style={{ fontFamily: 'Poppins', fontSize: 14, color: '#444', lineHeight: 1.8 }}>
                  {p.description_en || p.description}
                </p>
              </div>
            )}

            {/* Amenities */}
            {p.amenities && p.amenities.length > 0 && (
              <div style={{ marginBottom: 32 }}>
                <h2 style={{ fontFamily: 'Lora, serif', fontSize: 20, color: '#1A1A1A', marginBottom: 16 }}>Amenities</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {p.amenities.map((a, i) => (
                    <span key={i} style={{ padding: '6px 14px', background: '#fff', border: '1px solid #E8E3DC', borderRadius: 20, fontFamily: 'Poppins', fontSize: 12, color: '#444' }}>{a}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Plusvalia */}
            {p.plusvalia_notes && (
              <div style={{ padding: 24, background: '#fff', borderLeft: '4px solid #C9A96E', borderRadius: '0 8px 8px 0', marginBottom: 32 }}>
                <h2 style={{ fontFamily: 'Lora, serif', fontSize: 18, color: '#1A1A1A', marginBottom: 12 }}>Investment Perspective / Perspectiva de Inversión</h2>
                <p style={{ fontFamily: 'Poppins', fontSize: 13, color: '#444', lineHeight: 1.8, margin: 0 }}>{p.plusvalia_notes}</p>
              </div>
            )}
          </div>

          {/* Right — Price card only */}
          <div style={{ position: 'sticky', top: 24 }}>
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E8E3DC', padding: 28 }}>
              <p style={{ fontFamily: 'Poppins', fontSize: 12, color: '#6B6B6B', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: 1 }}>Asking Price</p>
              <p style={{ fontFamily: 'Lora, serif', fontSize: 28, color: '#C9A96E', margin: '0 0 20px', fontWeight: 600 }}>{price}</p>
              <div style={{ borderTop: '1px solid #E8E3DC', paddingTop: 16 }}>
                <p style={{ fontFamily: 'Poppins', fontSize: 12, color: '#6B6B6B', margin: '0 0 8px' }}>📍 {p.location}</p>
                {p.property_type && <p style={{ fontFamily: 'Poppins', fontSize: 12, color: '#6B6B6B', margin: '0 0 8px', textTransform: 'capitalize' }}>🏠 {p.property_type}</p>}
                {p.listing_type && <p style={{ fontFamily: 'Poppins', fontSize: 12, color: '#6B6B6B', margin: 0, textTransform: 'capitalize' }}>📋 For {p.listing_type}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similar.length > 0 && (
          <div style={{ marginTop: 60, paddingTop: 40, borderTop: '1px solid #E8E3DC' }}>
            <h2 style={{ fontFamily: 'Lora, serif', fontSize: 24, color: '#1A1A1A', marginBottom: 28 }}>
              Similar Properties / Propiedades Similares
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
              {similar.map(s => <PropertyCard key={s.id} property={s} />)}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
