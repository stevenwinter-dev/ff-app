// components/ManualUpdatePoll.tsx
'use client';

import { useState } from 'react';

export default function ManualUpdatePoll({ pollId }: { pollId: number }) {
  const [player1Points, setPlayer1Points] = useState(0);
  const [player2Points, setPlayer2Points] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const response = await fetch(`/api/polls/${pollId}/manualUpdate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player1Points, player2Points }),
    });
    setLoading(false);

    if (response.ok) {
      alert('Poll updated successfully!');
    } else {
      alert('Failed to update poll.');
    }
  };

  return (
    <div>
      <h2>Update Poll Results</h2>
      <div>
        <label>
          Player 1 Points:
          <input
            type="number"
            value={player1Points}
            placeholder=''
            onChange={(e) => setPlayer1Points(parseFloat(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          Player 2 Points:
          <input
            type="number"
            value={player2Points}
            onChange={(e) => setPlayer2Points(parseFloat(e.target.value))}
          />
        </label>
      </div>
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Updating...' : 'Update Poll'}
      </button>
    </div>
  );
}