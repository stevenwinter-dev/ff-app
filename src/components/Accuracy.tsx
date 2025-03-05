'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function Accuracy() {
  const { data: session } = useSession();
  const [accuracy, setAccuracy] = useState({ totalVotes: 0, accurateVotes: 0, score: 0 });
  const [loading, setLoading] = useState(true);

  // Fetch the user's accuracy data
  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/users/${session.user.id}/accuracy`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setAccuracy({
            totalVotes: data.totalVotes,
            accurateVotes: data.accurateVotes,
            score: data.accuracyScore,
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching accuracy:', error);
          setLoading(false);
        });
    }
  }, [session]);

  if (loading) {
    return <p>Loading accuracy data...</p>;
  }

  // Calculate the percentage for the ring visualization
  const accuracyPercentage = accuracy.score; // e.g., 80%
  const inaccuracyPercentage = 100 - accuracy.score; // e.g., 20%

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Your Accuracy</h2>

      {/* Ring Visualization */}
      <div className="relative w-32 h-32 mx-auto mb-4">
        <div
          className="absolute w-full h-full rounded-full"
          style={{
            background: `conic-gradient(
              #00BCFF ${accuracyPercentage}%,
              #FF1F57 ${accuracyPercentage}% ${accuracyPercentage + inaccuracyPercentage}%
            )`,
          }}
        ></div>
        <div className="absolute inset-4 bg-gray-800 rounded-full flex items-center justify-center">
          <span className="text-xl font-bold">{accuracy.score.toFixed(1)}%</span>
        </div>
      </div>

      {/* Accuracy Details */}
      <div className="space-y-2">
        <p>Total Votes: {accuracy.totalVotes}</p>
        <p>Accurate Votes: {accuracy.accurateVotes}</p>
        <p>Accuracy Score: {accuracy.score.toFixed(1)}%</p>
      </div>
    </div>
  );
}