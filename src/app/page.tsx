'use client';

import { useEffect, useState } from 'react';
import PollDisplay from '@/components/PollDisplay';
import Link from 'next/link';
import Loader from '@/components/Loader';

export default function Home() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch polls from the API
  useEffect(() => {
    fetch('/api/polls')
      .then((response) => response.json())
      .then((data) => {
        setPolls(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching polls:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen text-white">
      {/* Hero Section */}
      <div className="relative h-[400px] flex items-center justify-center bg-[url('/football-hero.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold mb-4">Make Smarter Fantasy Football Decisions</h1>
          <p className="text-xl mb-8">Create and vote on start/sit polls to improve your lineup decisions.</p>
          <Link href="/polls" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg">
            View Polls
          </Link>
        </div>
      </div>

      {/* Featured Polls Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Featured Polls</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <Loader />
          ) : (
            polls.slice(0, 6).map((poll) => (
              <PollDisplay key={poll.id} poll={poll} onVote={() => {}} />
            ))
          )}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-800 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Create Polls</h3>
              <p>Choose two players and create a poll to get advice from the community.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Vote on Polls</h3>
              <p>Help others decide who to start by voting on their polls.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Track Accuracy</h3>
              <p>Earn points for correct votes and climb the leaderboard.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Preview */}
      <div className="container mx-auto px-4 py-12 ">
        <h2 className="text-3xl font-bold mb-8">Top Users</h2>
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex justify-between font-bold mb-4">
            <span>Rank</span>
            <span>Username</span>
            <span>Accuracy</span>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((rank) => (
              <div key={rank} className="flex justify-between">
                <span>#{rank}</span>
                <span>User{rank}</span>
                <span>{(100 - rank * 10).toFixed(1)}%</span>
              </div>
            ))}
          </div>
          <Link href="/leaderboard" className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
            View Full Leaderboard
          </Link>
        </div>
      </div>
    </div>
  );
}