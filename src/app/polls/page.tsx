'use client';

import { useState, useEffect } from 'react';
import Loader from '@/components/Loader';
import PollDisplay from '@/components/PollDisplay'; // Import the PollDisplay component

export default function Polls() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch polls from the API route
    fetch('/api/polls')
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched polls:', data); // Check the full response in the console
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
    <div className="min-h-screen py-8">
      <h1 className="text-3xl font-bold text-center text-white mb-8">Polls</h1>
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {polls.map((poll) => (
            <PollDisplay key={poll.id} poll={poll} /> // Render each poll using PollDisplay
          ))}
        </div>
      </div>
    </div>
  );
}