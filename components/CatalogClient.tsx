'use client'
import { useState } from 'react'
import { Property, getPrice, getMainImage } from '@/lib/supabase'
import PropertyCard from './PropertyCard'

const LOCATIONS = ['All', 'Escazú', 'Santa Ana', 'La Guácima', 'Ciudad Colón', 'Alajuela']
const TYPES = ['All', 'house', 'apartment', 'land', 'commercial']
const LISTINGS = ['All', 'for_sale', 'for_rent']

export default function CatalogClient({ properties }: { properties: Property[] }) {
  const [location, setLocation] = useState('All')
  const [type, setType] = useState('All')
  const [listing, setListing] = useState('All')

  const filtered = properties.filter(p => {
    const locMatch = location === 'All' || p.location_name?.toLowerCase().includes(location.toLowerCase())
    const typeMatch = type === 'All' || p.property_type === type
    const listMatch = listing === 'All' || p.status === listing || p.status === 'both'
    return locMatch && typeMatch && listMatch
  })

  const listingLabel: Record<string,string> = { for_sale: 'For Sale', for_rent: 'For Rent' }
  const selectStyle = {
    padding: '10px 16px', border: '1px solid #E8E3DC', borderRadius: 8,
    background: '#fff', fontFamily: 'Poppins, sans-serif', fontSize: 13,
    color: '#1A1A1A', cursor: 'pointer', minWidth: 140,
  }

  return (
    <main className="catalog-main">
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Lora, serif', fontSize: 32, color: '#1A1A1A', marginBottom: 8 }}>
          Propiedades <span style={{ color: '#C9A96E' }}>/ Properties</span>
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
                  {o === 'All' ? `${f.label}: All` : (listingLabel[o] || o.charAt(0).toUpperCase() + o.slice(1))}
                </option>
              ))}
            </select>
          ))}
          <span style={{ color: '#6B6B6B', fontSize: 13, fontFamily: 'Poppins, sans-serif' }}>
            {filtered.length} {filtered.length === 1 ? 'property' : 'properties'}
          </span>
        </div>

        <div className="catalog-grid">
          {filtered.map(p => <PropertyCard key={p.id} property={p} />)}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#6B6B6B', fontFamily: 'Poppins, sans-serif' }}>
            No properties found.
          </div>
        )}
      </div>
    </main>
  )
}
