'use client';

import React, { useState, useEffect } from 'react';

export default function PollInsight({ votes, totalVotes, barColor, percentage }) {
  const [isHovered, setIsHovered] = useState(false);
  const [animatedWidth, setAnimatedWidth] = useState(0);

  // Animate the bar width when the component mounts or the percentage changes
  useEffect(() => {
    setAnimatedWidth(percentage);
  }, [percentage]);

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Voting Bar */}
      <div className="w-full bg-gray-800 h-6 relative overflow-hidden">
        <div
          className={`${barColor} h-6 transition-all duration-1000 ease-in-out`}
          style={{ width: `${animatedWidth}%` }}
        ></div>
        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-white">
          {percentage.toFixed(1)}%
        </span>
      </div>

      {/* Voter List (Visible on Hover) */}
      {isHovered && (
        <div className="absolute z-10 bg-white border border-gray-300 rounded-lg shadow-lg p-4 mt-2 w-full">
          <ul>
            {votes.map((vote) => (
              <li key={vote.id} className="text-sm text-gray-700">
                <span>{vote.user.username}</span>
                <div className="ml-8 flex gap-4">
                  <span>{vote.user.accuracyScore.toFixed(2)}%</span>
                  <span>{vote.user.weightedScore.toFixed(0)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}