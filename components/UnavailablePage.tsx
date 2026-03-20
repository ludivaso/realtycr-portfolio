import Link from 'next/link'

export default function UnavailablePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#F5F2EE', fontFamily: 'Poppins, sans-serif', padding: 24, textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 24 }}>🏠</div>
      <h1 style={{ fontFamily: 'Lora, serif', fontSize: 28, color: '#1A1A1A', marginBottom: 12 }}>
        Property No Longer Available
      </h1>
      <p style={{ color: '#6B6B6B', fontSize: 15, marginBottom: 8, maxWidth: 400 }}>
        This property has already been sold or rented.
      </p>
      <p style={{ color: '#6B6B6B', fontSize: 14, marginBottom: 40, maxWidth: 400 }}>
        Esta propiedad ya ha sido vendida o alquilada.
      </p>
      <Link href="/" style={{ padding: '14px 32px', background: '#C9A96E', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 500, fontSize: 14 }}>
        View Available Properties
      </Link>
    </div>
  )
}
