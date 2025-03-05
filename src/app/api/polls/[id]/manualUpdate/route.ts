// api/polls/[id]/manualUpdate/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const pollId = parseInt(params.id);
  const { player1Points, player2Points } = await request.json();

  try {
    // Fetch the poll
    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: { player1: true, player2: true },
    });

    if (!poll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }

    // Determine the winning player
    const winningPlayerId = player1Points > player2Points ? poll.player1Id : poll.player2Id;

    // Update the poll with real-life results
    const updatedPoll = await prisma.poll.update({
      where: { id: pollId },
      data: {
        player1Points,
        player2Points,
        winningPlayerId,
        status: 'resolved', // Mark the poll as resolved
      },
    });

    // Update user votes and accuracy
    const votes = await prisma.vote.findMany({
      where: { pollId },
    });

    for (const vote of votes) {
      const isCorrect = vote.playerId === winningPlayerId;
      await prisma.vote.update({
        where: { id: vote.id },
        data: { isCorrect },
      });

      // Recalculate user accuracy
      const user = await prisma.user.findUnique({
        where: { id: vote.userId },
        include: { votes: true },
      });

      if (user) {
        const totalVotes = user.votes.length;
        const accurateVotes = user.votes.filter((v) => v.isCorrect).length;
        const accuracyScore = (accurateVotes / totalVotes) * 100;

        await prisma.user.update({
          where: { id: vote.userId },
          data: { accuracyScore },
        });
      }
    }

    return NextResponse.json(updatedPoll);
  } catch (error) {
    console.error('Error updating poll:', error);
    return NextResponse.json({ error: 'Failed to update poll' }, { status: 500 });
  }
}