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
  const [previewUrl, setPreviewUrl] = useState(null);
  const [removedImages, setRemovedImages] = useState([]);

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
    existingImages: [],  // ✅ for showing existing URLs when editing
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
        form.removedImages = removedImages; // ⬅️ add to FormData via JSON blob
        fd.append('removedImages', JSON.stringify(removedImages));
      }
      
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
      existingImages: p.images || [],
    })
  }

  const resetForm = () => {
    setEditId(null)
    setRemovedImages([]);
    setForm({ title:'', description:'', price:'', lat:'', lng:'', files:[] ,existingImages: [], })
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

        <h2 style={{
  fontSize: '24px',
  fontWeight: '600',
  marginBottom: '24px',
  color: '#2e7d32',
  textAlign: 'center'
}}>
  {editId ? 'Edit Property' : 'Create Property'}
</h2>

<form onSubmit={handleSubmit} style={{
  marginBottom: '3rem',
  padding: '24px',
  borderRadius: '12px',
  background: '#f9f9f9',
  boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
}}>
  {[
    ['Title', form.title, 'title'],
    ['Description', form.description, 'description'],
    ['Price', form.price, 'price', 'number']
  ].map(([label, value, key, type = 'text']) => (
    <div key={key} style={{ marginBottom: '16px' }}>
      <input
        placeholder={label}
        type={type}
        required
        value={value}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '6px',
          border: '1px solid #ccc',
          fontSize: '14px',
          background: '#fff',
          color: '#222',
        }}
      />
    </div>
  ))}

  {/* Lat/Lng inputs */}
  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
    <input
      placeholder="Latitude"
      required
      value={form.lat}
      onChange={e => setForm(f => ({ ...f, lat: e.target.value }))}
      style={{
        flex: 1,
        padding: '12px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        fontSize: '14px',
        background: '#fff',
        color: '#222',
      }}
    />
    <input
      placeholder="Longitude"
      required
      value={form.lng}
      onChange={e => setForm(f => ({ ...f, lng: e.target.value }))}
      style={{
        flex: 1,
        padding: '12px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        fontSize: '14px',
        background: '#fff',
        color: '#222',
      }}
    />
  </div>

  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
    Upload Images:
  </label>
  <input
    type="file"
    multiple
    accept="image/*"
    onChange={handleFilesChange}
    style={{ marginBottom: '16px' }}
  />

{form.existingImages.length > 0 && (
  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
    {form.existingImages.map((url, i) => (
      <div key={i} style={{ position: 'relative' }}>
        <img
          src={url}
          alt={`Image ${i}`}
          onClick={() => setPreviewUrl(url)}
          style={{
            width: '80px',
            height: '80px',
            objectFit: 'cover',
            borderRadius: '6px',
            border: '1px solid #ccc',
            cursor: 'pointer'
          }}
        />
        <button
          type="button"
          onClick={() => {
            // move to removed list & hide from preview
            setRemovedImages(r => [...r, url]);
            setForm(f => ({
              ...f,
              existingImages: f.existingImages.filter(img => img !== url)
            }));
          }}
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            background: '#d32f2f',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          ×
        </button>
      </div>
    ))}
  </div>
)}




  {/* preview new files */}
  {form.files.length > 0 && (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
      {form.files.map((f, i) => (
        <img
  key={i}
  src={URL.createObjectURL(f)}
  alt={f.name}
  onClick={() => setPreviewUrl(URL.createObjectURL(f))}
  style={{
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '6px',
    border: '1px solid #ccc',
    cursor: 'pointer'
  }}
/>

      ))}
    </div>
  )}

  <div style={{ display: 'flex', gap: '12px' }}>
    <button type="submit" style={{
      padding: '12px 24px',
      background: '#2e7d32',
      color: '#fff',
      fontWeight: 'bold',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer'
    }}>
      {editId ? 'Update Property' : 'Create Property'}
    </button>
    {editId && (
      <button
        type="button"
        onClick={resetForm}
        style={{
          padding: '12px 24px',
          background: '#ccc',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        Cancel
      </button>
    )}
  </div>
</form>


<h3 style={{ marginBottom: '16px', fontSize: '20px', color: '#333' }}>
  Existing Properties
</h3>

<ul style={{ listStyle: 'none', padding: 0 }}>
  {properties.map(p => (
    <li key={p._id} style={{
      marginBottom: '20px',
      padding: '16px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      background: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
    }}>
      <strong style={{ fontSize: '16px', color: '#2e7d32' }}>{p.title}</strong>
      <div style={{ margin: '4px 0 12px', color: '#555' }}>₹{p.price}</div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => startEdit(p)}
          style={{
            padding: '8px 16px',
            background: '#0288d1',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Edit
        </button>
        <button
          onClick={() => {
            if (confirm('Delete this property?')) {
              axios.delete(`/api/properties/${p._id}`).then(fetchProperties)
            }
          }}
          style={{
            padding: '8px 16px',
            background: '#d32f2f',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Delete
        </button>
      </div>
    </li>
  ))}
</ul>

{previewUrl && (
  <div
    onClick={() => setPreviewUrl(null)}
    style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      cursor: 'zoom-out'
    }}
  >
    <img
      src={previewUrl}
      alt="Preview"
      style={{
        maxWidth: '90%',
        maxHeight: '90%',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
      }}
    />
  </div>
)}


      </div>
    </>
  )
}
