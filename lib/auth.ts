// /lib/auth.ts
import NextAuth, { type NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from './prisma';

import { PrismaAdapter } from '@auth/prisma-adapter';

// Helper function to fetch user by username
export const getUserWithUsername = async (username: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });
    return user;
  } catch (error) {
    console.error('Error fetching user with username:', error);
    return null;
  }
};

// Extend NextAuth types to include custom user properties
declare module 'next-auth' {
  interface User {
    username: string;
    fullName: string;
    role: string;
  }
  interface Session {
    user: {
      id: string;
      username: string;
      fullName: string;
      role: string;
      email: string;
      name?: string | null;
      image?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    username: string;
    fullName: string;
    role: string;
    ua?: string;
  }
}

export const config = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const user = await getUserWithUsername(credentials.username);

        if (!user || !user.hashedPassword || !(await compare(credentials.password, user.hashedPassword))) {
          return null;
        }

        return {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
        token.fullName = user.fullName;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.username = token.username;
        session.user.fullName = token.fullName;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 60, // 30 minutes
    updateAge: 15 * 60, // refresh token every 15 mins if user is active
  },
  pages: {
    signIn: '/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);