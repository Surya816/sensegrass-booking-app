// src/app/admin/users/page.jsx
'use client'

import React, { useState, useEffect } from 'react'
import { useSession, signOut }       from 'next-auth/react'
import Link                           from 'next/link'
import axios                          from 'axios'

export default function AdminUsers() {
  const { data: session } = useSession()
  const [users, setUsers] = useState([])

  useEffect(() => {
    axios.get('/api/users')
      .then(r => setUsers(r.data))
      .catch(console.error)
  }, [])

  // — NAVBAR STYLES
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

  // — PAGE & TABLE STYLES
  const container = {
    maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem',
    fontFamily: 'system-ui, sans-serif', color: '#171717',
  }
  const tableWrapper = { overflowX: 'auto', marginTop: '1rem' }
  const table = { width: '100%', borderCollapse: 'collapse' }
  const thtd = {
    padding: '0.75rem 1rem', border: '1px solid #ddd', textAlign: 'left',
  }
  const thead = { background: '#f9f9f9' }

  return (
    <>
      {/* NAV BAR */}
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
        <h2>All Users</h2>
        <div style={tableWrapper}>
          <table style={table}>
            <thead style={thead}>
              <tr>
                <th style={thtd}>Name</th>
                <th style={thtd}>Email</th>
                <th style={thtd}>Role</th>
                <th style={thtd}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td style={thtd}>{u.name}</td>
                  <td style={thtd}>{u.email}</td>
                  <td style={thtd}>{u.role}</td>
                  <td style={thtd}>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
