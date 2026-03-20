import Link from 'next/link'
export default function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#F5F2EE', fontFamily: 'Poppins, sans-serif' }}>
      <h1 style={{ fontFamily: 'Lora, serif', fontSize: 32, color: '#1A1A1A', marginBottom: 12 }}>Property not found</h1>
      <p style={{ color: '#6B6B6B', marginBottom: 32 }}>This property may no longer be available.</p>
      <Link href="/" style={{ padding: '12px 28px', background: '#C9A96E', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 500 }}>View all properties</Link>
    </div>
  )
}
