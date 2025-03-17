import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function POST(request: Request) {
  try {
    const resolvedPolls = await request.json();

    // Update each poll in the database
    for (const poll of resolvedPolls) {
      // Ensure the poll is open before resolving it
      const existingPoll = await prisma.poll.findUnique({
        where: { id: poll.id },
      });

      if (existingPoll && existingPoll.status === 'open') {
        await prisma.poll.update({
          where: { id: poll.id },
          data: {
            status: 'resolved',
            winningPlayerId: poll.winnerId, // Ensure this field is included
          },
        });

        // Update user votes and accuracy (similar to manualUpdate)
        const votes = await prisma.vote.findMany({
          where: { pollId: poll.id },
        });

        for (const vote of votes) {
          const isCorrect = vote.playerId === poll.winnerId;
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
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error resolving polls:', error);
    return NextResponse.json({ success: false, message: 'Failed to resolve polls' }, { status: 500 });
  }
}

// Helper function to calculate weighted score
const calculateWeightedScore = (accuracyScore: number, participationScore: number) => {
  return accuracyScore * Math.log(participationScore + 1);
};