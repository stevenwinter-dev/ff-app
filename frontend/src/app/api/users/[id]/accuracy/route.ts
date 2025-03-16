import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id: userId } =  await params;

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

    return NextResponse.json({
      totalResolvedVotes, // Total votes in resolved polls
      accurateVotes, // Votes that were correct
      weightedScore: user.weightedScore, // Use the weightedScore from the User model
      accuracyScore: user.accuracyScore, // Use the accuracyScore from the User model
      totalVotes: user.votes.length, // Total votes cast by the user
    });
  } catch (error) {
    console.error('Error fetching user accuracy:', error);
    return NextResponse.json({ error: 'Failed to fetch user accuracy' }, { status: 500 });
  }
}