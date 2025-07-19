'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role: 'user' })  // always set to 'user'
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert('Registered successfully');
      router.push('/login');
    } catch (err) {
      alert(err.message || 'Error registering');
    }
  };

  const styles = {
    container: {
      maxWidth: '400px',
      margin: '60px auto',
      padding: '30px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      background: '#f9f9f9',
      fontFamily: `'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,

    },
    heading: {
      fontSize: '24px',
      marginBottom: '20px',
      textAlign: 'center',
      color: '#2e7d32',
    },
    input: {
      width: '100%',
      padding: '10px',
      marginBottom: '16px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      fontSize: '14px',
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#2e7d32',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '16px',
      cursor: 'pointer',
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={styles.input}
        />
        <input
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Register</button>
      </form>
    </div>
  );
}
