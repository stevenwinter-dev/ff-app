import { useState, useEffect } from 'react';

export default function CreatePoll({ creatorId }) {
  const [players, setPlayers] = useState([]); // List of all players
  const [selectedPlayer1, setSelectedPlayer1] = useState(null); // Selected player 1
  const [selectedPlayer2, setSelectedPlayer2] = useState(null); // Selected player 2
  const [loading, setLoading] = useState(true); // Loading state for players
  const [error, setError] = useState(''); // Error message

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
        setError('Failed to fetch players');
        setLoading(false);
      });
  }, []);

  // Handle player selection
  const handlePlayer1Change = (event) => {
    setSelectedPlayer1(event.target.value);
  };

  const handlePlayer2Change = (event) => {
    setSelectedPlayer2(event.target.value);
  };

  // Handle poll creation
  const handleCreatePoll = async () => {
    if (!selectedPlayer1 || !selectedPlayer2 || selectedPlayer1 === selectedPlayer2) {
      setError('Please select two different players.');
      return;
    }

    if (!creatorId) {
      setError('You must be logged in to create a poll.');
      return;
    }

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
      setError(''); // Clear any previous errors
      alert('Poll created successfully!');
    } catch (error) {
      console.error('Error creating poll:', error);
      setError('Failed to create poll');
    }
  };

  if (loading) {
    return <div>Loading players...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Create a Poll</h2>
      <div>
        <label>Player 1:</label>
        <select value={selectedPlayer1 || ''} onChange={handlePlayer1Change}>
          <option value="">Select a player</option>
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name} ({player.position})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Player 2:</label>
        <select value={selectedPlayer2 || ''} onChange={handlePlayer2Change}>
          <option value="">Select a player</option>
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name} ({player.position})
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handleCreatePoll}
        disabled={!selectedPlayer1 || !selectedPlayer2 || selectedPlayer1 === selectedPlayer2}
      >
        Create Poll
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}