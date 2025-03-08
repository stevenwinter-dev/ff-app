import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request) {
  const players = await request.json();

  try {
    // Validate input
    if (!Array.isArray(players)) {
      throw new Error('Invalid input. Expected an array of players.');
    }

    // Create players in bulk
    await prisma.player.createMany({
      data: players,
    });

    // Fetch the newly created players
    const createdPlayers = await prisma.player.findMany({
      where: {
        name: {
          in: players.map((player) => player.name),
        },
      },
    });

    return NextResponse.json(createdPlayers, { status: 201 });
  } catch (error) {
    console.error('Error uploading players:', error);
    return NextResponse.json({ error: 'Failed to upload players' }, { status: 500 });
  }
}