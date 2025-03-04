import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Destructure the `id` directly from `params`
    const { id } = await params;

    // Validate the ID
    if (isNaN(parseInt(id))) {
      return NextResponse.json({ error: 'Invalid player ID' }, { status: 400 });
    }

    console.log(`Deleting player with ID: ${id}`);

    // Delete related votes where the player is involved
    await prisma.vote.deleteMany({
      where: {
        OR: [
          { playerId: parseInt(id) },
          { poll: { player1Id: parseInt(id) } },
          { poll: { player2Id: parseInt(id) } },
        ],
      },
    });

    // Delete related polls where the player is player1 or player2
    await prisma.poll.deleteMany({
      where: {
        OR: [
          { player1Id: parseInt(id) },
          { player2Id: parseInt(id) },
        ],
      },
    });

    // Delete the player
    await prisma.player.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Player deleted successfully' });
  } catch (error) {
    console.error('Error deleting player:', error);
    return NextResponse.json({ error: 'Failed to delete player' }, { status: 500 });
  }
}