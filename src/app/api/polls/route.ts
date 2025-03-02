import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const polls = await prisma.poll.findMany();
    return new Response(JSON.stringify(polls), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch polls' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}