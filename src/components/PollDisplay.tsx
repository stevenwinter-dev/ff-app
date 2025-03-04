'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function PollDisplay({ poll, onVote }) {
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [error, setError] = useState('');
  const [hasVoted, setHasVoted] = useState(false); // Track if the user has already voted
  const { data: session } = useSession(); // Get the current session

  // Calculate vote percentages
  const totalVotes = poll.votes.length;
  const player1Votes = poll.votes.filter((vote) => vote.playerId === poll.player1Id).length;
  const player2Votes = totalVotes - player1Votes;

  const player1Percentage = totalVotes > 0 ? (player1Votes / totalVotes) * 100 : 50;
  const player2Percentage = totalVotes > 0 ? (player2Votes / totalVotes) * 100 : 50;

  // Check if the current user has already voted in this poll
  useEffect(() => {
    if (session?.user?.id) {
      const userVote = poll.votes.find((vote) => vote.userId === session.user.id);
      if (userVote) {
        setHasVoted(true);
        setSelectedPlayerId(userVote.playerId); // Set the selected player if the user has already voted
      }
    }
  }, [poll.votes, session]);

  const handleVote = async (playerId) => {
    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pollId: poll.id,
          playerId: playerId,
          userId: session.user.id, // Use the current user's ID from the session
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit vote');
      }

      const data = await response.json();
      console.log('Vote submitted:', data);
      setSelectedPlayerId(playerId); // Update the selected player
      setHasVoted(true); // Mark the user as having voted
      setError(''); // Clear any previous errors
      onVote(); // Refetch the poll data
    } catch (error) {
      console.error('Error submitting vote:', error);
      setError('Failed to submit vote. Please try again.');
    }
  };

  return (
    <div className="border border-gray-700 p-6 mb-6 rounded-lg shadow-lg bg-slate-950 text-white flex flex-col">
      <h2 className="text-xl font-bold mb-2">Poll ID: {poll.id}</h2>
      <p className="text-gray-400 mb-2">Created by: {poll.creator.name}</p>
      <p className="text-gray-400 mb-4">Created at: {new Date(poll.createdAt).toLocaleString()}</p>

      <h3 className="text-lg font-semibold mb-2">Players:</h3>
      <div className="mb-4">
        <p className="text-gray-300 mb-2">
          {poll.player1.name} (Position: {poll.player1.position}, Team: {poll.player1.team})
        </p>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${player1Percentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-400 mt-1">
          {player1Votes} vote{player1Votes !== 1 ? 's' : ''} ({player1Percentage.toFixed(1)}%)
        </p>
        <button
          onClick={() => handleVote(poll.player1.id)}
          disabled={hasVoted || selectedPlayerId === poll.player1.id} // Disable if the user has already voted
          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded disabled:opacity-50"
        >
          {hasVoted && selectedPlayerId === poll.player1.id ? 'Voted' : 'Vote for ' + poll.player1.name}
        </button>
      </div>

      <div className="mb-4">
        <p className="text-gray-300 mb-2">
          {poll.player2.name} (Position: {poll.player2.position}, Team: {poll.player2.team})
        </p>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-green-600 h-2.5 rounded-full"
            style={{ width: `${player2Percentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-400 mt-1">
          {player2Votes} vote{player2Votes !== 1 ? 's' : ''} ({player2Percentage.toFixed(1)}%)
        </p>
        <button
          onClick={() => handleVote(poll.player2.id)}
          disabled={hasVoted || selectedPlayerId === poll.player2.id} // Disable if the user has already voted
          className="mt-2 bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded disabled:opacity-50"
        >
          {hasVoted && selectedPlayerId === poll.player2.id ? 'Voted' : 'Vote for ' + poll.player2.name}
        </button>
      </div>

      <p className="text-sm text-gray-400 mb-4">
        Total votes: {totalVotes}
      </p>

      {hasVoted && <p className="text-green-500 mt-2">You have already voted in this poll.</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}