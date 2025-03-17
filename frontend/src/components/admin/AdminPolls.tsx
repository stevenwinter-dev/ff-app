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
  const [playerPointsJson, setPlayerPointsJson] = useState(''); // JSON input for player points

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
    const openPolls = polls.filter((poll) => poll.status === 'open'); // Only open polls
    const players = new Set();

    openPolls.forEach((poll) => {
      players.add(poll.player1.name);
      players.add(poll.player2.name);
    });

    return Array.from(players);
  };

  // Copy player names to clipboard
  const copyPlayerNamesToClipboard = () => {
    const playerNames = getUniquePlayers();
    const playerNamesString = JSON.stringify(playerNames, null, 2); // Pretty-print JSON

    navigator.clipboard
      .writeText(playerNamesString)
      .then(() => {
        toast.success('Copied to clipboard!');
      })
      .catch(() => {
        toast.error('Failed to copy to clipboard.');
      });
  };

  // Handle batch resolve
  const handleBatchResolve = async () => {
    setLoading(true);
    try {
      // Parse the JSON input
      const playerPoints = JSON.parse(playerPointsJson);

      // Resolve only open polls (exclude closed polls)
      const openPolls = polls.filter((poll) => poll.status === 'open');
      const resolvedPolls = openPolls.map((poll) => {
        const player1Points = playerPoints[poll.player1.name] || 0;
        const player2Points = playerPoints[poll.player2.name] || 0;

        return {
          id: poll.id,
          winnerId: player1Points > player2Points ? poll.player1.id : poll.player2.id,
        };
      });

      // Update polls in the database
      const response = await fetch('/api/polls/batch-resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resolvedPolls),
      });

      if (response.ok) {
        toast.success('All open polls resolved successfully!');
        const updatedPolls = await fetch('/api/polls').then((res) => res.json());
        setPolls(updatedPolls);
      } else {
        const errorData = await response.json();
        toast.error(`Failed to resolve polls: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error resolving polls:', error);
      toast.error('Invalid JSON or an error occurred while resolving polls.');
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
            <h4 className="text-lg font-semibold mb-2">Paste Player Points JSON</h4>
            <textarea
              value={playerPointsJson}
              onChange={(e) => setPlayerPointsJson(e.target.value)}
              placeholder='Paste JSON here: [
                { "name": "Stefon Diggs", "score": 28 },
                { "name": "Steven Winter", "score": 15 },
                { "name": "Jalen Hurts", "score": 30 },
                { "name": "Julian Winter", "score": 10 },
                { "name": "Derrick Henry", "score": 22 }
              ]'
              className="w-full p-2 border border-gray-300 rounded"
              rows={10}
            />
          </div>
          <button
            onClick={handleBatchResolve}
            disabled={loading || !playerPointsJson}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Resolving...' : 'Resolve All Polls'}
          </button>
        </div>
      ) : activeTab === 'active-players' ? (
        <div>
          <h3 className="text-xl font-bold mb-4">Active Players</h3>
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">Players in Open Polls</h4>
            <pre className="bg-gray-100 p-4 rounded mb-4">
              <code>{JSON.stringify(getUniquePlayers(), null, 2)}</code>
            </pre>
            <button
              onClick={copyPlayerNamesToClipboard}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Copy to Clipboard
            </button>
          </div>
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