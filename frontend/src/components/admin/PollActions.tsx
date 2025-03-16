'use client';

interface PollActionsProps {
  poll: any;
  handleDeletePoll: (pollId: string) => void;
  handleResetPoll: (pollId: string) => void;
  handleChangePollStatus: (pollId: string, status: string) => void;
  deletingPollId: string | null;
  resettingPollId: string | null;
  changingStatusPollId: string | null;
}

export default function PollActions({
  poll,
  handleDeletePoll,
  handleResetPoll,
  handleChangePollStatus,
  deletingPollId,
  resettingPollId,
  changingStatusPollId,
}: PollActionsProps) {
  return (
    <div className="flex space-x-2">
      <button
        onClick={() => handleDeletePoll(poll.id)}
        disabled={deletingPollId === poll.id}
        className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm disabled:opacity-50"
      >
        {deletingPollId === poll.id ? 'Deleting...' : 'Delete'}
      </button>
      <button
        onClick={() => handleResetPoll(poll.id)}
        disabled={resettingPollId === poll.id}
        className="bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded text-sm disabled:opacity-50"
      >
        {resettingPollId === poll.id ? 'Resetting...' : 'Reset'}
      </button>
      <button
        onClick={() => handleChangePollStatus(poll.id, poll.status === 'open' ? 'closed' : 'open')}
        disabled={changingStatusPollId === poll.id}
        className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-sm disabled:opacity-50"
      >
        {changingStatusPollId === poll.id ? 'Updating...' : poll.status === 'open' ? 'Close' : 'Open'}
      </button>
    </div>
  );
}