import Link from 'next/link'
import { Property } from '@/lib/supabase'

export default function PropertyCard({ property: p }: { property: Property }) {
  const img = p.main_image || (p.images && p.images[0]) || '/placeholder.jpg'
  const price = p.price ? `$${p.price.toLocaleString()}` : 'Price on request'

  return (
    <Link href={`/property/${p.slug}`} style={{ textDecoration: 'none' }}>
      <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', border: '1px solid #E8E3DC', transition: 'box-shadow 0.2s', cursor: 'pointer' }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)')}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
        <div style={{ position: 'relative', paddingTop: '66%', overflow: 'hidden' }}>
          <img src={img} alt={p.title_en || p.title} loading="lazy"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <span style={{ position: 'absolute', top: 12, right: 12, background: '#C9A96E', color: '#fff', padding: '4px 10px', borderRadius: 4, fontSize: 11, fontFamily: 'Poppins', fontWeight: 500, textTransform: 'capitalize' }}>
            {p.listing_type || 'Sale'}
          </span>
        </div>
        <div style={{ padding: '18px 20px' }}>
          <h3 style={{ fontFamily: 'Lora, serif', fontSize: 17, color: '#1A1A1A', margin: '0 0 6px', lineHeight: 1.3 }}>
            {p.title_en || p.title}
          </h3>
          <p style={{ color: '#C9A96E', fontFamily: 'Poppins', fontWeight: 500, fontSize: 16, margin: '0 0 10px' }}>{price}</p>
          <p style={{ color: '#6B6B6B', fontFamily: 'Poppins', fontSize: 12, margin: '0 0 12px' }}>
            📍 {p.neighborhood || p.location}
          </p>
          <div style={{ display: 'flex', gap: 16, borderTop: '1px solid #E8E3DC', paddingTop: 12 }}>
            {p.bedrooms && <span style={{ fontSize: 12, color: '#6B6B6B', fontFamily: 'Poppins' }}>🛏 {p.bedrooms} bd</span>}
            {p.bathrooms && <span style={{ fontSize: 12, color: '#6B6B6B', fontFamily: 'Poppins' }}>🚿 {p.bathrooms} ba</span>}
            {p.square_meters && <span style={{ fontSize: 12, color: '#6B6B6B', fontFamily: 'Poppins' }}>📐 {p.square_meters} m²</span>}
          </div>
        </div>
      </div>
    </Link>
  )
}
