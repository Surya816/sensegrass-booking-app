'use client';

import { useSession,signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const { data: session } = useSession();
  const [bubbles, setBubbles] = useState([]);
  useEffect(() => {
    const generated = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      width: `${40 + Math.random() * 80}px`,
      height: `${40 + Math.random() * 80}px`,
      opacity: 0.3 + Math.random() * 0.2,
      animation: `${i % 2 === 0 ? 'floatLeft' : 'floatRight'} ${30 + i * 5}s linear infinite`,
    }));
    setBubbles(generated);
  }, []);

    const styles = {


      container: {
        fontFamily: `'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
        color: '#171717',
        lineHeight: 1.5,
      },
      header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        background: '#fff',
        borderBottom: '1px solid #eee',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      },
      logo: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#2e7d32',
      },
      nav: {
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
      },
      navLink: {
        color: '#555',
        textDecoration: 'none',
        fontSize: '16px',
      },
      btn: {
        color: '#fff',
        background: '#d32f2f',
        border: 'none',
        borderRadius: '4px',
        padding: '6px 12px',
        fontSize: '14px',
        cursor: 'pointer',
      },
      hero: {
        textAlign: 'center',
        padding: '80px 20px',
        background: 'linear-gradient(to right, #E0F2F1, #FFFFFF, #E8F5E9)',
      },
      heroBadge: {
        display: 'inline-block',
        padding: '4px 12px',
        background: '#C8E6C9',
        color: '#256029',
        fontSize: '12px',
        borderRadius: '12px',
        marginBottom: '12px',
      },
      heroTitle: { fontSize: '42px', margin: '16px 0', fontWeight: '700' },
      heroHighlight: { color: '#2e7d32' },
      heroText: { fontSize: '18px', color: '#555', maxWidth: '600px', margin: '0 auto 24px' },
      heroButton: {
        padding: '14px 28px',
        background: '#2e7d32',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        cursor: 'pointer',
      },

    section: { padding: '60px 20px', maxWidth: '900px', margin: '0 auto' },
    sectionTitle: { fontSize: '28px', textAlign: 'center', marginBottom: '24px' },
    sectionText: { textAlign: 'center', color: '#666', marginBottom: '40px' },
    grid3: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '24px',
      textAlign: 'center',
    },
    card: {
      padding: '24px',
      background: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    stepCircle: {
      width: '60px',
      height: '60px',
      borderRadius: '30px',
      background: '#2e7d32',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 12px',
      fontWeight: '700',
    },

    twoCols: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '24px',
      textAlign: 'left',
    },
    roleCard: {
      padding: '24px',
      background: '#fcfbea',
      borderRadius: '8px',
    },

    cta: {
      padding: '60px 20px',
      textAlign: 'center',
      background: '#2e7d32',
      color: '#fff',
    },
    ctaTitle: { fontSize: '28px', marginBottom: '12px' },
    ctaText: { marginBottom: '24px' },
    ctaButton: {
      padding: '12px 24px',
      margin: '0 8px',
      borderRadius: '6px',
      fontSize: '16px',
      cursor: 'pointer',
    },
    ctaPrimary: {
      background: '#fff',
      color: '#2e7d32',
      border: 'none',
    },
    ctaSecondary: {
      background: 'transparent',
      color: '#fff',
      border: '1px solid #fff',
    },
  };

  return (
    <div style={styles.container}>
      {/* ✅ Correct CSS inside JSX */}
      <style jsx>{`
        @keyframes rotate {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
  
        .animated-bg {
          animation: rotate 120s linear infinite;
          transform-origin: center;
        }
      `}</style>
      <style jsx>{`
        @keyframes floatLeft {
          0% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(-60vw) translateY(10vh); }
          100% { transform: translateX(0) translateY(0); }
        }

        @keyframes floatRight {
          0% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(60vw) translateY(-10vh); }
          100% { transform: translateX(0) translateY(0); }
        }

        .animated-bg {
          display: none; /* Hide old rotating one */
        }
      `}</style>

  
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>Sensegrass</div>
        <nav style={styles.nav}>
          <Link href="/" style={styles.navLink}>Home</Link>
          <Link href="/properties" style={styles.navLink}>Properties</Link>
  
          {session ? (
            <>
              <Link href="/dashboard" style={styles.navLink}>Dashboard</Link>
              <Link href="/profile" style={styles.navLink}>Profile</Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                style={{
                  ...styles.navLink,
                  background: '#d32f2f',
                  color: '#fff',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" style={styles.navLink}>Login / Register</Link>
          )}
        </nav>
      </header>
  
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '100px 20px',
        textAlign: 'center',
        background: '#f1fff5',
      }}>
        {/* Rotating Background */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
  {bubbles.map(({ id, top, left, width, height, opacity, animation }) => (
    <svg
      key={id}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: 'absolute',
        top, left, width, height, opacity,
        zIndex: 0,
        animation,
      }}
    >
      <path
        fill="#388E3C"
        d="M44.8,-76.9C57.6,-70.1,67.4,-57.5,75.8,-43.8C84.3,-30.1,91.3,-15.1,91.2,0.1C91.2,15.4,84.2,30.7,75.6,43.6C67.1,56.6,57,67.3,43.7,74.1C30.3,80.9,13.7,83.7,-1.4,86C-16.6,88.3,-33.1,90,-47.1,83.3C-61.2,76.6,-72.7,61.5,-78.2,45.3C-83.6,29,-82.9,11.6,-77.7,-3.7C-72.6,-19.1,-63,-32.3,-52.1,-45.1C-41.1,-57.9,-29,-70.3,-14.5,-77.8C0,-85.3,17.6,-87.8,44.8,-76.9Z"
        transform="translate(100 100)"
      />
    </svg>
  ))}
</div>

  
        {/* Foreground Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-block',
            padding: '6px 16px',
            background: '#C8E6C9',
            color: '#256029',
            fontSize: '13px',
            fontWeight: 600,
            borderRadius: '16px',
            marginBottom: '16px'
          }}>
            Sustainable Travel Platform
          </div>
  
          <h1 style={{
            fontSize: '48px',
            fontWeight: 700,
            lineHeight: 1.2,
            color: '#1B5E20',
            maxWidth: '700px',
            margin: '0 auto 16px'
          }}>
            Book <span style={{ color: '#43A047' }}>Eco-Friendly</span> Stays<br /> Around the World
          </h1>
  
          <p style={{
            fontSize: '18px',
            color: '#555',
            maxWidth: '600px',
            margin: '0 auto 32px'
          }}>
            Discover verified green properties and reserve your next stay with just a few clicks. Travel responsibly, live beautifully.
          </p>
  
          <Link href="/properties">
            <button style={{
              padding: '14px 32px',
              background: '#2e7d32',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '17px',
              fontWeight: 500,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(46,125,50,0.3)',
              transition: 'transform 0.2s ease'
            }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              🌍 Browse Properties
            </button>
          </Link>
        </div>
      </section>
  


      {/* Why Choose */}
      <section style={{
  padding: '80px 20px',
  maxWidth: '1100px',
  margin: '0 auto',
  textAlign: 'center'
}}>
  <h2 style={{ fontSize: '32px', marginBottom: '16px', fontWeight: 700 }}>
    Why Choose <span style={{ color: '#2e7d32' }}>Sensegrass</span>?
  </h2>
  <p style={{ color: '#666', marginBottom: '48px', fontSize: '16px' }}>
    Experience the future of sustainable travel with our cutting-edge platform
  </p>

  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '24px',
    textAlign: 'left',
  }}>
    {[
      ['🚀', 'Easy Booking System', 'Intuitive search and booking process'],
      ['💳', 'Secure Payments', 'Protected by Razorpay encryption'],
      ['📡', 'Real-Time Availability', 'Live updates on property status'],
      ['📊', 'Admin & User Dashboards', 'Comprehensive management tools'],
      ['🗺️', 'Live Map Selection', 'Interactive property discovery'],
      ['📱', 'Mobile-Friendly UI', 'Optimized for all devices'],
    ].map(([icon, title, desc]) => (
      <div key={title} style={{
        background: '#fff',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'default',
      }}
        onMouseOver={e => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
        }}
      >
        <div style={{ fontSize: '28px', marginBottom: '12px' }}>{icon}</div>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '6px', color: '#222' }}>{title}</h3>
        <p style={{ color: '#555', fontSize: '14px', lineHeight: 1.5 }}>{desc}</p>
      </div>
    ))}
  </div>
</section>


      {/* How It Works */}
      <section style={{
  padding: '80px 20px',
  background: '#f7f7f7',
  textAlign: 'center'
}}>
  <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '16px' }}>
    How It Works
  </h2>
  <p style={{ color: '#666', marginBottom: '48px', fontSize: '16px' }}>
    Three simple steps to your perfect eco-friendly getaway
  </p>

  <div style={{
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '40px',
  }}>
    {[
      ['📝', 'Create Account', 'Sign up in seconds with our streamlined process'],
      ['🧭', 'Browse Properties', 'Explore eco-friendly stays on our interactive map'],
      ['⚡', 'Book Instantly', 'Select dates and confirm your sustainable getaway'],
    ].map(([icon, title, desc], i) => (
      <div key={i} style={{
        background: '#fff',
        padding: '24px',
        borderRadius: '12px',
        maxWidth: '220px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        transition: 'transform 0.2s ease',
      }}
        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <div style={{
          fontSize: '32px',
          marginBottom: '12px',
          color: '#2e7d32'
        }}>{icon}</div>
        <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>{title}</h4>
        <p style={{ color: '#555', fontSize: '14px', lineHeight: 1.5 }}>{desc}</p>
      </div>
    ))}
  </div>
</section>


      {/* Built for Everyone */}
      <section style={{
  padding: '80px 20px',
  background: '#fffde7',
  textAlign: 'center'
}}>
  <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '16px' }}>
    Built for Everyone
  </h2>
  <p style={{ color: '#666', marginBottom: '40px', fontSize: '16px' }}>
    Whether you're a traveler or property owner, we've got you covered
  </p>

  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '32px',
    maxWidth: '900px',
    margin: '0 auto'
  }}>
    {[
      ['🌿 For Travelers', [
        'Book sustainable properties with ease',
        'View and manage your bookings',
        'Discover eco-friendly destinations'
      ]],
      ['🏡 For Property Owners', [
        'Add and manage property listings',
        'Track bookings and revenue',
        'Comprehensive admin dashboard'
      ]]
    ].map(([heading, items], i) => (
      <div key={i} style={{
        background: '#fffde1',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        textAlign: 'left',
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: 600,
          color: '#2e7d32',
          marginBottom: '12px'
        }}>{heading}</h3>
        <ul style={{ color: '#555', fontSize: '14px', paddingLeft: '20px', lineHeight: 1.6 }}>
          {items.map((item, j) => (
            <li key={j}>{item}</li>
          ))}
        </ul>
      </div>
    ))}
  </div>
</section>


      {/* Call to Action */}
      <section style={{
  padding: '80px 20px',
  textAlign: 'center',
  background: '#2e7d32',
  color: '#fff',
}}>
  <h2 style={{
    fontSize: '32px',
    marginBottom: '16px',
    fontWeight: 700,
  }}>
    Ready to Start Your Sustainable Journey?
  </h2>
  <p style={{
    marginBottom: '32px',
    fontSize: '16px',
    maxWidth: '600px',
    marginInline: 'auto',
    lineHeight: 1.5,
  }}>
    Join thousands of eco-conscious travelers and property owners making a difference.
  </p>
  <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
    <button style={{
      padding: '12px 24px',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: 500,
      background: '#fff',
      color: '#2e7d32',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
    }}
      onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
      onMouseOut={e => e.currentTarget.style.opacity = '1'}
    >
      🌍 Explore Properties
    </button>
    <button style={{
      padding: '12px 24px',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: 500,
      background: 'transparent',
      color: '#fff',
      border: '1px solid #fff',
      cursor: 'pointer',
      transition: 'all 0.2s',
    }}
      onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
    >
      🏡 Become a Host
    </button>
  </div>
</section>
<footer style={{
  background: '#1b5e20',
  color: '#fff',
  padding: '40px 20px',
  fontSize: '14px',
  textAlign: 'center'
}}>
  <p style={{ marginBottom: '8px' }}>
    &copy; {new Date().getFullYear()} Sensegrass. All rights reserved.
  </p>
  <p>
    Built with 💚 for eco-conscious travel.
  </p>
</footer>

    </div>
  );
}
