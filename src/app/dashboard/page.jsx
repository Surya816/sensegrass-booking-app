// src/app/dashboard/page.jsx
'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter }            from 'next/navigation'
import { useEffect, useState }  from 'react'
import axios                     from 'axios'
import Link                      from 'next/link'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // User bookings
  const [bookings, setBookings] = useState([])
  // Admin metrics
  const [stats, setStats] = useState({ properties: 0, bookings: 0 })

  // Styles
  const headerStyles = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '20px 40px', background: '#fff', borderBottom: '1px solid #eee',
    position: 'sticky', top: 0, zIndex: 10,
  }
  const logoStyles = {
    fontSize: '24px', fontWeight: 'bold', color: '#2e7d32',
    fontFamily: `'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
  }
  const navStyles  = { display: 'flex', gap: '20px', alignItems: 'center' }
  const linkStyles = { color: '#555', textDecoration: 'none', fontSize: '16px' }
  const btnStyles  = {
    ...linkStyles,
    background: '#d32f2f', color: '#fff', padding: '6px 12px',
    border: 'none', borderRadius: '4px', cursor: 'pointer',
  }

  const container = {
    maxWidth: '900px', margin: '0 auto', padding: '2rem',
    fontFamily: 'system-ui, sans-serif', color: '#171717',
  }
  const section = {
    background: '#fff', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    padding: '1.5rem', marginBottom: '2rem',
  }
  const sectionTitle = {
    fontSize: '1.5rem', marginBottom: '1rem',
    borderBottom: '2px solid #eee', paddingBottom: '0.5rem',
  }
  const statsGrid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem',
  }
  const card = {
    background: '#fff', borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)', padding: '1rem',
    textAlign: 'center',
  }
  const cardTitle = { fontSize: '1rem', margin: '0 0 .5rem', color: '#555' }
  const cardValue = { fontSize: '1.5rem', margin: 0 }

  // Fetch data
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated' && session) {
      if (session.user.role === 'user') {
        // User bookings
        axios.get('/api/bookings')
          .then(res => setBookings(res.data))
          .catch(console.error)
      } else if (session.user.role === 'admin') {
        // Admin metrics
        axios.get('/api/properties')
          .then(res => setStats(s => ({ ...s, properties: res.data.length })))
          .catch(console.error)
        axios.get('/api/bookings?all=true')
          .then(res => setStats(s => ({ ...s, bookings: res.data.length })))
          .catch(console.error)
      }
    }
  }, [status, session, router])

  // Table styles for user
  const tableWrapper = { overflowX: 'auto' }
  const table = { width: '100%', borderCollapse: 'collapse' }
  const thtd = {
    padding: '0.75rem 1rem', borderBottom: '1px solid #ddd',
    textAlign: 'left',
  }
  const thead = { background: '#f9f9f9' }
  const emptyState = { color: '#888', textAlign: 'center', padding: '1rem 0' }

  return (
    <>
    <header style={headerStyles}>
      <div style={logoStyles}>Sensegrass</div>
      <nav style={navStyles}>
        <Link href="/" style={linkStyles}>Home</Link>
        <Link href="/properties" style={linkStyles}>Properties</Link>
        <Link href="/dashboard" style={linkStyles}>Dashboard</Link>
        <Link href="/profile" style={linkStyles}>Profile</Link>
        {session
          ? <button onClick={() => signOut({ callbackUrl: '/' })} style={btnStyles}>
              Logout
            </button>
          : <Link href="/login" style={linkStyles}>Login / Register</Link>
        }
      </nav>
    </header>


      <div style={container}>
        {status === 'loading' ? (
          <p style={{ textAlign: 'center', padding: '2rem' }}>Loading...</p>
        ) : (
          <>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              Welcome, {session.user.name}
            </h2>
            <p style={{ color: '#555', marginBottom: '1.5rem' }}>
              Role: {session.user.role}
            </p>

            {session.user.role === 'admin' ? (
              <>
                {/* Metrics Cards */}
                <div style={statsGrid}>
                  <div style={card}>
                    <p style={cardTitle}>Total Properties</p>
                    <p style={cardValue}>{stats.properties}</p>
                  </div>
                  <div style={card}>
                    <p style={cardTitle}>Total Bookings</p>
                    <p style={cardValue}>{stats.bookings}</p>
                  </div>
                </div>
                {/* Admin Links */}
                <section style={section}>
                  <h3 style={sectionTitle}>Admin Dashboard</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li><Link href="/admin/properties" style={linkStyles}>Manage Properties</Link></li>
                    <li style={{ marginTop: '0.75rem' }}><Link href="/admin/users" style={linkStyles}>View Users</Link></li>
                    <li style={{ marginTop: '0.75rem' }}><Link href="/admin/bookings" style={linkStyles}>View Bookings</Link></li>
                  </ul>
                </section>
              </>
            ) : (
              <section style={section}>
                <h3 style={sectionTitle}>My Bookings</h3>
                {bookings.length === 0 ? (
                  <p style={emptyState}>You have no bookings yet.</p>
                ) : (
                  <div style={tableWrapper}>
                    <table style={table}>
                      <thead style={thead}>
                        <tr>
                          {['Property','From','To','Paid'].map(text => (
                            <th key={text} style={thtd}>{text}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map(b => (
                          <tr key={b._id}>
                            <td style={thtd}>{b.property.title}</td>
                            <td style={thtd}>{new Date(b.fromDate).toLocaleDateString()}</td>
                            <td style={thtd}>{new Date(b.toDate).toLocaleDateString()}</td>
                            <td style={thtd}>{b.paid ? '✅' : '❌'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </div>
    </>
  )
}
