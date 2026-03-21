import { createClient } from '@supabase/supabase-js'

// Source of truth — Lovable's Supabase, same as drhousing.net
// Read client-side (browser) only — bypasses server-side RLS
const supabaseUrl = 'https://vtmesmtcnazoqaputoqs.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0bWVzbXRjbmF6b3FhcHV0b3FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MDQ2NTgsImV4cCI6MjA4NTI4MDY1OH0.lOIODVQJqc48FjoqpYhraDFdloG6hn6cKWkyORAKs7w'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Property = {
  id: string
  slug: string
  title: string
  title_en: string
  description: string
  description_en: string
  price: number
  bedrooms: number
  bathrooms: number
  square_meters: number
  lot_size: number
  property_type: string
  listing_type: string
  location: string
  neighborhood: string
  images: string[]
  main_image: string
  featured: boolean
  hidden: boolean
  status: string
  amenities: string[]
  plusvalia_notes: string
  created_at: string
}

export const UNAVAILABLE_STATUSES = ['sold', 'rented']

// Always English on realtycr.org — never fall back to Spanish
export function getTitle(p: Property): string {
  return p.title_en || '(No English title)'
}

export function getDescription(p: Property): string {
  return p.description_en || ''
}

export function getPrice(p: Property): string {
  if (p.price) return `$${Number(p.price).toLocaleString()}`
  return 'Price on request'
}

export function getMainImage(p: Property): string {
  return p.main_image || p.images?.[0] || ''
}
