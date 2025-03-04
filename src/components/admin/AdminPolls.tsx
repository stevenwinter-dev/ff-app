'use client';

import { useState, useEffect } from 'react';

export default function AdminPolls() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingPollId, setDeletingPollId] = useState(null); // Track which poll is being deleted
  const [resettingPollId, setResettingPollId] = useState(null); // Track which poll's votes are being reset

  // Fetch polls from the API
  useEffect(() => {
    fetch('/api/polls')
      .then((response) => response.json())
      .then((data) => {
        setPolls(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching polls:', error);
        setError('Failed to fetch polls');
        setLoading(false);
      });
  }, []);

  // Handle delete poll
  const handleDeletePoll = async (pollId) => {
    setDeletingPollId(pollId); // Set the poll being deleted
    try {
      const response = await fetch(`/api/polls/${pollId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete poll');
      }

      // Remove the deleted poll from the state
      setPolls(polls.filter((poll) => poll.id !== pollId));
    } catch (error) {
      console.error('Error deleting poll:', error);
      setError('Failed to delete poll');
    } finally {
      setDeletingPollId(null); // Clear the deleting state
    }
  };

  // Handle reset poll (delete votes)
  const handleResetPoll = async (pollId) => {
    setResettingPollId(pollId); // Set the poll being reset
    try {
      const response = await fetch(`/api/polls/${pollId}/votes`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to reset poll');
      }

      // Refetch the polls to update the vote count
      const updatedPolls = await fetch('/api/polls').then((res) => res.json());
      setPolls(updatedPolls);
    } catch (error) {
      console.error('Error resetting poll:', error);
      setError('Failed to reset poll');
    } finally {
      setResettingPollId(null); // Clear the resetting state
    }
  };

  if (loading) {
    return <div>Loading polls...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Polls</h2>
      <ul>
        {polls.map((poll) => (
          <li key={poll.id} className="border border-gray-700 p-4 mb-4 rounded-lg">
            <h3 className="text-xl font-bold">Poll ID: {poll.id}</h3>
            <p>Created by: {poll.creator.name}</p>
            <p>Created at: {new Date(poll.createdAt).toLocaleString()}</p>
            <p>Votes: {poll.votes.length}</p>
            <div className="flex space-x-2 mt-2">
              <button
                onClick={() => handleDeletePoll(poll.id)}
                disabled={deletingPollId === poll.id} // Disable the button while deleting
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {deletingPollId === poll.id ? 'Deleting...' : 'Delete Poll'}
              </button>
              <button
                onClick={() => handleResetPoll(poll.id)}
                disabled={resettingPollId === poll.id} // Disable the button while resetting
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {resettingPollId === poll.id ? 'Resetting...' : 'Reset Poll'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}