'use client';

import { useState, useEffect } from 'react';
import Loader from '../global/Loader';
import PollTabs from './PollTabs';
import PollTable from './PollTable';
import { toast } from 'react-toastify';

export default function AdminPolls() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingPollId, setDeletingPollId] = useState(null);
  const [resettingPollId, setResettingPollId] = useState(null);
  const [updatingPollId, setUpdatingPollId] = useState(null);
  const [winningPlayerIds, setWinningPlayerIds] = useState({});
  const [changingStatusPollId, setChangingStatusPollId] = useState(null);
  const [activeTab, setActiveTab] = useState('open');

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
    setDeletingPollId(pollId);
    try {
      const response = await fetch(`/api/polls/${pollId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete poll');
      }

      setPolls(polls.filter((poll) => poll.id !== pollId));
    } catch (error) {
      console.error('Error deleting poll:', error);
      setError('Failed to delete poll');
    } finally {
      setDeletingPollId(null);
    }
  };

  // Handle reset poll (delete votes)
  const handleResetPoll = async (pollId) => {
    setResettingPollId(pollId);
    try {
      const response = await fetch(`/api/polls/${pollId}/votes`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to reset poll');
      }

      const updatedPolls = await fetch('/api/polls').then((res) => res.json());
      setPolls(updatedPolls);
    } catch (error) {
      console.error('Error resetting poll:', error);
      setError('Failed to reset poll');
    } finally {
      setResettingPollId(null);
    }
  };

  // Handle manual update of poll results
  const handleManualUpdate = async (pollId) => {
    const winningPlayerId = winningPlayerIds[pollId];
    if (!winningPlayerId) {
      setError('Please select a winner before updating.');
      return;
    }

    setUpdatingPollId(pollId);
    try {
      const response = await fetch(`/api/polls/${pollId}/manualUpdate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ winningPlayerId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update poll');
      }

      toast.success('Poll updated successfully!');
      const updatedPolls = await fetch('/api/polls').then((res) => res.json());
      setPolls(updatedPolls);
      setWinningPlayerIds((prev) => ({ ...prev, [pollId]: null }));
    } catch (error) {
      console.error('Error updating poll:', error);
      setError('Failed to update poll');
    } finally {
      setUpdatingPollId(null);
    }
  };

  // Handle open/close poll
  const handleChangePollStatus = async (pollId, status) => {
    setChangingStatusPollId(pollId);
    try {
      const response = await fetch(`/api/polls/${pollId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update poll status');
      }

      const updatedPolls = await fetch('/api/polls').then((res) => res.json());
      setPolls(updatedPolls);
    } catch (error) {
      console.error('Error updating poll status:', error);
      setError('Failed to update poll status');
    } finally {
      setChangingStatusPollId(null);
    }
  };

  // Handle selecting a winner for a specific poll
  const handleSelectWinner = (pollId, playerId) => {
    setWinningPlayerIds((prev) => ({ ...prev, [pollId]: playerId }));
  };

  // Get unique players from active polls
  const getUniquePlayers = () => {
    const activePolls = polls.filter((poll) => poll.status === 'open' || poll.status === 'closed');
    const players = new Set<string>();

    activePolls.forEach((poll) => {
      players.add(poll.player1.name);
      players.add(poll.player2.name);
    });

    return Array.from(players);
  };

  // Handle batch resolve
  const handleBatchResolve = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/polls/batch-resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        toast.success('All polls resolved successfully!');
        const updatedPolls = await fetch('/api/polls').then((res) => res.json());
        setPolls(updatedPolls);
      } else {
        const errorData = await response.json();
        toast.error(`Failed to resolve polls: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error resolving polls:', error);
      toast.error('An error occurred while resolving polls.');
    } finally {
      setLoading(false);
    }
  };

  // Filter polls based on the active tab
  const filteredPolls = polls.filter((poll) => {
    if (activeTab === 'open') return poll.status === 'open';
    if (activeTab === 'closed') return poll.status === 'closed';
    if (activeTab === 'resolved') return poll.status === 'resolved';
    return true;
  });

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Polls</h2>
      <PollTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 'batch-resolve' ? (
        <div>
          <h3 className="text-xl font-bold mb-4">Batch Resolve</h3>
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">Unique Players in Active Polls</h4>
            <ul className="list-disc list-inside">
              {getUniquePlayers().map((player, index) => (
                <li key={index} className="text-gray-700">
                  {player}
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={handleBatchResolve}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Resolving...' : 'Resolve All Polls'}
          </button>
        </div>
      ) : (
        <PollTable
          polls={filteredPolls}
          handleDeletePoll={handleDeletePoll}
          handleResetPoll={handleResetPoll}
          handleChangePollStatus={handleChangePollStatus}
          handleSelectWinner={handleSelectWinner}
          handleManualUpdate={handleManualUpdate}
          deletingPollId={deletingPollId}
          resettingPollId={resettingPollId}
          changingStatusPollId={changingStatusPollId}
          updatingPollId={updatingPollId}
          winningPlayerIds={winningPlayerIds}
        />
      )}
    </div>
  );
}