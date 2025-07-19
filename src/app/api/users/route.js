import { connectToDB } from '@/lib/mongodb';
import User            from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions }     from '../auth/[...nextauth]/route';

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return new Response('Forbidden', { status: 403 });
  }
  await connectToDB();
  const users = await User.find().select('name email role createdAt');
  return new Response(JSON.stringify(users), { status: 200 });
}
