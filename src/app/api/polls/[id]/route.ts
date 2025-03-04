import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function DELETE(request, { params }) {
  const { id } = await params;

  try {
    // Delete related votes where the poll is involved
    await prisma.vote.deleteMany({
      where: { pollId: parseInt(id) },
    });

    // Delete the poll
    await prisma.poll.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Poll deleted successfully' });
  } catch (error) {
    console.error('Error deleting poll:', error);
    return NextResponse.json({ error: 'Failed to delete poll' }, { status: 500 });
  }
}