'use client'
import { useState, useEffect } from 'react'
import { supabase, Property, getTitle, getPrice, getMainImage } from '@/lib/supabase'
import PropertyCard from './PropertyCard'

const LOCATIONS = ['All', 'Escazú', 'Santa Ana', 'La Guácima', 'Ciudad Colón', 'Alajuela']
const TYPES = ['All', 'house', 'apartment', 'land', 'commercial']
const LISTINGS = ['All', 'sale', 'rent']

export default function CatalogClient({ properties: initial }: { properties: Property[] }) {
  const [properties, setProperties] = useState<Property[]>(initial)
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState('All')
  const [type, setType] = useState('All')
  const [listing, setListing] = useState('All')

  useEffect(() => {
    supabase
      .from('properties')
      .select('id,slug,title,title_en,price,bedrooms,bathrooms,square_meters,location,neighborhood,property_type,listing_type,status,images,main_image,featured,hidden')
      .eq('hidden', false)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setProperties((data as Property[]) || [])
        setLoading(false)
      })
  }, [])

  const filtered = properties.filter(p => {
    const locMatch = location === 'All' ||
      p.location?.toLowerCase().includes(location.toLowerCase()) ||
      p.neighborhood?.toLowerCase().includes(location.toLowerCase())
    const typeMatch = type === 'All' || p.property_type === type
    const listMatch = listing === 'All' || p.listing_type === listing
    return locMatch && typeMatch && listMatch
  })

  const selectStyle = {
    padding: '10px 16px', border: '1px solid #E8E3DC', borderRadius: 8,
    background: '#fff', fontFamily: 'Poppins, sans-serif', fontSize: 13,
    color: '#1A1A1A', cursor: 'pointer', minWidth: 140,
  }

  return (
    <main className="catalog-main">
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Lora, serif', fontSize: 32, color: '#1A1A1A', marginBottom: 8 }}>
          Properties
        </h1>
        <p style={{ color: '#6B6B6B', fontFamily: 'Poppins, sans-serif', fontSize: 14, marginBottom: 40 }}>
          Costa Rica · Western GAM Corridor
        </p>

        <div className="catalog-filters">
          {[
            { label: 'Location', value: location, set: setLocation, options: LOCATIONS },
            { label: 'Type', value: type, set: setType, options: TYPES },
            { label: 'Listing', value: listing, set: setListing, options: LISTINGS },
          ].map(f => (
            <select key={f.label} value={f.value} onChange={e => f.set(e.target.value)} style={selectStyle}>
              {f.options.map(o => (
                <option key={o} value={o}>
                  {o === 'All' ? `${f.label}: All` : o.charAt(0).toUpperCase() + o.slice(1)}
                </option>
              ))}
            </select>
          ))}
          <span style={{ color: '#6B6B6B', fontSize: 13, fontFamily: 'Poppins, sans-serif' }}>
            {loading ? 'Loading...' : `${filtered.length} ${filtered.length === 1 ? 'property' : 'properties'}`}
          </span>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 28 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 10, border: '1px solid #E8E3DC', overflow: 'hidden' }}>
                <div style={{ aspectRatio: '3/2', background: '#E8E3DC', animation: 'pulse 1.5s ease-in-out infinite' }} />
                <div style={{ padding: '18px 20px' }}>
                  <div style={{ height: 20, background: '#E8E3DC', borderRadius: 4, marginBottom: 8, animation: 'pulse 1.5s ease-in-out infinite' }} />
                  <div style={{ height: 16, background: '#E8E3DC', borderRadius: 4, width: '60%', animation: 'pulse 1.5s ease-in-out infinite' }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="catalog-grid">
              {filtered.map(p => <PropertyCard key={p.id} property={p} />)}
            </div>
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '80px 0', color: '#6B6B6B', fontFamily: 'Poppins, sans-serif' }}>
                No properties found.
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
