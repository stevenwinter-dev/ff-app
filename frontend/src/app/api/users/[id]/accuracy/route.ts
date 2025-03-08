import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id: userId } = params;

  try {
    // Fetch the user with their votes and include the related poll to check its status
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        votes: {
          include: {
            poll: true, // Include the poll to check its status
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Filter out votes from open polls
    const resolvedVotes = user.votes.filter((vote) => vote.poll.status === 'resolved');

    // Calculate accuracy based on resolved votes only
    const totalResolvedVotes = resolvedVotes.length;
    const accurateVotes = resolvedVotes.filter((vote) => vote.isCorrect).length;
    const accuracyScore =
      totalResolvedVotes === 0 ? 0 : (accurateVotes / totalResolvedVotes) * 100;

    return NextResponse.json({
      totalResolvedVotes, // Total votes in resolved polls
      accurateVotes, // Votes that were correct
      accuracyScore, // Accuracy percentage
    });
  } catch (error) {
    console.error('Error fetching user accuracy:', error);
    return NextResponse.json({ error: 'Failed to fetch user accuracy' }, { status: 500 });
  }
}