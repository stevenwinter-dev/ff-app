// api/polls/[id]/status/route.ts
import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id: pollId } = params;
  const { status } = await request.json();

  try {
    const updatedPoll = await prisma.poll.update({
      where: { id: parseInt(pollId) },
      data: { status },
    });

    return NextResponse.json(updatedPoll);
  } catch (error) {
    console.error('Error updating poll status:', error);
    return NextResponse.json({ error: 'Failed to update poll status' }, { status: 500 });
  }
}