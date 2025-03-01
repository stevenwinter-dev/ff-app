// pages/index.js
'use client'

import React, { useEffect, useState } from 'react';

export default function Players() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    // Fetch players from the API route
    fetch('/api/players')
      .then((response) => response.json())
      .then((data) => setPlayers(data))
      .catch((error) => console.error('Error fetching players:', error));
  }, []);

  return (
    <div>
      <h1>Players</h1>
      <ul>
        {players.map((player) => (
          <li key={player.id}>
            {player.name} - {player.position} ({player.team})
          </li>
        ))}
      </ul>
    </div>
  );
}