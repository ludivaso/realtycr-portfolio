import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gihiibbzrmgyarfeujpl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpaGlpYmJ6cm1neWFyZmV1anBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NzY5MDcsImV4cCI6MjA4OTU1MjkwN30.Qv_C-Ur3jqndsa16xFfhxkV9Z3ovG4nLqHqM-hcS57Y'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
  status: string
  images: string[]
  featured: boolean
  amenities: string[]
  plusvalia_notes: string
  created_at: string
}

// These statuses = property no longer available — hide from catalog
export const UNAVAILABLE_STATUSES = ['sold', 'rented']

export function isAvailable(p: Property) {
  return !UNAVAILABLE_STATUSES.includes(p.status)
}

export function getPrice(p: Property): string {
  if (p.price_sale) return `$${p.price_sale.toLocaleString()}`
  if (p.price_rent_monthly) return `$${p.price_rent_monthly.toLocaleString()}/mo`
  return 'Price on request'
}

export function getMainImage(p: Property): string {
  return p.images?.[0] || ''
}
