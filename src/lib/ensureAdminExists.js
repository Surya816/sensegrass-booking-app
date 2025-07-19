import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function ensureAdminExists() {
  await connectToDB();
  const adminExists = await User.findOne({ email: 'admin@gmail.com' });

  if (!adminExists) {
    const hashed = await bcrypt.hash('123', 10);
    await User.create({
      name: 'Admin',
      email: 'admin@gmail.com',
      password: hashed,
      role: 'admin',
    });
    console.log('✅ Admin user created (admin@gmail.com / 123)');
  } else {
    console.log('✅ Admin user already exists');
  }
}
