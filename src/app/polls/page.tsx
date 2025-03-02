// pages/index.js
'use client'

import Loader from '@/components/Loader';
import React, { useEffect, useState } from 'react';

export default function Polls() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch polls from the API route
    fetch('/api/polls')
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched polls:', data);
        setPolls(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching polls:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <h1>Polls</h1>
      <ul>
        {polls.map((poll) => (
          <li key={poll.id}>
            <br />
            Creator ID: {poll.creatorId}
            <br />
            Player 1 ID: {poll.player1Id}
            <br />
            Player 2 ID: {poll.player2Id}
          </li>
        ))}
      </ul>
    </div>
  );
}