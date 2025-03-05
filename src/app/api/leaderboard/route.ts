import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const leaderboard = await prisma.user.findMany({
      orderBy: { weightedScore: 'desc' },
      select: {
        id: true,
        name: true,
        username: true,
        accuracyScore: true,
        weightedScore: true,
        votes: {
          select: {
            id: true, // Include only the vote ID to count the number of votes
          },
        },
      },
    });

    // Map over the results to include the number of votes
    const leaderboardWithVotes = leaderboard.map((user) => ({
      ...user,
      participationPoints: user.votes.length, // Calculate participation points dynamically
    }));

    return NextResponse.json(leaderboardWithVotes);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}