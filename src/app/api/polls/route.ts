import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET: Fetch all polls
export async function GET() {
  try {
    const polls = await prisma.poll.findMany({
      include: {
        player1: true, // Include player1
        player2: true, // Include player2
        creator: true, // Include the creator of the poll
        votes: {
          include: {
            user: true, // Include the user who voted
            player: true, // Include the player they voted for
          },
        },
      },
    });
    return NextResponse.json(polls);
  } catch (error) {
    console.error('Error fetching polls:', error);
    return NextResponse.json({ error: 'Failed to fetch polls' }, { status: 500 });
  }
}

// POST: Create a new poll
export async function POST(request) {
  try {
    const { player1Id, player2Id, creatorId } = await request.json();

    // Validate input
    if (!player1Id || !player2Id || !creatorId) {
      return NextResponse.json(
        { error: 'player1Id, player2Id, and creatorId are required' },
        { status: 400 }
      );
    }

    if (player1Id === player2Id) {
      return NextResponse.json(
        { error: 'player1Id and player2Id must be different' },
        { status: 400 }
      );
    }

    // Create the poll
    const newPoll = await prisma.poll.create({
      data: {
        player1: { connect: { id: parseInt(player1Id) } },
        player2: { connect: { id: parseInt(player2Id) } },
        creator: { connect: { id: creatorId } },
      },
    });

    return NextResponse.json(newPoll, { status: 201 });
  } catch (error) {
    console.error('Error creating poll:', error);
    return NextResponse.json({ error: 'Failed to create poll' }, { status: 500 });
  }
}