import { connectToDB } from '@/lib/mongodb';
import User            from '@/models/User';
import bcrypt          from 'bcryptjs';
import { getServerSession } from 'next-auth/next';
import { authOptions }     from '../auth/[...nextauth]/route';

export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const { name, password } = await req.json();
  await connectToDB();

  const updates = { name };
  if (password) {
    updates.password = await bcrypt.hash(password, 10);
  }

  await User.findByIdAndUpdate(session.user.id, updates);
  return new Response('Profile updated', { status: 200 });
}
