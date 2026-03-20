'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const LOCATIONS = ['All','Escazú','Santa Ana','La Guácima','Hacienda Los Reyes','Ciudad Colón']
const TYPES = ['All','sale','rent']

function fmt(n: number) {
  return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n)
}

export default function CatalogClient({ properties }: { properties: any[] }) {
  const [loc, setLoc] = useState('All')
  const [type, setType] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => properties.filter(p => {
    const matchLoc = loc === 'All' || p.location?.includes(loc) || p.neighborhood?.includes(loc)
    const matchType = type === 'All' || p.listing_type === type
    const matchSearch = !search || (p.title_en || p.title || '').toLowerCase().includes(search.toLowerCase())
    return matchLoc && matchType && matchSearch
  }), [properties, loc, type, search])

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', padding: '0 0 80px' }}>
      {/* Header */}
      <header style={{ padding: '48px 40px 32px', borderBottom: '1px solid var(--border)' }}>
        <h1 style={{ fontFamily: 'Lora,serif', fontSize: 'clamp(24px,4vw,40px)', fontWeight: 400, color: 'var(--text)', letterSpacing: '-0.5px' }}>
          Properties
          <span style={{ color: 'var(--gold)', marginLeft: 12, fontSize: '0.6em', fontWeight: 400, fontFamily: 'Poppins,sans-serif', letterSpacing: '2px', textTransform: 'uppercase' }}>Costa Rica</span>
        </h1>
        <p style={{ marginTop: 8, color: 'var(--text-muted)', fontSize: 14, fontFamily: 'Poppins,sans-serif' }}>
          Escazú · Santa Ana · La Guácima · Ruta 27
        </p>
      </header>

      {/* Filters */}
      <div style={{ padding: '24px 40px', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search properties..."
          style={{ padding: '10px 16px', border: '1px solid var(--border)', borderRadius: 8, fontFamily: 'Poppins,sans-serif', fontSize: 14, background: 'white', minWidth: 200, outline: 'none' }}
        />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {LOCATIONS.map(l => (
            <button key={l} onClick={() => setLoc(l)} style={{
              padding: '8px 16px', borderRadius: 8, border: '1px solid', cursor: 'pointer', fontSize: 13, fontFamily: 'Poppins,sans-serif', fontWeight: loc === l ? 500 : 400,
              background: loc === l ? 'var(--gold)' : 'white', borderColor: loc === l ? 'var(--gold)' : 'var(--border)', color: loc === l ? 'white' : 'var(--text)'
            }}>{l}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {TYPES.map(t => (
            <button key={t} onClick={() => setType(t)} style={{
              padding: '8px 16px', borderRadius: 8, border: '1px solid', cursor: 'pointer', fontSize: 13, fontFamily: 'Poppins,sans-serif', fontWeight: type === t ? 500 : 400, textTransform: 'capitalize',
              background: type === t ? 'var(--dark)' : 'white', borderColor: type === t ? 'var(--dark)' : 'var(--border)', color: type === t ? 'white' : 'var(--text)'
            }}>{t === 'All' ? 'All' : t === 'sale' ? 'For Sale' : 'For Rent'}</button>
          ))}
        </div>
        <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: 13, fontFamily: 'Poppins,sans-serif' }}>
          {filtered.length} {filtered.length === 1 ? 'property' : 'properties'}
        </span>
      </div>

      {/* Grid */}
      <div style={{ padding: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 28 }}>
        {filtered.map(p => (
          <Link key={p.id} href={`/property/${p.slug}`} style={{ display: 'block', background: 'white', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)', transition: 'box-shadow 0.2s', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
            <div style={{ position: 'relative', height: 220, background: '#eee', overflow: 'hidden' }}>
              {p.main_image ? (
                <Image src={p.main_image} alt={p.title_en || p.title || ''} fill style={{ objectFit: 'cover' }} sizes="400px" />
              ) : (
                <div style={{ width: '100%', height: '100%', background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No image</div>
              )}
              <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(26,26,26,0.82)', color: 'white', padding: '4px 10px', borderRadius: 6, fontSize: 12, fontFamily: 'Poppins,sans-serif', fontWeight: 500, textTransform: 'capitalize' }}>
                {p.listing_type === 'sale' ? 'For Sale' : 'For Rent'}
              </div>
            </div>
            <div style={{ padding: '20px 20px 16px' }}>
              <h3 style={{ fontFamily: 'Lora,serif', fontSize: 17, fontWeight: 600, color: 'var(--text)', lineHeight: 1.3, marginBottom: 6 }}>{p.title_en || p.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, fontFamily: 'Poppins,sans-serif', marginBottom: 12 }}>📍 {p.location}</p>
              <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--text-muted)', fontFamily: 'Poppins,sans-serif', marginBottom: 16 }}>
                {p.bedrooms && <span>🛏 {p.bedrooms} bd</span>}
                {p.bathrooms && <span>🚿 {p.bathrooms} ba</span>}
                {p.square_meters && <span>📐 {p.square_meters} m²</span>}
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                <span style={{ fontFamily: 'Lora,serif', fontSize: 20, fontWeight: 600, color: 'var(--gold)' }}>{p.price ? fmt(p.price) : 'Contact for price'}</span>
              </div>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)', fontFamily: 'Poppins,sans-serif' }}>
            No properties found.
          </div>
        )}
      </div>
    </main>
  )
}
