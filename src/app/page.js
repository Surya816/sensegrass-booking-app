'use client';

import { useSession,signOut } from 'next-auth/react';
import Link from 'next/link';

export default function HomePage() {
  const { data: session } = useSession();

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


      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroBadge}>Sustainable Travel Platform</div>
        <h1 style={styles.heroTitle}>
          Book{' '}
          <span style={styles.heroHighlight}>Eco-Friendly</span>{' '}
          Stays<br />
          with Ease
        </h1>
        <p style={styles.heroText}>
          Explore and reserve sustainable properties powered by Sensegrass.
          Your gateway to responsible travel and unforgettable experiences.
        </p>
        <button style={styles.heroButton}>Browse Properties →</button>
      </section>

      {/* Why Choose */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Why Choose Sensegrass?</h2>
        <p style={styles.sectionText}>
          Experience the future of sustainable travel with our cutting-edge platform
        </p>
        <div style={{ ...styles.grid3, gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))' }}>
          {[
            ['Easy Booking System', 'Intuitive search and booking process'],
            ['Secure Payments', 'Protected by Razorpay encryption'],
            ['Real-Time Availability', 'Live updates on property status'],
            ['Admin & User Dashboards', 'Comprehensive management tools'],
            ['Live Map Selection', 'Interactive property discovery'],
            ['Mobile-Friendly UI', 'Optimized for all devices'],
          ].map(([title, desc]) => (
            <div key={title} style={styles.card}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                {title}
              </h3>
              <p style={{ color: '#555', fontSize: '14px' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section style={{ ...styles.section, background: '#f7f7f7' }}>
        <h2 style={styles.sectionTitle}>How It Works</h2>
        <p style={styles.sectionText}>Three simple steps to your perfect eco-friendly getaway</p>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '32px' }}>
          {[
            ['01', 'Create Account', 'Sign up in seconds with our streamlined process'],
            ['02', 'Browse Properties', 'Explore eco-friendly stays on our interactive map'],
            ['03', 'Book Instantly', 'Select dates and confirm your sustainable getaway'],
          ].map(([step, title, desc]) => (
            <div key={step} style={{ textAlign: 'center', maxWidth: '200px' }}>
              <div style={styles.stepCircle}>{step}</div>
              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                {title}
              </h4>
              <p style={{ color: '#555', fontSize: '13px' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Built for Everyone */}
      <section style={{ ...styles.section, background: '#fff8e1' }}>
        <h2 style={styles.sectionTitle}>Built for Everyone</h2>
        <p style={styles.sectionText}>
          Whether you're a traveler or property owner, we've got you covered
        </p>
        <div style={{ ...styles.twoCols, gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={styles.roleCard}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2e7d32', marginBottom: '8px' }}>
              For Travelers
            </h3>
            <ul style={{ color: '#555', fontSize: '14px', paddingLeft: '20px' }}>
              <li>Book sustainable properties with ease</li>
              <li>View and manage your bookings</li>
              <li>Discover eco-friendly destinations</li>
            </ul>
          </div>
          <div style={styles.roleCard}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2e7d32', marginBottom: '8px' }}>
              For Property Owners
            </h3>
            <ul style={{ color: '#555', fontSize: '14px', paddingLeft: '20px' }}>
              <li>Add and manage property listings</li>
              <li>Track bookings and revenue</li>
              <li>Comprehensive admin dashboard</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section style={styles.cta}>
        <h2 style={styles.ctaTitle}>Ready to Start Your Sustainable Journey?</h2>
        <p style={styles.ctaText}>
          Join thousands of eco-conscious travelers and property owners making a difference
        </p>
        <div>
          <button style={{ ...styles.ctaButton, ...styles.ctaPrimary }}>
            Explore Properties
          </button>
          <button style={{ ...styles.ctaButton, ...styles.ctaSecondary }}>
            Become a Host
          </button>
        </div>
      </section>
    </div>
  );
}
