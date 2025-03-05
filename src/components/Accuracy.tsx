'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function Accuracy() {
  const { data: session } = useSession();
  const [accuracy, setAccuracy] = useState({ totalVotes: 0, accurateVotes: 0, score: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch the user's accuracy data
  const fetchAccuracy = async () => {
    if (session?.user?.id) {
      try {
        const response = await fetch(`/api/users/${session.user.id}/accuracy`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAccuracy({
          totalVotes: data.totalVotes,
          accurateVotes: data.accurateVotes,
          score: data.accuracyScore,
        });
        setError('');
      } catch (error) {
        console.error('Error fetching accuracy:', error);
        setError('Failed to fetch accuracy data. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchAccuracy();
  }, [session]);

  if (loading) {
    return <p>Loading accuracy data...</p>;
  }

  if (error) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Your Accuracy</h2>
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchAccuracy}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Your Accuracy</h2>
      <div className="space-y-2">
        <p>Total Votes: {accuracy.totalVotes}</p>
        <p>Accurate Votes: {accuracy.accurateVotes}</p>
        <p>Accuracy Score: {accuracy.totalVotes === 0 ? 'N/A' : `${accuracy.score.toFixed(1)}%`}</p>
      </div>
    </div>
  );
}