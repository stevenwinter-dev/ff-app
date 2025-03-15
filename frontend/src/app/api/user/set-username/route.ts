import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '../../../../../prisma';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(request) {
  const session = await getServerSession(authOptions);

  console.log('Session:', session); // Debugging: Log the session

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { username } = await request.json();

  console.log('Username:', username); // Debugging: Log the username

  try {
    // Check if the username is already taken
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
    }

    // Update the user with the new username
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { username },
    });

    console.log('Updated User:', updatedUser); // Debugging: Log the updated user

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error setting username:', error);
    return NextResponse.json({ error: 'Failed to set username' }, { status: 500 });
  }
}