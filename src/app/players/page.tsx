// pages/index.js
'use client'

import React, { useEffect, useState } from 'react';
import Loader from '@/components/Loader';

export default function Players() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch players from the API route
    fetch('/api/players')
      .then((response) => response.json())
      .then((data) => {
        setPlayers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching players:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <h1>Players</h1>
      <ul>
        {players.map((player) => (
          <li key={player.id}>
            {player.name} - {player.position} - {player.team}
          </li>
        ))}
      </ul>
    </div>
  );
}