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

  // Separate the top 3 users and the rest
  const topThree = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>

      {/* Podium for Top 3 */}
      <div className="flex justify-center space-x-4 mb-8">
        {topThree.map((user, index) => (
          <div
            key={user.id}
            className={`flex-1 flex flex-col items-center p-4 rounded-lg ${
              index === 0
                ? 'bg-gradient-to-b from-yellow-400 to-yellow-600' // Gold
                : index === 1
                ? 'bg-gradient-to-b from-gray-300 to-gray-500' // Silver
                : 'bg-gradient-to-b from-amber-700 to-amber-900' // Bronze
            }`}
          >
            <span className="text-2xl font-bold">
              {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
            </span>
            <p className="text-lg font-bold mt-2">{user.name || user.username}</p>
            <p className="text-sm text-gray-200">@{user.username}</p>
            <p className="text-lg font-bold mt-2">{user.weightedScore.toFixed(2)}</p>
            <p className="text-sm text-gray-200">
              {user.accuracyScore.toFixed(1)}% accuracy ({user.participationPoints} votes)
            </p>
          </div>
        ))}
      </div>

      {/* List for the Rest */}
      <ul>
        {rest.map((user, index) => (
          <li key={user.id} className="border border-gray-700 p-4 mb-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <span className="text-xl font-bold">{index + 4}.</span>
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