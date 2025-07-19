'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    if (res.ok) {
      alert('Login successful');
      router.push('/dashboard');
    } else {
      alert('Invalid credentials');
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
          fontSize: '24px',
          color: '#2e7d32'
        }}>
          Login to Your Account
        </h2>

        <form onSubmit={handleLogin}>
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
    color: '#222',           // ✅ Add this line
  }}
/>

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
    color: '#222',           // ✅ Add this line
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
            Login
          </button>
        </form>

        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#444' }}>
          Don't have an account?{' '}
          <Link href="/register" style={{ color: '#2e7d32', fontWeight: 'bold', textDecoration: 'none' }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
