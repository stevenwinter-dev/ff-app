'use client';

interface PollResultsUpdateProps {
  poll: any;
  handleSelectWinner: (pollId: string, playerId: string) => void;
  handleManualUpdate: (pollId: string) => void;
  updatingPollId: string | null;
  winningPlayerIds: Record<string, string>;
}

export default function PollResultsUpdate({
  poll,
  handleSelectWinner,
  handleManualUpdate,
  updatingPollId,
  winningPlayerIds,
}: PollResultsUpdateProps) {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={winningPlayerIds[poll.id] === poll.player1.id}
          onChange={() => handleSelectWinner(poll.id, poll.player1.id)}
          className="form-checkbox h-4 w-4 text-blue-600"
        />
        <span className="text-sm">{poll.player1.name}</span>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={winningPlayerIds[poll.id] === poll.player2.id}
          onChange={() => handleSelectWinner(poll.id, poll.player2.id)}
          className="form-checkbox h-4 w-4 text-blue-600"
        />
        <span className="text-sm">{poll.player2.name}</span>
      </div>
      <button
        onClick={() => handleManualUpdate(poll.id)}
        disabled={updatingPollId === poll.id || !winningPlayerIds[poll.id]}
        className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-sm disabled:opacity-50"
      >
        {updatingPollId === poll.id ? 'Updating...' : 'Update'}
      </button>
    </div>
  );
}