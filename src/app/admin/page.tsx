'use client';

import AdminPlayers from '@/components/admin/AdminPlayers';
import AdminPolls from '@/components/admin/AdminPolls';
import { useState } from 'react';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState(null); // Track which tab is active

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
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