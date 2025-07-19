// src/app/profile/page.jsx
'use client'
import React, { useState, useEffect } from 'react'
import axios                          from 'axios'
import { useSession, signOut }       from 'next-auth/react'
import { useRouter }                  from 'next/navigation'
import Link                           from 'next/link'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [form, setForm] = useState({ name: '', password: '' })

  // Redirect & prefill
  useEffect(() => {
    if (status === 'authenticated') {
      setForm({ name: session.user.name, password: '' })
    } else if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, session, router])

  const handleSubmit = async e => {
    e.preventDefault()
    await axios.put('/api/user', form)
    alert('Profile updated!')
  }

  if (status === 'loading') return <p style={{ padding: '2rem', textAlign: 'center' }}>Loading…</p>

  // — NAVBAR STYLES (copy into every page)
  const headerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    background: '#fff',
    borderBottom: '1px solid #eee',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  }
  const logoStyles = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2e7d32',
    fontFamily: `'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
  }
  const navStyles  = { display: 'flex', gap: '20px', alignItems: 'center' }
  const linkStyles = { color: '#555', textDecoration: 'none', fontSize: '16px' }
  const btnStyles  = {
    ...linkStyles,
    background: '#d32f2f',
    color: '#fff',
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  }

  // — FORM / PAGE CONTAINER STYLES
  const container  = { maxWidth: '600px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui, sans-serif' }
  const formStyles = { display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }
  const labelStyles= { fontSize: '14px', display: 'flex', flexDirection: 'column' }
  const inputStyles= { padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px', marginTop: '4px' }
  const submitStyles= { padding: '10px 16px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }

  return (
    <>
      {/* NAV BAR */}
      <header style={headerStyles}>
        <div style={logoStyles}>Sensegrass</div>
        <nav style={navStyles}>
          <Link href="/"         style={linkStyles}>Home</Link>
          <Link href="/properties" style={linkStyles}>Properties</Link>
          <Link href="/dashboard"  style={linkStyles}>Dashboard</Link>
          <Link href="/profile"    style={linkStyles}>Profile</Link>
          {session
            ? <button onClick={() => signOut({ callbackUrl: '/' })} style={btnStyles}>Logout</button>
            : <Link href="/login" style={linkStyles}>Login / Register</Link>
          }
        </nav>
      </header>

      {/* PROFILE FORM */}
      <div style={container}>
        <h2>Profile Settings</h2>
        <form onSubmit={handleSubmit} style={formStyles}>
          <label style={labelStyles}>
            Name:
            <input
              required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              style={inputStyles}
            />
          </label>

          <label style={labelStyles}>
            New Password:
            <input
              type="password"
              placeholder="Leave blank to keep current"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              style={inputStyles}
            />
          </label>

          <button type="submit" style={submitStyles}>Save Changes</button>
        </form>
      </div>
    </>
  )
}
