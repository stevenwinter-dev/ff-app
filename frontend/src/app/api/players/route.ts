// src/app/api/players/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET: Fetch all players
export async function GET() {
  try {
    const players = await prisma.player.findMany();
    return new Response(JSON.stringify(players), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch players' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// POST: Create a new player
export async function POST(request) {
  try {
    const { name, position, team } = await request.json();

    // Validate input
    if (!name || !position || !team) {
      return new Response(
        JSON.stringify({ error: 'Name, position, and team are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Create the player
    const newPlayer = await prisma.player.create({
      data: {
        name,
        position,
        team,
      },
    });

    return new Response(JSON.stringify(newPlayer), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating player:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create player' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}