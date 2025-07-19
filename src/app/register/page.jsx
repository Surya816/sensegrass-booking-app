'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role: 'user' }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert('Registered successfully');
      router.push('/login');
    } catch (err) {
      alert(err.message || 'Error registering');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f5',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: `'Segoe UI', sans-serif`,
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '420px',
        width: '100%',
        padding: '32px',
        background: '#fff',
        borderRadius: '10px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
      }}>
        {/* ✅ Sensegrass Header */}
        <div style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#2e7d32',
          textAlign: 'center',
          marginBottom: '8px',
          letterSpacing: '-0.5px'
        }}>
          🌿 Sensegrass
        </div>

        <h2 style={{
          textAlign: 'center',
          marginBottom: '24px',
          fontSize: '22px',
          color: '#333'
        }}>
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: '14px', marginBottom: '6px', display: 'block', color: '#333' }}>Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '16px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              fontSize: '15px',
              outline: 'none',
              background: '#fff',
              color: '#222'
            }}
          />

          <label style={{ fontSize: '14px', marginBottom: '6px', display: 'block', color: '#333' }}>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '16px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              fontSize: '15px',
              outline: 'none',
              background: '#fff',
              color: '#222'
            }}
          />

          <label style={{ fontSize: '14px', marginBottom: '6px', display: 'block', color: '#333' }}>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '20px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              fontSize: '15px',
              outline: 'none',
              background: '#fff',
              color: '#222'
            }}
          />

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#2e7d32',
              color: '#fff',
              fontWeight: 600,
              fontSize: '16px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background 0.3s'
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#27682c'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = '#2e7d32'}
          >
            Register
          </button>
        </form>

        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#444' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#2e7d32', fontWeight: 'bold', textDecoration: 'none' }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
