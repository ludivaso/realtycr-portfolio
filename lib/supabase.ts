import { createClient } from '@supabase/supabase-js'

// YOUR Supabase — fully owned, no RLS restrictions
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
  price: number
  bedrooms: number
  bathrooms: number
  square_meters: number
  lot_size: number
  property_type: string
  listing_type: string
  location: string
  province: string
  neighborhood: string
  images: string[]
  main_image: string
  featured: boolean
  hidden: boolean
  amenities: string[]
  plusvalia_notes: string
  created_at: string
}
