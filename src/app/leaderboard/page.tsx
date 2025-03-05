'use client';

import { useEffect, useState } from 'react';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the leaderboard data
  useEffect(() => {
    fetch('/api/leaderboard')
      .then((response) => response.json())
      .then((data) => {
        setLeaderboard(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching leaderboard:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading leaderboard...</p>;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      <ul>
        {leaderboard.map((user, index) => (
          <li key={user.id} className="border border-gray-700 p-4 mb-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <span className="text-xl font-bold">{index + 1}.</span>
                <div>
                  <p className="text-lg font-bold">{user.name || user.username}</p>
                  <p className="text-sm text-gray-400">@{user.username}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{user.weightedScore.toFixed(2)}</p>
                <p className="text-sm text-gray-400">
                  {user.accuracyScore.toFixed(1)}% accuracy ({user.participationPoints} votes)
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}