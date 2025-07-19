// src/app/properties/page.jsx
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useSession, signOut }               from 'next-auth/react'
import Link                                  from 'next/link'

import Map           from 'ol/Map.js'
import View          from 'ol/View.js'
import TileLayer     from 'ol/layer/Tile.js'
import VectorLayer   from 'ol/layer/Vector.js'
import OSM           from 'ol/source/OSM.js'
import VectorSource  from 'ol/source/Vector.js'
import Feature       from 'ol/Feature.js'
import Point         from 'ol/geom/Point.js'
import { Icon, Style } from 'ol/style.js'
import { fromLonLat }  from 'ol/proj.js'

export default function PropertiesPage() {
  const { data: session } = useSession()
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const [propertiesData, setPropertiesData] = useState([])
  const [selected, setSelected] = useState(null)

  // lightbox state
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)

  // — HEADER / NAV STYLES
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

  useEffect(() => {
    if (mapInstance.current) {
      mapInstance.current.setTarget(null)
      mapInstance.current = null
    }
    const map = new Map({
      target: mapRef.current,
      layers: [ new TileLayer({ source: new OSM() }) ],
      view: new View({
        center: fromLonLat([78.4867, 17.3850]),
        zoom: 5
      }),
    })
    mapInstance.current = map

    fetch('/api/properties')
      .then(res => res.json())
      .then(props => {
        setPropertiesData(props)

        const features = props.map(p => {
          const f = new Feature({
            geometry: new Point(fromLonLat([p.location.lng, p.location.lat])),
            id: p._id
          })
          f.setStyle(new Style({
            image: new Icon({ src: '/marker.png', scale: 0.05 })
          }))
          return f
        })

        const vectorLayer = new VectorLayer({
          source: new VectorSource({ features })
        })
        map.addLayer(vectorLayer)
        map.updateSize()

        map.on('singleclick', evt => {
          map.forEachFeatureAtPixel(evt.pixel, feat => {
            const id = feat.get('id')
            const prop = props.find(x => x._id === id)
            if (prop) setSelected(prop)
          })
        })
      })

    return () => {
      map.setTarget(null)
    }
  }, [])

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
          {session ? (
            <button onClick={() => signOut({ callbackUrl: '/' })} style={btnStyles}>
              Logout
            </button>
          ) : (
            <Link href="/login" style={linkStyles}>Login / Register</Link>
          )}
        </nav>
      </header>

      {/* MAP + SIDE PANEL */}
      <div style={{ display: 'flex', height: 'calc(100vh - 72px)' }}>
        {/* Detail panel */}
        {selected && (
          <aside style={{
            width: '350px',
            background: '#fff',
            boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
            overflowY: 'auto',
            padding: '1rem',
          }}>
            {/* Close details */}
            <button
              onClick={() => setSelected(null)}
              style={{
                float: 'right',
                background: 'transparent',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
              }}
            >×</button>

            {/* Property info */}
            <h2 style={{ marginTop: 0 }}>{selected.title}</h2>
            <p style={{ color: '#555', margin: '4px 0' }}>₹{selected.price}</p>
            <p style={{ margin: '1rem 0' }}>{selected.description}</p>

            {/* Image thumbnails */}
            <div style={{ display: 'grid', gap: '8px', marginBottom: '1rem' }}>
              {selected.images.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`${selected.title} ${i+1}`}
                  style={{ width: '100%', borderRadius: '4px', objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => { setCurrentImage(i); setGalleryOpen(true) }}
                />
              ))}
            </div>

            {/* Book button (only for non-admins) */}
            {session?.user?.role !== 'admin' && (
              <button
                onClick={() => window.location.href = `/book/${selected._id}`}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#2e7d32',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Book Now
              </button>
            )}
          </aside>
        )}

        {/* Map container */}
        <div
          ref={mapRef}
          style={{ flex: 1, width: '100%', height: '100%', position: 'relative' }}
        />
      </div>

      {/* Full-screen image lightbox */}
      {galleryOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.8)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <button
            onClick={() => setGalleryOpen(false)}
            style={{
              position: 'absolute', top: '20px', right: '20px',
              background: 'transparent', border: 'none',
              fontSize: '2rem', color: '#fff', cursor: 'pointer'
            }}
          >×</button>
          <button
            onClick={() => setCurrentImage((currentImage + selected.images.length - 1) % selected.images.length)}
            style={{
              position: 'absolute', left: '20px', background: 'transparent',
              border: 'none', fontSize: '2rem', color: '#fff', cursor: 'pointer'
            }}
          >‹</button>

          <img
            src={selected.images[currentImage]}
            alt={`Large view ${currentImage + 1}`}
            style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '8px' }}
          />

          <button
            onClick={() => setCurrentImage((currentImage + 1) % selected.images.length)}
            style={{
              position: 'absolute', right: '20px', background: 'transparent',
              border: 'none', fontSize: '2rem', color: '#fff', cursor: 'pointer'
            }}
          >›</button>
        </div>
      )}
    </>
  )
}
