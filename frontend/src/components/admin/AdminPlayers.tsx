'use client';

import { useState, useEffect } from 'react';
import Loader from '../Loader';

export default function AdminPlayers() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newPlayer, setNewPlayer] = useState({ name: '', position: '', team: '' });
  const [bulkPlayers, setBulkPlayers] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [deletingPlayerId, setDeletingPlayerId] = useState(null); // Track which player is being deleted
  const [isCreating, setIsCreating] = useState(false); // Track if a player is being created

  // Fetch players from the API
  useEffect(() => {
    fetch('/api/players')
      .then((response) => response.json())
      .then((data) => {
        setPlayers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching players:', error);
        setError('Failed to fetch players');
        setLoading(false);
      });
  }, []);

  // Handle create single player
  const handleCreatePlayer = async () => {
    setIsCreating(true); // Set creating state to true
    setError(''); // Clear any previous errors

    try {
      const response = await fetch('/api/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPlayer),
      });

      if (!response.ok) {
        throw new Error('Failed to create player');
      }

      const createdPlayer = await response.json();
      setPlayers([...players, createdPlayer]);
      setNewPlayer({ name: '', position: '', team: '' }); // Reset the form
    } catch (error) {
      console.error('Error creating player:', error);
      setError('Failed to create player');
    } finally {
      setIsCreating(false); // Reset creating state
    }
  };

  // Handle bulk player upload
  const handleBulkUpload = async () => {
    setIsUploading(true);
    setError('');

    try {
      const playersArray = JSON.parse(bulkPlayers);
      if (!Array.isArray(playersArray)) {
        throw new Error('Invalid JSON format. Expected an array of players.');
      }

      const response = await fetch('/api/players/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playersArray),
      });

      if (!response.ok) {
        throw new Error('Failed to upload players');
      }

      const createdPlayers = await response.json();
      if (Array.isArray(createdPlayers)) {
        setPlayers([...players, ...createdPlayers]);
        setBulkPlayers('');
      } else {
        throw new Error('Unexpected response format. Expected an array of players.');
      }
    } catch (error) {
      console.error('Error uploading players:', error);
      setError('Failed to upload players: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle delete player
  const handleDeletePlayer = async (playerId) => {
    setDeletingPlayerId(playerId); // Set the player being deleted
    try {
      const response = await fetch(`/api/players/${playerId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete player');
      }

      setPlayers(players.filter((player) => player.id !== playerId));
    } catch (error) {
      console.error('Error deleting player:', error);
      setError('Failed to delete player');
    } finally {
      setDeletingPlayerId(null); // Clear the deleting state
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Players</h2>

      {/* Create Single Player Form */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-2">Create New Player</h3>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Player Name"
            value={newPlayer.name}
            onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
            className="bg-gray-700 text-white px-4 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Player Position"
            value={newPlayer.position}
            onChange={(e) => setNewPlayer({ ...newPlayer, position: e.target.value })}
            className="bg-gray-700 text-white px-4 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Player Team"
            value={newPlayer.team}
            onChange={(e) => setNewPlayer({ ...newPlayer, team: e.target.value })}
            className="bg-gray-700 text-white px-4 py-2 rounded"
          />
          <button
            onClick={handleCreatePlayer}
            disabled={isCreating} // Disable the button while creating
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isCreating ? 'Creating...' : 'Create Player'}
          </button>
        </div>
      </div>

      {/* Bulk Player Upload */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-2">Bulk Upload Players</h3>
        <textarea
          placeholder="Paste JSON array of players here"
          value={bulkPlayers}
          onChange={(e) => setBulkPlayers(e.target.value)}
          className="w-full bg-gray-700 text-white px-4 py-2 rounded mb-4"
          rows={10}
        />
        <button
          onClick={handleBulkUpload}
          disabled={isUploading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isUploading ? 'Uploading...' : 'Upload Players'}
        </button>
      </div>

      {/* Players List */}
      <ul>
        {players.map((player) => (
          <li key={player.id} className="border border-gray-700 p-4 mb-4 rounded-lg">
            <h3 className="text-xl font-bold">{player.name}</h3>
            <p>Position: {player.position}</p>
            <p>Team: {player.team}</p>
            <button
              onClick={() => handleDeletePlayer(player.id)}
              disabled={deletingPlayerId === player.id} // Disable the button while deleting
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded mt-2 disabled:opacity-50"
            >
              {deletingPlayerId === player.id ? 'Deleting...' : 'Delete Player'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}