'use client';

import React from 'react';

export default function PollDisplay({ poll }) {
  return (
    <div className="border border-gray-700 hover:border-slate-900 p-6 mb-6 rounded-lg shadow-lg bg-slate-950 text-white flex flex-col">
      <h2 className="text-xl font-bold mb-2">Poll ID: {poll.id}</h2>
      <p className="text-gray-400 mb-2">Created by: {poll.creator.name}</p>
      <p className="text-gray-400 mb-4">Created at: {new Date(poll.createdAt).toLocaleString()}</p>

      <h3 className="text-lg font-semibold mb-2">Players:</h3>
      <ul className="list-disc list-inside mb-4">
        <li className="text-gray-300">
          {poll.player1.name} (Position: {poll.player1.position}, Team: {poll.player1.team})
        </li>
        <li className="text-gray-300">
          {poll.player2.name} (Position: {poll.player2.position}, Team: {poll.player2.team})
        </li>
      </ul>

      <h3 className="text-lg font-semibold mb-2">Votes:</h3>
      <ul className="list-disc list-inside">
        {poll.votes.map((vote) => (
          <li key={vote.id} className="text-gray-300">
            User {vote.user.name} voted for {vote.player.name}
          </li>
        ))}
      </ul>
    </div>
  );
}