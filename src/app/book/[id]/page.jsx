// src/app/book/[id]/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut }      from 'next-auth/react';
import { useRouter, useParams }     from 'next/navigation';
import axios                        from 'axios';
import Script                       from 'next/script';
import Link                         from 'next/link';

export default function BookingPage() {
  const { id }            = useParams();
  const { data: session } = useSession();
  const router            = useRouter();

  const [prop, setProp]     = useState(null);
  const [fromDate, setFrom] = useState('');
  const [toDate, setTo]     = useState('');
  const [amount, setAmount] = useState(0);

  // — NAVBAR STYLES (reuse from other pages)
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
  };
  const logoStyles = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2e7d32',
    fontFamily: `'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
  };
  const navStyles  = { display: 'flex', gap: '20px', alignItems: 'center' };
  const linkStyles = { color: '#555', textDecoration: 'none', fontSize: '16px' };
  const btnStyles  = {
    ...linkStyles,
    background: '#d32f2f',
    color: '#fff',
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  // — PAGE CONTAINER & FORM STYLES
  const container = {
    maxWidth: '600px',
    margin: '2rem auto',
    padding: '1rem',
    fontFamily: 'system-ui, sans-serif',
    color: '#171717',
  };
  const formStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginTop: '1rem',
  };
  const labelStyles = { display: 'flex', flexDirection: 'column', fontSize: '14px' };
  const inputStyles = {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px',
    marginTop: '4px',
  };
  const submitStyles = {
    padding: '10px 16px',
    background: '#2e7d32',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  };

  useEffect(() => {
    axios.get(`/api/properties/${id}`)
         .then(r => setProp(r.data))
         .catch(console.error);
  }, [id]);

  useEffect(() => {
    if (prop && fromDate && toDate) {
      const diff = (new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24);
      const days = Math.ceil(diff) + 1;
      setAmount(days * prop.price);
    }
  }, [prop, fromDate, toDate]);

  const handleBook = async e => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/bookings', {
        propertyId: id,
        fromDate,
        toDate
      });

      if (!data.keyId) {
        alert('Booking confirmed (stub)!');
        return router.push('/dashboard');
      }

      const options = {
        key:        data.keyId,
        amount:     data.amount,
        currency:   'INR',
        order_id:   data.orderId,
        name:       'Sensegrass Booking',
        description: prop.title,
        prefill:    { name: session.user.name, email: session.user.email },
        handler: async resp => {
          await axios.post('/api/bookings/confirm', {
            bookingId: data.bookingId,
            paymentId: resp.razorpay_payment_id,
            orderId:   resp.razorpay_order_id,
            signature: resp.razorpay_signature
          });
          alert('Booking confirmed!');
          router.push('/dashboard');
        }
      };
      const rz = new window.Razorpay(options);
      rz.open();
    } catch (err) {
      console.error(err);
      alert('Booking failed');
    }
  };

  if (!prop) return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading…</p>;

  return (
    <>
      {/* NAV BAR */}
      <header style={headerStyles}>
        <div style={logoStyles}>Sensegrass</div>
        <nav style={navStyles}>
          <Link href="/"         style={linkStyles}>Home</Link>
          <Link href="/properties" style={linkStyles}>Properties</Link>
          <Link href="/dashboard"  style={linkStyles}>Dashboard</Link>
          {session
            ? <button onClick={() => signOut({ callbackUrl: '/' })} style={btnStyles}>
                Logout
              </button>
            : <Link href="/login" style={linkStyles}>Login / Register</Link>
          }
        </nav>
      </header>

      <div style={{
  maxWidth: '600px',
  margin: '40px auto',
  background: '#fff',
  borderRadius: '12px',
  padding: '32px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
  fontFamily: `'Segoe UI', sans-serif`,
  color: '#222'
}}>
  <Script src="https://checkout.razorpay.com/v1/checkout.js" />

  {/* Property Title & Price */}
  <div style={{ marginBottom: '24px' }}>
    <h2 style={{
      fontSize: '24px',
      fontWeight: '600',
      marginBottom: '8px',
      color: '#2e7d32'
    }}>
      {prop.title}
    </h2>
    <p style={{ color: '#555', fontSize: '15px' }}>
      Price per day: ₹{prop.price}
    </p>
  </div>

  {/* Booking Form */}
  <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <label style={{ fontSize: '14px', fontWeight: '500' }}>
      From:
      <input
        type="date"
        required
        value={fromDate}
        onChange={e => setFrom(e.target.value)}
        style={{
          marginTop: '6px',
          padding: '12px',
          borderRadius: '6px',
          border: '1px solid #ccc',
          fontSize: '15px',
          width: '100%',
          backgroundColor: '#fff',  // ✅ Fix for black bg
          color: '#222',            // ✅ Fix for invisible text
        }}
      />
    </label>

    <label style={{ fontSize: '14px', fontWeight: '500' }}>
      To:
      <input
        type="date"
        required
        value={toDate}
        onChange={e => setTo(e.target.value)}
        style={{
          marginTop: '6px',
          padding: '12px',
          borderRadius: '6px',
          border: '1px solid #ccc',
          fontSize: '15px',
          width: '100%',
          backgroundColor: '#fff',  // ✅ Fix for black bg
          color: '#222',            // ✅ Fix for invisible text
        }}
      />
    </label>

    <div style={{
      fontSize: '16px',
      fontWeight: 500,
      marginTop: '4px',
      color: '#444'
    }}>
      Total Amount: ₹{amount}
    </div>

    <button type="submit" style={{
      padding: '14px',
      background: '#2e7d32',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '16px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }}
      onMouseOver={e => e.currentTarget.style.background = '#27682c'}
      onMouseOut={e => e.currentTarget.style.background = '#2e7d32'}
    >
      Pay &amp; Book
    </button>
  </form>
</div>

    </>
  );
}
