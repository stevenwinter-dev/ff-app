// frontend/src/app/api/votes/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { io } from 'socket.io-client';

const prisma = new PrismaClient();
const socket = io('http://localhost:3001'); // Connect to the backend server

// POST: Submit a vote
export async function POST(request) {
  try {
    const { pollId, playerId, userId } = await request.json();

    // Validate input
    if (!pollId || !playerId || !userId) {
      return NextResponse.json(
        { error: 'pollId, playerId, and userId are required' },
        { status: 400 }
      );
    }

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if the player belongs to the poll
    const poll = await prisma.poll.findUnique({
      where: { id: parseInt(pollId) },
      include: { player1: true, player2: true, votes: true },
    });

    if (!poll) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      );
    }

    if (poll.player1Id !== parseInt(playerId) && poll.player2Id !== parseInt(playerId)) {
      return NextResponse.json(
        { error: 'Invalid player for this poll' },
        { status: 400 }
      );
    }

    // Check if the user has already voted in this poll
    const existingVote = await prisma.vote.findFirst({
      where: {
        pollId: parseInt(pollId),
        userId: userId,
      },
    });

    if (existingVote) {
      return NextResponse.json(
        { error: 'You have already voted in this poll' },
        { status: 400 }
      );
    }

    // Create the vote
    const newVote = await prisma.vote.create({
      data: {
        pollId: parseInt(pollId),
        playerId: parseInt(playerId),
        userId: userId,
      },
      include: {
        poll: true,
        user: true,
        player: true,
      },
    });

    // Fetch the updated poll with votes
    const updatedPoll = await prisma.poll.findUnique({
      where: { id: parseInt(pollId) },
      include: {
        player1: true,
        player2: true,
        votes: {
          include: {
            user: true,
            player: true,
          },
        },
      },
    });

    // Emit the voteSubmitted event
    socket.emit('voteSubmitted', updatedPoll);

    return NextResponse.json(newVote, { status: 201 });
  } catch (error) {
    console.error('Error submitting vote:', error);
    return NextResponse.json({ error: 'Failed to submit vote' }, { status: 500 });
  }
}