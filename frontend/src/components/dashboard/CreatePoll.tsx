import { useState, useEffect } from 'react';
import PlayerSelect from './PlayerSelect';
import { toast } from 'react-toastify';
import Loader from '../global/Loader'; // Import the Loader component

export default function CreatePoll({ creatorId }) {
  const [players, setPlayers] = useState([]); // List of all players
  const [selectedPlayer1, setSelectedPlayer1] = useState(null); // Selected player 1
  const [selectedPlayer2, setSelectedPlayer2] = useState(null); // Selected player 2
  const [loading, setLoading] = useState(true); // Loading state for players
  const [isCreatingPoll, setIsCreatingPoll] = useState(false); // Loading state for poll creation

  // Fetch all players from the API
  useEffect(() => {
    fetch('/api/players')
      .then((response) => response.json())
      .then((data) => {
        setPlayers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching players:', error);
        toast.error('Failed to fetch players'); // Use toast for errors
        setLoading(false);
      });
  }, []);

  // Handle player selection
  const handlePlayer1Change = (playerId: string) => {
    setSelectedPlayer1(playerId);
  };

  const handlePlayer2Change = (playerId: string) => {
    setSelectedPlayer2(playerId);
  };

  // Handle poll creation
  const handleCreatePoll = async () => {
    if (!selectedPlayer1 || !selectedPlayer2 || selectedPlayer1 === selectedPlayer2) {
      toast.error('Please select two different players.');
      return;
    }

    if (!creatorId) {
      toast.error('You must be logged in to create a poll.');
      return;
    }

    setIsCreatingPoll(true); // Show loader

    try {
      const response = await fetch('/api/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          player1Id: parseInt(selectedPlayer1),
          player2Id: parseInt(selectedPlayer2),
          creatorId: creatorId, // Use the creatorId from props
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create poll');
      }

      const newPoll = await response.json();
      console.log('Poll created:', newPoll);
      toast.success('Poll created successfully!');

      // Clear inputs after successful creation
      setSelectedPlayer1(null);
      setSelectedPlayer2(null);
    } catch (error) {
      console.error('Error creating poll:', error);
      toast.error('Failed to create poll');
    } finally {
      setIsCreatingPoll(false); // Hide loader
    }
  };

  if (loading) {
    return <div className="text-white">Loading players...</div>;
  }

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-6">Create a Poll</h2>

      {/* Player 1 Selection */}
      <PlayerSelect
        label="Player 1:"
        players={players}
        selectedPlayer={selectedPlayer1}
        onChange={handlePlayer1Change}
      />

      {/* Player 2 Selection */}
      <PlayerSelect
        label="Player 2:"
        players={players}
        selectedPlayer={selectedPlayer2}
        onChange={handlePlayer2Change}
      />

      {/* Create Poll Button or Loader */}
      {isCreatingPoll ? (
        <Loader /> // Show loader while creating poll
      ) : (
        <button
          onClick={handleCreatePoll}
          disabled={!selectedPlayer1 || !selectedPlayer2 || selectedPlayer1 === selectedPlayer2}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Poll
        </button>
      )}
    </div>
  );
}