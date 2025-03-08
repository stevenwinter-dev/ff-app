import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

// Helper function to calculate weighted score
const calculateWeightedScore = (accuracyScore: number, participationScore: number) => {
  return accuracyScore * Math.log(participationScore + 1);
};

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const pollId = parseInt(params.id);
  const { winningPlayerId } = await request.json();

  try {
    // Update the poll with the winning player and mark it as resolved
    const updatedPoll = await prisma.poll.update({
      where: { id: pollId },
      data: {
        winningPlayerId,
        status: 'resolved',
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

      // Recalculate user accuracy and weighted score
      const user = await prisma.user.findUnique({
        where: { id: vote.userId },
        include: { votes: true },
      });

      if (user) {
        const totalVotes = user.votes.length;
        const accurateVotes = user.votes.filter((v) => v.isCorrect).length;
        const accuracyScore = (accurateVotes / totalVotes) * 100;
        const weightedScore = calculateWeightedScore(accuracyScore, totalVotes);

        await prisma.user.update({
          where: { id: vote.userId },
          data: { accuracyScore, weightedScore },
        });
      }
    }

    return NextResponse.json(updatedPoll);
  } catch (error) {
    console.error('Error resolving poll:', error);
    return NextResponse.json({ error: 'Failed to resolve poll' }, { status: 500 });
  }
}