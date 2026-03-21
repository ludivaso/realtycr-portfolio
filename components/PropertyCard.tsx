import Link from 'next/link'
import { Property, getTitle, getPrice, getMainImage, getListingLabel } from '@/lib/supabase'

export default function PropertyCard({ property: p }: { property: Property }) {
  const img = getMainImage(p)
  const title = getTitle(p)
  const price = getPrice(p)
  const label = getListingLabel(p)

  return (
    <Link href={`/property/${p.slug}`} style={{ textDecoration: 'none' }}>
      <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', border: '1px solid #E8E3DC', cursor: 'pointer', transition: 'box-shadow 0.2s' }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)')}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
        <div style={{ position: 'relative', aspectRatio: '3/2', overflow: 'hidden', background: '#E8E3DC' }}>
          {img && <img src={img} alt={title} loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
          <span style={{ position: 'absolute', top: 12, right: 12, background: '#C9A96E', color: '#fff', padding: '4px 10px', borderRadius: 4, fontSize: 11, fontFamily: 'Poppins,sans-serif', fontWeight: 500 }}>
            {label}
          </span>
        </div>
        <div style={{ padding: '18px 20px' }}>
          <h3 style={{ fontFamily: 'Lora,serif', fontSize: 17, color: '#1A1A1A', margin: '0 0 6px', lineHeight: 1.3 }}>{title}</h3>
          <p style={{ color: '#C9A96E', fontFamily: 'Poppins,sans-serif', fontWeight: 500, fontSize: 16, margin: '0 0 10px' }}>{price}</p>
          <p style={{ color: '#6B6B6B', fontFamily: 'Poppins,sans-serif', fontSize: 12, margin: '0 0 12px' }}>📍 {p.location_name}</p>
          <div style={{ display: 'flex', gap: 16, borderTop: '1px solid #E8E3DC', paddingTop: 12 }}>
            {p.bedrooms && <span style={{ fontSize: 12, color: '#6B6B6B', fontFamily: 'Poppins,sans-serif' }}>🛏 {p.bedrooms} bd</span>}
            {p.bathrooms && <span style={{ fontSize: 12, color: '#6B6B6B', fontFamily: 'Poppins,sans-serif' }}>🚿 {p.bathrooms} ba</span>}
            {p.construction_size_sqm && <span style={{ fontSize: 12, color: '#6B6B6B', fontFamily: 'Poppins,sans-serif' }}>📐 {p.construction_size_sqm} m²</span>}
          </div>
        </div>
      </div>
    </Link>
  )
}
