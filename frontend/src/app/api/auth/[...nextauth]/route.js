import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '../../../../../prisma';
import { hashPassword, verifyPassword } from '../../../../lib/auth';
import { sendVerificationEmail } from '../../../../lib/email';
import { v4 as uuidv4 } from 'uuid';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Email/Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (user) {
          // Sign-in logic
          const isValid = await verifyPassword(credentials.password, user.password);
          if (!isValid) {
            throw new Error('Invalid password'); // Throw error for invalid password
          }

          if (!user.emailVerified) {
            throw new Error('Email not verified'); // Throw error for unverified email
          }

          return user; // Verified user
        } else if (credentials.isSignUp) {
          // Sign-up logic
          const hashedPassword = await hashPassword(credentials.password);
          const verificationToken = uuidv4();

          const newUser = await prisma.user.create({
            data: {
              email: credentials.email,
              password: hashedPassword,
              verificationToken,
            },
          });

          await sendVerificationEmail(newUser.email, verificationToken);

          throw new Error('Check your email to verify your account'); // Throw error to redirect to verification page
        } else {
          throw new Error('User not found'); // Throw error for non-existent user
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // Add user ID and username to the session
      if (user) {
        session.user.id = user.id;
        session.user.username = user.username;
      }
      return session;
    },
    async jwt({ token, user }) {
      // Add user ID to the token
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt', // Use JWT for session management
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure a secret is set for session encryption
  debug: process.env.NODE_ENV === 'development', // Enable debugging in development
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };