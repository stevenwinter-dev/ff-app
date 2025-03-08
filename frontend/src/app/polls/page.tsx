'use client';

import { useState, useEffect } from 'react';
import Loader from '../../components/Loader';
import PollDisplay from '../../components/PollDisplay2';

export default function Polls() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPolls = async () => {
    try {
      const response = await fetch('/api/polls');
      if (!response.ok) {
        throw new Error('Failed to fetch polls');
      }
      const data = await response.json();
      const openPolls = data.filter((poll) => poll.status === 'open');
      setPolls(openPolls);
      console.log(openPolls)
      setLoading(false);
    } catch (error) {
      console.error('Error fetching polls:', error);
      setError('Failed to fetch polls. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  }

  return (
    <div className="min-h-screen py-8">
      <h1 className="text-3xl font-bold text-center text-white mb-8">Polls</h1>
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {polls.map((poll) => (
            <PollDisplay
              key={poll.id}
              poll={poll}
              onVote={fetchPolls} // Pass the refetch function
            />
          ))}
        </div>
      </div>
    </div>
  );
}