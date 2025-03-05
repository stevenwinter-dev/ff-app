import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id: userId } = await params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { votes: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const totalVotes = user.votes.length;
    const accurateVotes = user.votes.filter((vote) => vote.isCorrect).length;
    const accuracyScore = totalVotes === 0 ? 0 : (accurateVotes / totalVotes) * 100;

    return NextResponse.json({
      totalVotes,
      accurateVotes,
      accuracyScore,
    });
  } catch (error) {
    console.error('Error fetching user accuracy:', error);
    return NextResponse.json({ error: 'Failed to fetch user accuracy' }, { status: 500 });
  }
}