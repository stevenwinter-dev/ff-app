'use client';

import AdminPlayers from '../admin/AdminPlayers';
import AdminPolls from '../admin/AdminPolls';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import NotFound from '../global/NotFound'; // Create a 404 component

export default function AdminPanel() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('polls'); // Track which tab is active

  // Check if the user is the admin
  if (session?.user?.email !== 'steveplayshorn@gmail.com') {
    return <NotFound />; // Display a 404 page if the user is not the admin
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('polls')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Manage Polls
        </button>
        <button
          onClick={() => setActiveTab('players')}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Manage Players
        </button>
      </div>

      <div>
        {activeTab === 'polls' && <AdminPolls />}
        {activeTab === 'players' && <AdminPlayers />}
      </div>
    </div>
  );
}