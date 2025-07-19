'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardClient() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status]);

  if (status === 'loading') return <p>Loading...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Welcome, {session?.user?.name}</h2>
      <p>Role: {session?.user?.role}</p>

      {session?.user?.role === 'admin' ? (
        <div>
          <h3>Admin Dashboard</h3>
          <ul>
            <li>Manage Properties</li>
            <li>View Users</li>
            <li>View Bookings</li>
          </ul>
        </div>
      ) : (
        <div>
          <h3>User Dashboard</h3>
          <ul>
            <li>My Bookings</li>
            <li>Profile Settings</li>
          </ul>
        </div>
      )}
    </div>
  );
}
