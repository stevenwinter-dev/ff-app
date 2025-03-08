'use client';

import { useState, useEffect } from 'react';

export default function AdminPolls() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingPollId, setDeletingPollId] = useState(null); // Track which poll is being deleted
  const [resettingPollId, setResettingPollId] = useState(null); // Track which poll's votes are being reset
  const [updatingPollId, setUpdatingPollId] = useState(null); // Track which poll is being updated
  const [winningPlayerIds, setWinningPlayerIds] = useState({}); // Track the selected winner for each poll
  const [changingStatusPollId, setChangingStatusPollId] = useState(null); // Track which poll's status is being changed

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

  // Handle manual update of poll results
  const handleManualUpdate = async (pollId) => {
    const winningPlayerId = winningPlayerIds[pollId];
    if (!winningPlayerId) {
      setError('Please select a winner before updating.');
      return;
    }

    setUpdatingPollId(pollId); // Set the poll being updated
    try {
      const response = await fetch(`/api/polls/${pollId}/manualUpdate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ winningPlayerId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update poll');
      }

      // Refetch the polls to update the results
      const updatedPolls = await fetch('/api/polls').then((res) => res.json());
      setPolls(updatedPolls);

      // Reset the selected winner for this poll
      setWinningPlayerIds((prev) => ({ ...prev, [pollId]: null }));
    } catch (error) {
      console.error('Error updating poll:', error);
      setError('Failed to update poll');
    } finally {
      setUpdatingPollId(null); // Clear the updating state
    }
  };

  // Handle open/close poll
  const handleChangePollStatus = async (pollId, status) => {
    setChangingStatusPollId(pollId); // Set the poll being updated
    try {
      const response = await fetch(`/api/polls/${pollId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update poll status');
      }

      // Refetch the polls to update the status
      const updatedPolls = await fetch('/api/polls').then((res) => res.json());
      setPolls(updatedPolls);
    } catch (error) {
      console.error('Error updating poll status:', error);
      setError('Failed to update poll status');
    } finally {
      setChangingStatusPollId(null); // Clear the updating state
    }
  };

  // Handle selecting a winner for a specific poll
  const handleSelectWinner = (pollId, playerId) => {
    setWinningPlayerIds((prev) => ({ ...prev, [pollId]: playerId }));
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
            <h3 className="text-xl font-bold">{poll.player1.name} {poll.player1.position} vs {poll.player2.name} {poll.player2.position}</h3>
            <p className="text-xl font-bold">Poll ID: {poll.id}</p>
            <p>Created by: {poll.creator.name}</p>
            <p>Created at: {new Date(poll.createdAt).toLocaleString()}</p>
            <p>Votes: {poll.votes.length}</p>
            <p>Status: {poll.status}</p>
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
              <button
                onClick={() => handleChangePollStatus(poll.id, poll.status === 'open' ? 'closed' : 'open')}
                disabled={changingStatusPollId === poll.id} // Disable the button while updating
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {changingStatusPollId === poll.id ? 'Updating...' : poll.status === 'open' ? 'Close Poll' : 'Open Poll'}
              </button>
            </div>
            {/* Manual Update Section */}
            <div className="mt-4">
              <h4 className="text-lg font-bold mb-2">Update Poll Results</h4>
              <div className="flex flex-col space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={winningPlayerIds[poll.id] === poll.player1.id}
                    onChange={() => handleSelectWinner(poll.id, poll.player1.id)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span>{poll.player1.name}</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={winningPlayerIds[poll.id] === poll.player2.id}
                    onChange={() => handleSelectWinner(poll.id, poll.player2.id)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span>{poll.player2.name}</span>
                </label>
                <button
                  onClick={() => handleManualUpdate(poll.id)}
                  disabled={updatingPollId === poll.id || !winningPlayerIds[poll.id]} // Disable the button while updating or if no winner is selected
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50 w-40"
                >
                  {updatingPollId === poll.id ? 'Updating...' : 'Update Results'}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}