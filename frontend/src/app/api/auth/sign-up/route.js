import { hashPassword } from '../../../../lib/auth';
import { sendVerificationEmail } from '../../../../lib/email';
import prisma from '../../../../../prisma';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  const { email, password } = await request.json();

  console.log('Sign-up request received for email:', email);

  try {
    // Validate email and password
    if (!email || !password) {
      console.error('Email or password missing');
      return new Response(JSON.stringify({ error: 'Email and password are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (password.length < 8) {
      console.error('Password too short');
      return new Response(JSON.stringify({ error: 'Password must be at least 8 characters long' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.error('User already exists:', email);
      return new Response(JSON.stringify({ error: 'Email already exists' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);
    console.log('Password hashed successfully');

    // Generate verification token
    const verificationToken = uuidv4();
    console.log('Verification token generated:', verificationToken);

    // Create user in the database
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        verificationToken,
      },
    });

    console.log('User created successfully:', newUser);

    // Send verification email
    await sendVerificationEmail(newUser.email, verificationToken);
    console.log('Verification email sent');

    return new Response(JSON.stringify({ message: 'Check your email to verify your account' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error during sign-up:', error);
    return new Response(JSON.stringify({ error: 'Failed to sign up' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}