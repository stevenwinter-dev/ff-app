'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import SocialMedia from './SocialMedia';

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
    if (poll.status === 'closed') {
      setError('This poll is closed and no longer accepting votes.');
      return;
    }

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

  // Generate the poll URL for sharing
  const pollUrl = `${window.location.origin}/poll/${poll.id}`;

  return (
    <div className=" p-6 rounded-lg shadow-lg text-white flex flex-col h-[400px] relative">
      {/* Top Section: Player 1 vs. Player 2 */}
      <div className="text-center mb-6">
        <p className="text-xl font-bold">
          {poll.player1.position} {poll.player1.name}
        </p>
        <p className="text-lg text-gray-400 my-2">or</p>
        <p className="text-xl font-bold">
          {poll.player2.position} {poll.player2.name}
        </p>
      </div>

      {/* Middle Section: Poll Results (Visible After Voting) */}
      {hasVoted && (
        <div className="mb-3 p-3 bg-gray-900 border border-emerald-400">
          {/* Player 1 Vote Bar */}
          <div className="flex items-center mb-4">
            <div className="w-full bg-gray-800 h-6 relative">
              <div
                className="bg-blue-500 h-6"
                style={{ width: `${player1Percentage}%` }}
              ></div>
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-white">
                {player1Percentage.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Player 2 Vote Bar */}
          <div className="flex items-center">
            <div className="w-full bg-gray-800 h-6 relative">
              <div
                className="bg-fuchsia-500 h-6"
                style={{ width: `${player2Percentage}%` }}
              ></div>
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-white">
                {player2Percentage.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Total Votes Display */}
          <p className="text-sm text-gray-400 mt-2 text-center">
            Total votes: {totalVotes}
          </p>
        </div>
      )}

      {/* Bottom Section: Voting Buttons or Share Buttons */}
      <div className="absolute bottom-0 left-0 right-0 flex">
        {hasVoted ? (
          // Social Media Share Buttons
          <SocialMedia poll={poll} pollUrl={pollUrl} pollId={poll.id} />
        ) : (
          // Voting Buttons
          <>
            <button
              onClick={() => handleVote(poll.player1.id)}
              disabled={hasVoted || selectedPlayerId === poll.player1.id || poll.status === 'closed'}
              className="flex-1 bg-slate-950 hover:bg-slate-900 text-white py-6 cursor-pointer rounded-bl-lg disabled:opacity-50 disabled:cursor-not-allowed border-t-2 border-r border-white"
            >
              {hasVoted && selectedPlayerId === poll.player1.id ? 'Voted' : poll.player1.name}
            </button>
            <button
              onClick={() => handleVote(poll.player2.id)}
              disabled={hasVoted || selectedPlayerId === poll.player2.id || poll.status === 'closed'}
              className="flex-1 bg-slate-950 hover:bg-slate-900 text-white py-6 cursor-pointer rounded-br-lg disabled:opacity-50 disabled:cursor-not-allowed border-t-2 border-l border-white"
            >
              {hasVoted && selectedPlayerId === poll.player2.id ? 'Voted' : poll.player2.name}
            </button>
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-2 bg-red-500 text-white text-sm rounded-lg text-center">
          {error}
        </div>
      )}
    </div>
  );
} 