'use client';

interface PollTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function PollTabs({ activeTab, setActiveTab }: PollTabsProps) {
  return (
    <div className="flex space-x-4 mb-6 border-b border-gray-200">
      <button
        onClick={() => setActiveTab('open')}
        className={`px-4 py-2 text-sm font-medium ${
          activeTab === 'open'
            ? 'border-b-2 border-blue-600 text-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Open Polls
      </button>
      <button
        onClick={() => setActiveTab('closed')}
        className={`px-4 py-2 text-sm font-medium ${
          activeTab === 'closed'
            ? 'border-b-2 border-blue-600 text-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Closed Polls
      </button>
      <button
        onClick={() => setActiveTab('resolved')}
        className={`px-4 py-2 text-sm font-medium ${
          activeTab === 'resolved'
            ? 'border-b-2 border-blue-600 text-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Resolved Polls
      </button>
      <button
        onClick={() => setActiveTab('batch-resolve')}
        className={`px-4 py-2 text-sm font-medium ${
          activeTab === 'batch-resolve'
            ? 'border-b-2 border-blue-600 text-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Batch Resolve
      </button>
    </div>
  );
}