'use client';

import PollRow from './PollRow';

interface PollTableProps {
  polls: any[];
  handleDeletePoll: (pollId: string) => void;
  handleResetPoll: (pollId: string) => void;
  handleChangePollStatus: (pollId: string, status: string) => void;
  handleSelectWinner: (pollId: string, playerId: string) => void;
  handleManualUpdate: (pollId: string) => void;
  deletingPollId: string | null;
  resettingPollId: string | null;
  changingStatusPollId: string | null;
  updatingPollId: string | null;
  winningPlayerIds: Record<string, string>;
}

export default function PollTable({
  polls,
  handleDeletePoll,
  handleResetPoll,
  handleChangePollStatus,
  handleSelectWinner,
  handleManualUpdate,
  deletingPollId,
  resettingPollId,
  changingStatusPollId,
  updatingPollId,
  winningPlayerIds,
}: PollTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Matchup</th>
            <th className="px-4 py-2 text-left">Poll ID</th>
            <th className="px-4 py-2 text-left">Created By</th>
            <th className="px-4 py-2 text-left">Created At</th>
            <th className="px-4 py-2 text-left">Votes</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Actions</th>
            <th className="px-4 py-2 text-left">Update Results</th>
          </tr>
        </thead>
        <tbody>
          {polls.map((poll) => (
            <PollRow
              key={poll.id}
              poll={poll}
              handleDeletePoll={handleDeletePoll}
              handleResetPoll={handleResetPoll}
              handleChangePollStatus={handleChangePollStatus}
              handleSelectWinner={handleSelectWinner}
              handleManualUpdate={handleManualUpdate}
              deletingPollId={deletingPollId}
              resettingPollId={resettingPollId}
              changingStatusPollId={changingStatusPollId}
              updatingPollId={updatingPollId}
              winningPlayerIds={winningPlayerIds}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}