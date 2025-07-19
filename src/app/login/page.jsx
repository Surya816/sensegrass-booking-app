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
      maxWidth: '400px',
      margin: '60px auto',
      padding: '30px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      backgroundColor: '#fafafa',
      fontFamily: `'Segoe UI', sans-serif`
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login to Your Account</h2>
      
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={{ width: '100%', padding: '10px', marginBottom: '12px' }}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
        />

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#2e7d32',
            color: '#fff',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Login
        </button>
      </form>

      <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
        Don't have an account?{' '}
        <Link href="/register" style={{ color: '#2e7d32', fontWeight: 'bold' }}>
          Register here
        </Link>
      </p>
    </div>
  );
}
