'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n)
}

export default function PropertyDetailClient({ property: p, similar }: { property: any; similar: any[] }) {
  const [activeImg, setActiveImg] = useState(0)
  const images = [p.main_image, ...(p.images || []).filter((i:string) => i !== p.main_image)].filter(Boolean)

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 80 }}>
      {/* Back */}
      <div style={{ padding: '24px 40px 0' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 14, fontFamily: 'Poppins,sans-serif', textDecoration: 'none' }}>
          ← Back to properties
        </Link>
      </div>

      {/* Hero image */}
      <div style={{ margin: '24px 40px 0', borderRadius: 12, overflow: 'hidden', position: 'relative', height: 'clamp(300px,50vw,560px)', background: '#eee' }}>
        {images[activeImg] && (
          <Image src={images[activeImg]} alt={p.title_en || p.title || ''} fill style={{ objectFit: 'cover' }} sizes="100vw" priority />
        )}
        <div style={{ position: 'absolute', bottom: 16, right: 16, background: 'rgba(26,26,26,0.82)', color: 'white', padding: '6px 14px', borderRadius: 8, fontSize: 14, fontFamily: 'Poppins,sans-serif', fontWeight: 500 }}>
          {p.listing_type === 'sale' ? 'For Sale' : 'For Rent'}
        </div>
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div style={{ margin: '12px 40px 0', display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
          {images.map((img: string, i: number) => (
            <button key={i} onClick={() => setActiveImg(i)} style={{ flexShrink: 0, width: 80, height: 60, borderRadius: 6, overflow: 'hidden', border: `2px solid ${activeImg === i ? 'var(--gold)' : 'transparent'}`, cursor: 'pointer', padding: 0, background: 'none', position: 'relative' }}>
              <Image src={img} alt="" fill style={{ objectFit: 'cover' }} sizes="80px" />
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div style={{ margin: '32px 40px 0', display: 'grid', gridTemplateColumns: '1fr min(340px,35%)', gap: 48, alignItems: 'start' }}>
        {/* Left */}
        <div>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, fontFamily: 'Poppins,sans-serif', marginBottom: 8 }}>📍 {p.location}{p.neighborhood ? ` · ${p.neighborhood}` : ''}</p>
          <h1 style={{ fontFamily: 'Lora,serif', fontSize: 'clamp(22px,3vw,36px)', fontWeight: 600, lineHeight: 1.2, marginBottom: 16 }}>{p.title_en || p.title}</h1>

          {/* Specs */}
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', padding: '20px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 32 }}>
            {p.bedrooms && <div style={{ textAlign: 'center' }}><div style={{ fontSize: 22 }}>🛏</div><div style={{ fontFamily: 'Poppins,sans-serif', fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{p.bedrooms} Bed</div></div>}
            {p.bathrooms && <div style={{ textAlign: 'center' }}><div style={{ fontSize: 22 }}>🚿</div><div style={{ fontFamily: 'Poppins,sans-serif', fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{p.bathrooms} Bath</div></div>}
            {p.square_meters && <div style={{ textAlign: 'center' }}><div style={{ fontSize: 22 }}>📐</div><div style={{ fontFamily: 'Poppins,sans-serif', fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{p.square_meters} m²</div></div>}
            {p.lot_size && <div style={{ textAlign: 'center' }}><div style={{ fontSize: 22 }}>🌿</div><div style={{ fontFamily: 'Poppins,sans-serif', fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{p.lot_size} m² lot</div></div>}
          </div>

          {/* Description */}
          {(p.description_en || p.description) && (
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontFamily: 'Lora,serif', fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Description</h2>
              <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: 15, lineHeight: 1.8, color: 'var(--text)', whiteSpace: 'pre-wrap' }}>{p.description_en || p.description}</div>
            </div>
          )}

          {/* Amenities */}
          {p.amenities?.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontFamily: 'Lora,serif', fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Amenities</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {p.amenities.map((a: string, i: number) => (
                  <span key={i} style={{ padding: '6px 14px', background: 'white', border: '1px solid var(--border)', borderRadius: 20, fontSize: 13, fontFamily: 'Poppins,sans-serif', color: 'var(--text)' }}>{a}</span>
                ))}
              </div>
            </div>
          )}

          {/* Plusvalia */}
          {p.plusvalia_notes && (
            <div style={{ marginBottom: 32, padding: '24px', background: 'white', borderRadius: 10, borderLeft: '4px solid var(--gold)' }}>
              <h2 style={{ fontFamily: 'Lora,serif', fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Investment Perspective</h2>
              <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: 14, lineHeight: 1.8, color: 'var(--text)', whiteSpace: 'pre-wrap' }}>{p.plusvalia_notes}</div>
            </div>
          )}
        </div>

        {/* Right — Price card */}
        <div style={{ position: 'sticky', top: 32, background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: 28, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <div style={{ fontFamily: 'Lora,serif', fontSize: 'clamp(24px,3vw,32px)', fontWeight: 600, color: 'var(--gold)', marginBottom: 20 }}>
            {p.price ? fmt(p.price) : 'Contact for price'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14, fontFamily: 'Poppins,sans-serif', color: 'var(--text-muted)' }}>
            {p.property_type && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Type</span><span style={{ color: 'var(--text)', textTransform: 'capitalize' }}>{p.property_type}</span></div>}
            {p.listing_type && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Listing</span><span style={{ color: 'var(--text)', textTransform: 'capitalize' }}>{p.listing_type === 'sale' ? 'For Sale' : 'For Rent'}</span></div>}
            {p.location && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Location</span><span style={{ color: 'var(--text)' }}>{p.location}</span></div>}
            {p.square_meters && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Size</span><span style={{ color: 'var(--text)' }}>{p.square_meters} m²</span></div>}
          </div>
        </div>
      </div>

      {/* Similar properties */}
      {similar.length > 0 && (
        <div style={{ margin: '64px 40px 0' }}>
          <h2 style={{ fontFamily: 'Lora,serif', fontSize: 24, fontWeight: 600, marginBottom: 28 }}>Similar Properties</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 24 }}>
            {similar.map(s => (
              <Link key={s.id} href={`/property/${s.slug}`} style={{ display: 'block', background: 'white', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.10)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
                <div style={{ position: 'relative', height: 180, background: '#eee' }}>
                  {s.main_image && <Image src={s.main_image} alt={s.title_en || s.title || ''} fill style={{ objectFit: 'cover' }} sizes="320px" />}
                </div>
                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontFamily: 'Lora,serif', fontSize: 15, fontWeight: 600, marginBottom: 6, lineHeight: 1.3 }}>{s.title_en || s.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: 12, fontFamily: 'Poppins,sans-serif', marginBottom: 10 }}>📍 {s.location}</p>
                  <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-muted)', fontFamily: 'Poppins,sans-serif', marginBottom: 10 }}>
                    {s.bedrooms && <span>🛏 {s.bedrooms}</span>}
                    {s.bathrooms && <span>🚿 {s.bathrooms}</span>}
                    {s.square_meters && <span>📐 {s.square_meters}m²</span>}
                  </div>
                  <span style={{ fontFamily: 'Lora,serif', fontSize: 17, fontWeight: 600, color: 'var(--gold)' }}>{s.price ? fmt(s.price) : '—'}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
