import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function POST() {
  try {
    // Fetch all active polls
    const activePolls = await prisma.poll.findMany({
      where: {
        status: { in: ['open', 'closed'] },
      },
    });

    // Resolve all active polls
    await prisma.poll.updateMany({
      where: {
        status: { in: ['open', 'closed'] },
      },
      data: {
        status: 'resolved',
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error resolving polls:', error);
    return NextResponse.json({ success: false, message: 'Failed to resolve polls' }, { status: 500 });
  }
}