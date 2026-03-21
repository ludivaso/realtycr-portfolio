'use client'
import { useEffect, useState } from 'react'
import { supabase as lovableDb } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

// Diego's own Supabase — writable, stores visibility overrides
const adminDb = createClient(
  'https://gihiibbzrmgyarfeujpl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpaGlpYmJ6cm1neWFyZmV1anBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NzY5MDcsImV4cCI6MjA4OTU1MjkwN30.Qv_C-Ur3jqndsa16xFfhxkV9Z3ovG4nLqHqM-hcS57Y'
)

const ADMIN_PASSWORD = 'drhousing2024'

type PropRow = {
  id: string
  slug: string
  title_en: string
  title: string
  location_name: string
  property_type: string
  status: string
  hidden: boolean
  price_sale: number
  price_rent_monthly: number
  images: string[]
  featured_images: string[]
  // local override state
  overrideHidden?: boolean
}

export default function AdminClient() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [properties, setProperties] = useState<PropRow[]>([])
  const [overrides, setOverrides] = useState<Record<string, boolean>>({})
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [toast, setToast] = useState('')

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  useEffect(() => {
    if (!authed) return
    loadData()
  }, [authed])

  async function loadData() {
    setLoading(true)
    const [{ data: props }, { data: ov }] = await Promise.all([
      lovableDb.from('properties').select('id,slug,title_en,title,location_name,property_type,status,hidden,price_sale,price_rent_monthly,images,featured_images').order('created_at', { ascending: false }),
      adminDb.from('visibility_overrides').select('slug,hidden_override')
    ])
    const ovMap: Record<string, boolean> = {}
    ;(ov || []).forEach((r: any) => { ovMap[r.slug] = r.hidden_override })
    setOverrides(ovMap)
    setProperties((props as PropRow[]) || [])
    setLoading(false)
  }

  function isHiddenOnSite(p: PropRow): boolean {
    if (overrides[p.slug] !== undefined) return overrides[p.slug]
    return p.hidden
  }

  async function applyBulkAction(hideValue: boolean) {
    if (selected.size === 0) return
    setSaving(true)
    const slugs = [...selected]
    const upserts = slugs.map(slug => ({ slug, hidden_override: hideValue }))
    await adminDb.from('visibility_overrides').upsert(upserts, { onConflict: 'slug' })
    const newOv = { ...overrides }
    slugs.forEach(s => { newOv[s] = hideValue })
    setOverrides(newOv)
    setSelected(new Set())
    showToast(`${slugs.length} ${hideValue ? 'hidden' : 'shown'} on realtycr.org`)
    setSaving(false)
  }

  async function toggleOne(slug: string, currentlyHidden: boolean) {
    const newVal = !currentlyHidden
    await adminDb.from('visibility_overrides').upsert({ slug, hidden_override: newVal }, { onConflict: 'slug' })
    setOverrides(prev => ({ ...prev, [slug]: newVal }))
    showToast(newVal ? 'Hidden from site' : 'Visible on site')
  }

  const filtered = properties.filter(p => {
    const matchSearch = !search || (p.title_en || p.title || '').toLowerCase().includes(search.toLowerCase()) || p.location_name?.toLowerCase().includes(search.toLowerCase())
    const hidden = isHiddenOnSite(p)
    const matchFilter = filterStatus === 'all' || (filterStatus === 'visible' && !hidden) || (filterStatus === 'hidden' && hidden)
    return matchSearch && matchFilter
  })

  if (!authed) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#F5F2EE' }}>
      <div style={{ background:'#fff', padding:40, borderRadius:12, border:'1px solid #E8E3DC', width:320 }}>
        <h1 style={{ fontFamily:'Lora,serif', fontSize:24, color:'#1A1A1A', marginBottom:8 }}>Admin</h1>
        <p style={{ fontFamily:'Poppins,sans-serif', fontSize:13, color:'#6B6B6B', marginBottom:24 }}>realtycr.org visibility manager</p>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && password === ADMIN_PASSWORD && setAuthed(true)}
          style={{ width:'100%', padding:'10px 14px', border:'1px solid #E8E3DC', borderRadius:8, fontFamily:'Poppins,sans-serif', fontSize:14, marginBottom:12, boxSizing:'border-box' as const }}
        />
        <button
          onClick={() => password === ADMIN_PASSWORD ? setAuthed(true) : showToast('Wrong password')}
          style={{ width:'100%', padding:'12px', background:'#C9A96E', color:'#fff', border:'none', borderRadius:8, fontFamily:'Poppins,sans-serif', fontSize:14, fontWeight:500, cursor:'pointer' }}>
          Sign In
        </button>
        {toast && <p style={{ color:'#e55', fontFamily:'Poppins,sans-serif', fontSize:13, marginTop:12, textAlign:'center' }}>{toast}</p>}
      </div>
    </div>
  )

  const visibleCount = properties.filter(p => !isHiddenOnSite(p)).length
  const hiddenCount = properties.filter(p => isHiddenOnSite(p)).length

  return (
    <div style={{ background:'#F5F2EE', minHeight:'100vh', padding:'32px 24px' }}>
      {toast && (
        <div style={{ position:'fixed', top:24, right:24, background:'#2C2C2C', color:'#fff', padding:'12px 20px', borderRadius:8, fontFamily:'Poppins,sans-serif', fontSize:13, zIndex:1000 }}>
          {toast}
        </div>
      )}
      <div style={{ maxWidth:1200, margin:'0 auto' }}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:32, flexWrap:'wrap', gap:16 }}>
          <div>
            <h1 style={{ fontFamily:'Lora,serif', fontSize:28, color:'#1A1A1A', marginBottom:4 }}>Visibility Manager</h1>
            <p style={{ fontFamily:'Poppins,sans-serif', fontSize:13, color:'#6B6B6B' }}>
              {visibleCount} visible · {hiddenCount} hidden · {properties.length} total
            </p>
          </div>
          <a href="/" target="_blank" style={{ padding:'10px 20px', border:'1px solid #E8E3DC', borderRadius:8, fontFamily:'Poppins,sans-serif', fontSize:13, color:'#6B6B6B', textDecoration:'none' }}>
            View Site ↗
          </a>
        </div>

        {/* Controls */}
        <div style={{ display:'flex', gap:12, marginBottom:24, flexWrap:'wrap', alignItems:'center' }}>
          <input
            placeholder="Search by title or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex:1, minWidth:200, padding:'10px 14px', border:'1px solid #E8E3DC', borderRadius:8, fontFamily:'Poppins,sans-serif', fontSize:13, background:'#fff' }}
          />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            style={{ padding:'10px 14px', border:'1px solid #E8E3DC', borderRadius:8, fontFamily:'Poppins,sans-serif', fontSize:13, background:'#fff' }}>
            <option value="all">All</option>
            <option value="visible">Visible</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>

        {/* Bulk actions */}
        {selected.size > 0 && (
          <div style={{ display:'flex', gap:12, marginBottom:20, padding:'14px 20px', background:'#2C2C2C', borderRadius:8, alignItems:'center', flexWrap:'wrap' }}>
            <span style={{ fontFamily:'Poppins,sans-serif', fontSize:13, color:'#fff', flex:1 }}>
              {selected.size} selected
            </span>
            <button onClick={() => applyBulkAction(false)} disabled={saving}
              style={{ padding:'8px 20px', background:'#C9A96E', color:'#fff', border:'none', borderRadius:6, fontFamily:'Poppins,sans-serif', fontSize:13, fontWeight:500, cursor:'pointer' }}>
              Show on site
            </button>
            <button onClick={() => applyBulkAction(true)} disabled={saving}
              style={{ padding:'8px 20px', background:'#888', color:'#fff', border:'none', borderRadius:6, fontFamily:'Poppins,sans-serif', fontSize:13, fontWeight:500, cursor:'pointer' }}>
              Hide from site
            </button>
            <button onClick={() => setSelected(new Set())}
              style={{ padding:'8px 16px', background:'transparent', color:'#aaa', border:'1px solid #555', borderRadius:6, fontFamily:'Poppins,sans-serif', fontSize:13, cursor:'pointer' }}>
              Cancel
            </button>
          </div>
        )}

        {/* Select all */}
        <div style={{ display:'flex', gap:12, marginBottom:16, alignItems:'center' }}>
          <label style={{ display:'flex', gap:8, alignItems:'center', fontFamily:'Poppins,sans-serif', fontSize:13, color:'#6B6B6B', cursor:'pointer' }}>
            <input type="checkbox"
              checked={filtered.length > 0 && filtered.every(p => selected.has(p.slug))}
              onChange={e => {
                if (e.target.checked) setSelected(new Set(filtered.map(p => p.slug)))
                else setSelected(new Set())
              }}
            />
            Select all ({filtered.length})
          </label>
        </div>

        {/* Property list */}
        {loading ? (
          <div style={{ textAlign:'center', padding:80, color:'#6B6B6B', fontFamily:'Poppins,sans-serif' }}>Loading...</div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {filtered.map(p => {
              const hidden = isHiddenOnSite(p)
              const img = p.featured_images?.[0] || p.images?.[0] || ''
              const price = p.price_sale ? `$${Number(p.price_sale).toLocaleString()}` : p.price_rent_monthly ? `$${Number(p.price_rent_monthly).toLocaleString()}/mo` : '—'
              const isSelected = selected.has(p.slug)
              const hasOverride = overrides[p.slug] !== undefined

              return (
                <div key={p.slug} style={{
                  display:'flex', alignItems:'center', gap:16, padding:'14px 16px',
                  background: hidden ? '#f9f7f4' : '#fff',
                  borderRadius:8, border: isSelected ? '2px solid #C9A96E' : '1px solid #E8E3DC',
                  opacity: hidden ? 0.65 : 1, transition:'all 0.15s'
                }}>
                  <input type="checkbox" checked={isSelected}
                    onChange={e => {
                      const s = new Set(selected)
                      e.target.checked ? s.add(p.slug) : s.delete(p.slug)
                      setSelected(s)
                    }}
                    style={{ width:16, height:16, flexShrink:0, cursor:'pointer' }}
                  />

                  {/* Thumbnail */}
                  <div style={{ width:64, height:44, borderRadius:6, overflow:'hidden', background:'#E8E3DC', flexShrink:0 }}>
                    {img && <img src={img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />}
                  </div>

                  {/* Info */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontFamily:'Poppins,sans-serif', fontSize:14, fontWeight:500, color:'#1A1A1A', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {p.title_en || p.title}
                    </p>
                    <p style={{ fontFamily:'Poppins,sans-serif', fontSize:12, color:'#6B6B6B', margin:'2px 0 0' }}>
                      {p.location_name} · {p.property_type} · {price}
                    </p>
                  </div>

                  {/* Status badges */}
                  <div style={{ display:'flex', gap:8, alignItems:'center', flexShrink:0 }}>
                    {hasOverride && (
                      <span style={{ fontSize:10, padding:'2px 8px', borderRadius:4, background:'#fff3cd', color:'#856404', fontFamily:'Poppins,sans-serif', fontWeight:500 }}>
                        overridden
                      </span>
                    )}
                    <span style={{ fontSize:11, padding:'4px 10px', borderRadius:4, fontFamily:'Poppins,sans-serif', fontWeight:500,
                      background: hidden ? '#E8E3DC' : '#e8f5e9', color: hidden ? '#888' : '#2e7d32' }}>
                      {hidden ? 'Hidden' : 'Visible'}
                    </span>

                    {/* Toggle */}
                    <button onClick={() => toggleOne(p.slug, hidden)}
                      style={{ padding:'6px 14px', border:'1px solid #E8E3DC', borderRadius:6, fontFamily:'Poppins,sans-serif', fontSize:12,
                        background: hidden ? '#C9A96E' : '#f5f5f5', color: hidden ? '#fff' : '#666', cursor:'pointer', fontWeight:500, whiteSpace:'nowrap' }}>
                      {hidden ? 'Show' : 'Hide'}
                    </button>

                    <a href={`/property/${p.slug}`} target="_blank"
                      style={{ padding:'6px 12px', border:'1px solid #E8E3DC', borderRadius:6, fontFamily:'Poppins,sans-serif', fontSize:12, color:'#6B6B6B', textDecoration:'none' }}>
                      ↗
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:60, color:'#6B6B6B', fontFamily:'Poppins,sans-serif' }}>No properties found.</div>
        )}
      </div>
    </div>
  )
}
