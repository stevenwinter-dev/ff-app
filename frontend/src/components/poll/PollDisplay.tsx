'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify'; // Import toast for notifications
import SocialMedia from './SocialMedia';
import PollInsight from './PollInsight';
import Loader from '../global/Loader'; // Import the Loader component

export default function PollDisplay({ poll, onVote }) {
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [error, setError] = useState('');
  const [hasVoted, setHasVoted] = useState(false); // Track if the user has already voted
  const [isSubmitting, setIsSubmitting] = useState(false); // Track if the vote is being submitted
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

    setIsSubmitting(true); // Show loader while submitting

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
      toast.success('Vote submitted successfully!'); // Show success toast
      onVote(); // Refetch the poll data
    } catch (error) {
      console.error('Error submitting vote:', error);
      setError('Failed to submit vote. Please try again.');
      toast.error('Failed to submit vote. Please try again.'); // Show error toast
    } finally {
      setIsSubmitting(false); // Hide loader after submission
    }
  };

  // Generate the poll URL for sharing
  const pollUrl = `${window.location.origin}/poll/${poll.id}`;

  return (
    <div className="p-6 rounded-lg shadow-lg shadow-zinc-300 text-zinc-950 flex flex-col h-[400px] relative border-1 border-stone-200 bg-white">
      {/* Top Section: Player 1 vs. Player 2 */}
      <div className="text-center mb-6">
        <p className="text-xl font-bold">
          {poll.player1.position} {poll.player1.name}
        </p>
        <p className="text-lg text-zinc-800 my-2">or</p>
        <p className="text-xl font-bold">
          {poll.player2.position} {poll.player2.name}
        </p>
      </div>

      {/* Middle Section: Poll Results (Visible After Voting) */}
      {hasVoted && (
        <div className="mb-3 p-3 border border-stone-200 rounded-sm">
          {/* Player 1 Vote Bar */}
          <div className="flex items-center mb-4">
            <PollInsight
              votes={poll.votes.filter((vote) => vote.playerId === poll.player1Id)}
              totalVotes={totalVotes}
              barColor="bg-sky-400"
              percentage={player1Percentage}
            />
          </div>

          {/* Player 2 Vote Bar */}
          <div className="flex items-center">
            <PollInsight
              votes={poll.votes.filter((vote) => vote.playerId === poll.player2Id)}
              totalVotes={totalVotes}
              barColor="bg-rose-500"
              percentage={player2Percentage}
            />
          </div>

          {/* Total Votes Display */}
          <p className="text-sm text-slate-950 mt-2 text-center">
            Total votes: {totalVotes}
          </p>
        </div>
      )}

      {/* Bottom Section: Voting Buttons, Loader, or Share Buttons */}
      <div className="absolute bottom-0 left-0 right-0 flex">
        {hasVoted ? (
          // Social Media Share Buttons
          <SocialMedia poll={poll} pollUrl={pollUrl} pollId={poll.id} />
        ) : isSubmitting ? (
          // Loader while submitting vote
          <div className="flex-1 flex justify-center items-center py-6">
            <Loader />
          </div>
        ) : (
          // Voting Buttons
          <>
            <button
              onClick={() => handleVote(poll.player1.id)}
              disabled={hasVoted || selectedPlayerId === poll.player1.id || poll.status === 'closed'}
              className="flex-1 bg-sky-400 hover:bg-sky-500 text-white py-6 cursor-pointer rounded-bl-lg disabled:opacity-50 disabled:cursor-not-allowed border-t-2 border-r border-white"
            >
              {hasVoted && selectedPlayerId === poll.player1.id ? 'Voted' : poll.player1.name}
            </button>
            <button
              onClick={() => handleVote(poll.player2.id)}
              disabled={hasVoted || selectedPlayerId === poll.player2.id || poll.status === 'closed'}
              className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-6 cursor-pointer rounded-br-lg disabled:opacity-50 disabled:cursor-not-allowed border-t-2 border-l border-white"
            >
              {hasVoted && selectedPlayerId === poll.player2.id ? 'Voted' : poll.player2.name}
            </button>
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-2 bg-red-500 text-zinc-950 text-sm rounded-lg text-center">
          {error}
        </div>
      )}
    </div>
  );
}