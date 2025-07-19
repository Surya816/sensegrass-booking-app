import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  const body = await req.json();
  const { name, email, password } = body;

  if (!name || !email || !password) {
    return new Response(JSON.stringify({ message: 'Missing fields' }), { status: 400 });
  }

  try {
    await connectToDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: 'User already exists' }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'user'  // Force default role here
    });

    await newUser.save();

    return new Response(JSON.stringify({ message: 'User registered successfully' }), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}
