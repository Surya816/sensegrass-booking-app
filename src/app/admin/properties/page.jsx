// src/app/admin/properties/page.jsx
'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'

export default function AdminProperties() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // redirect non-admins
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated' && session.user.role !== 'admin') {
      router.push('/')
    }
  }, [status, session, router])

  // --- nav/header styles (reuse in Home/Properties/Dashboard too)
  const headerStyles = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '20px 40px', background: '#fff', borderBottom: '1px solid #eee',
    position: 'sticky', top: 0, zIndex: 10,
  }
  const logoStyles = {
    fontSize: '24px', fontWeight: 'bold', color: '#2e7d32',
    fontFamily: `'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
  }
  const navStyles = { display: 'flex', gap: '20px', alignItems: 'center' }
  const linkStyles = { color: '#555', textDecoration: 'none', fontSize: '16px' }
  const btnStyles = {
    ...linkStyles,
    background: '#d32f2f', color: '#fff', padding: '6px 12px',
    border: 'none', borderRadius: '4px', cursor: 'pointer',
  }

  // --- component state
  const [properties, setProperties] = useState([])
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    lat: '',
    lng: '',
    files: [],       // ← store File objects here
  })
  const [editId, setEditId] = useState(null)

  // fetch list
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get('/api/properties')
        setProperties(data)
      } catch (e) {
        console.error(e)
      }
    })()
  }, [])

  // handle file selection
  const handleFilesChange = e => {
    setForm(f => ({ ...f, files: Array.from(e.target.files) }))
  }

  // create/update
  const handleSubmit = async e => {
    e.preventDefault()
    const fd = new FormData()
    fd.append('title', form.title)
    fd.append('description', form.description)
    fd.append('price', form.price)
    fd.append('lat', form.lat)
    fd.append('lng', form.lng)
    form.files.forEach(file => fd.append('images', file))

    try {
      let res
      if (editId) {
        res = await axios.put(`/api/properties/${editId}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        setProperties(props =>
          props.map(p => (p._id === editId ? res.data : p))
        )
      } else {
        res = await axios.post('/api/properties', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        setProperties(props => [res.data, ...props])
      }
      resetForm()
    } catch (err) {
      console.error(err)
    }
  }

  // load into form for edit
  const startEdit = p => {
    setEditId(p._id)
    setForm({
      title: p.title,
      description: p.description,
      price: p.price,
      lat: p.location.lat,
      lng: p.location.lng,
      files: [],        // clear files—preview existing via URLs if you like
    })
  }

  const resetForm = () => {
    setEditId(null)
    setForm({ title:'', description:'', price:'', lat:'', lng:'', files:[] })
  }

  return (
    <>
      {/* HEADER / NAV */}
      <header style={headerStyles}>
        <div style={logoStyles}>Sensegrass</div>
        <nav style={navStyles}>
          <Link href="/" style={linkStyles}>Home</Link>
          <Link href="/properties" style={linkStyles}>Properties</Link>
          <Link href="/dashboard" style={linkStyles}>Dashboard</Link>
          <button onClick={() => signOut({ callbackUrl: '/' })} style={btnStyles}>
            Logout
          </button>
        </nav>
      </header>

      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h2>{editId ? 'Edit Property' : 'Create Property'}</h2>

        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <input
            placeholder="Title"
            required
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            style={{ width: '100%', marginBottom: '8px' }}
          />

          <textarea
            placeholder="Description"
            required
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            style={{ width: '100%', marginBottom: '8px' }}
          />

          <input
            placeholder="Price"
            type="number"
            required
            value={form.price}
            onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
            style={{ width: '100%', marginBottom: '8px' }}
          />

          <input
            placeholder="Latitude"
            required
            value={form.lat}
            onChange={e => setForm(f => ({ ...f, lat: e.target.value }))}
            style={{ width: '48%', marginRight: '4%', marginBottom: '8px' }}
          />
          <input
            placeholder="Longitude"
            required
            value={form.lng}
            onChange={e => setForm(f => ({ ...f, lng: e.target.value }))}
            style={{ width: '48%', marginBottom: '8px' }}
          />

          <label style={{ display:'block', margin: '12px 0 4px' }}>
            Images
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFilesChange}
              style={{ display: 'block', marginTop: '4px' }}
            />
          </label>

          {/* preview new files */}
          {form.files.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', margin: '12px 0' }}>
              {form.files.map((f,i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(f)}
                  alt={f.name}
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                />
              ))}
            </div>
          )}

          <button type="submit" style={{ padding: '8px 16px' }}>
            {editId ? 'Update Property' : 'Create Property'}
          </button>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              style={{ marginLeft: '1rem', padding: '8px 16px' }}
            >
              Cancel
            </button>
          )}
        </form>

        <h3>Existing Properties</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {properties.map(p => (
            <li key={p._id} style={{ marginBottom: '1rem', padding: '12px', border: '1px solid #eee', borderRadius: '6px' }}>
              <strong>{p.title}</strong> — ₹{p.price}
              <div style={{ marginTop: '8px' }}>
                <button onClick={() => startEdit(p)}>Edit</button>
                <button
                  onClick={() => {
                    if (confirm('Delete this property?')) {
                      axios.delete(`/api/properties/${p._id}`).then(fetchProperties)
                    }
                  }}
                  style={{ marginLeft: '8px' }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
