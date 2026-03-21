import { createClient } from '@supabase/supabase-js'

// Lovable's Supabase — source of truth, same as drhousing.net
const supabaseUrl = 'https://vtmesmtcnazoqaputoqs.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0bWVzbXRjbmF6b3FhcHV0b3FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MDQ2NTgsImV4cCI6MjA4NTI4MDY1OH0.lOIODVQJqc48FjoqpYhraDFdloG6hn6cKWkyORAKs7w'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// REAL Lovable schema — verified from live DB
export type Property = {
  id: string
  slug: string
  title: string
  title_en: string
  description: string
  description_en: string
  price_sale: number
  price_rent_monthly: number
  currency: string
  bedrooms: number
  bathrooms: number
  construction_size_sqm: number
  land_size_sqm: number
  location_name: string
  property_type: string
  status: string          // for_sale | for_rent | both | sold | rented
  images: string[]
  featured_images: string[]
  featured: boolean
  hidden: boolean
  amenities: string[]
  amenities_en: string[]
  plusvalia_notes: string
  created_at: string
}

// Catalog select — only fields needed for the grid
export const CATALOG_SELECT = 'id,slug,title_en,price_sale,price_rent_monthly,bedrooms,bathrooms,construction_size_sqm,location_name,property_type,status,images,featured_images,featured,hidden'

// Detail select — everything
export const DETAIL_SELECT = '*'

// English-only helpers
export function getTitle(p: Property): string {
  return p.title_en || p.title || 'Untitled'
}

export function getDescription(p: Property): string {
  return p.description_en || ''
}

export function getPrice(p: Property): string {
  if (p.price_sale) return `$${Number(p.price_sale).toLocaleString()}`
  if (p.price_rent_monthly) return `$${Number(p.price_rent_monthly).toLocaleString()}/mo`
  return 'Price on request'
}

export function getMainImage(p: Property): string {
  return p.featured_images?.[0] || p.images?.[0] || ''
}

export function getListingLabel(p: Property): string {
  if (p.status === 'for_rent') return 'For Rent'
  if (p.status === 'both') return 'Sale & Rent'
  if (p.status === 'sold') return 'Sold'
  if (p.status === 'rented') return 'Rented'
  return 'For Sale'
}
