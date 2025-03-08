import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function DELETE(request, { params }) {
  const { id } = await params;

  try {
    // Validate the poll ID
    if (isNaN(parseInt(id))) {
      return NextResponse.json({ error: 'Invalid poll ID' }, { status: 400 });
    }

    // Delete all votes associated with the poll
    await prisma.vote.deleteMany({
      where: {
        pollId: parseInt(id),
      },
    });

    return NextResponse.json({ message: 'Votes deleted successfully' });
  } catch (error) {
    console.error('Error deleting votes:', error);
    return NextResponse.json({ error: 'Failed to delete votes' }, { status: 500 });
  }
}