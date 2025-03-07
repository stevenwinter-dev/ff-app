'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function Accuracy() {
  const { data: session } = useSession();
  const [accuracy, setAccuracy] = useState({ totalVotes: 0, accurateVotes: 0, score: 0 });
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

  // Animate the accuracy percentage
  useEffect(() => {
    let start = 0;
    const duration = 1000; // Animation duration in milliseconds
    const stepTime = 10; // Interval between updates
    const steps = duration / stepTime;
    const increment = accuracy.score / steps;

    const animate = () => {
      start += increment;
      if (start >= accuracy.score) {
        setAnimatedPercentage(accuracy.score);
      } else {
        setAnimatedPercentage(start);
        setTimeout(animate, stepTime);
      }
    };

    if (!loading) {
      animate();
    }
  }, [accuracy.score, loading]);

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
          <span className="text-xl font-bold">{accuracy.score.toFixed(1)}%</span>
        </div>
      </div>

      {/* Accuracy Details */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Total Votes:</span>
          <span className="text-sm font-medium">{accuracy.totalVotes}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Accurate Votes:</span>
          <span className="text-sm font-medium">{accuracy.accurateVotes}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Accuracy Score:</span>
          <span className="text-sm font-medium">{accuracy.score.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}