'use client'
import { useState, useEffect } from 'react';
import axios                   from 'axios';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('/api/users')
      .then(r => setUsers(r.data))
      .catch(console.error);
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>All Users</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{new Date(u.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
