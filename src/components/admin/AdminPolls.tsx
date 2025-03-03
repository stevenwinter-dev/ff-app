'use client';

import { useState, useEffect } from 'react';

export default function AdminPolls() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
            <button
              onClick={() => handleDeletePoll(poll.id)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded mt-2"
            >
              Delete Poll
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}