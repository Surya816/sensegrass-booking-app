import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      async authorize(credentials) {
        await connectToDB();
        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error('User not found');
        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) throw new Error('Invalid password');
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id   = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.role) session.user.role = token.role;
      if (token.id)   session.user.id   = token.id;
      return session;
    }
  },
  pages: {
    signIn: '/login'
  },
  secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
