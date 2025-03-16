'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function Accuracy() {
  const { data: session } = useSession();
  const [accuracy, setAccuracy] = useState({
    totalResolvedVotes: 0,
    accurateVotes: 0,
    weightedScore: 0,
    accuracyScore: 0,
    totalVotes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

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
            totalResolvedVotes: data.totalResolvedVotes,
            accurateVotes: data.accurateVotes,
            weightedScore: data.weightedScore,
            accuracyScore: data.accuracyScore,
            totalVotes: data.totalVotes,
          });
          setLoading(false);
          console.log('Accuracy data:', data);
        })
        .catch((error) => {
          console.error('Error fetching accuracy:', error);
          setLoading(false);
        });
    }
  }, [session]);

  // Animate the accuracy score percentage
  useEffect(() => {
    let start = 0;
    const duration = 1000; // Animation duration in milliseconds
    const stepTime = 10; // Interval between updates
    const steps = duration / stepTime;
    const increment = accuracy.accuracyScore / steps;

    const animate = () => {
      start += increment;
      if (start >= accuracy.accuracyScore) {
        setAnimatedPercentage(accuracy.accuracyScore);
      } else {
        setAnimatedPercentage(start);
        setTimeout(animate, stepTime);
      }
    };

    if (!loading) {
      animate();
    }
  }, [accuracy.accuracyScore, loading]);

  if (loading) {
    return <p className="text-white">Loading accuracy data...</p>;
  }

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-6">Your Accuracy</h2>

      {/* Ring Visualization */}
      <div className="relative w-32 h-32 mx-auto mb-6">
        <div
          className="absolute w-full h-full rounded-full transition-all duration-100"
          style={{
            background: `conic-gradient(
              #00BCFF ${animatedPercentage}%,
              #FF1F57 ${animatedPercentage}% 100%
            )`,
          }}
        ></div>
        <div className="absolute inset-4 bg-gray-900 rounded-full flex items-center justify-center">
          <span className="text-xl font-bold">{accuracy.accuracyScore.toFixed(2)}%</span>
        </div>
      </div>

      {/* Accuracy Details */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Votes:</span>
          <span className="text-sm font-medium">{accuracy.accurateVotes}/{accuracy.totalResolvedVotes} <br />{accuracy.totalVotes - accuracy.totalResolvedVotes} votes in active polls</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Weighted Score:</span>
          <span className="text-sm font-medium">{accuracy.weightedScore.toFixed(2)} points</span>
        </div>
      </div>
    </div>
  );
}