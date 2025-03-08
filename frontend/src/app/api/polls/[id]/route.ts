import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function DELETE(request, { params }) {
  // Await the params object
  const { id } = await params;

  try {
    await prisma.poll.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: 'Poll deleted successfully' });
  } catch (error) {
    console.error('Error deleting poll:', error);
    return NextResponse.json({ error: 'Failed to delete poll' }, { status: 500 });
  }
}