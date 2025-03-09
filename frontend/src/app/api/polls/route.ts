import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { io } from 'socket.io-client';

const prisma = new PrismaClient();
const socket = io('http://localhost:3001'); // Connect to the backend server

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

    // Calculate vote percentages for each poll
    const pollsWithPercentages = polls.map((poll) => {
      const totalVotes = poll.votes.length;
      const player1Votes = poll.votes.filter((vote) => vote.playerId === poll.player1Id).length;
      const player2Votes = totalVotes - player1Votes;

      const player1Percentage = totalVotes > 0 ? (player1Votes / totalVotes) * 100 : 50;
      const player2Percentage = totalVotes > 0 ? (player2Votes / totalVotes) * 100 : 50;

      return {
        ...poll,
        player1Percentage,
        player2Percentage,
      };
    });

    return NextResponse.json(pollsWithPercentages);
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
      include: {
        player1: true, // Include player1
        player2: true, // Include player2
        creator: true, // Include the creator
        votes: true, // Include votes (if applicable)
      },
    });

    // Emit an event to notify all clients
    socket.emit('pollCreated', newPoll);

    return NextResponse.json(newPoll, { status: 201 });
  } catch (error) {
    console.error('Error creating poll:', error);
    return NextResponse.json({ error: 'Failed to create poll' }, { status: 500 });
  }
}