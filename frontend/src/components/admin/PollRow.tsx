'use client';

import PollActions from './PollActions';
import PollResultsUpdate from './PollResultsUpdate';

interface PollRowProps {
  poll: any;
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

export default function PollRow({
  poll,
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
}: PollRowProps) {
  return (
    <tr key={poll.id} className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-4 py-2">
        {poll.player1.name} {poll.player1.position} vs {poll.player2.name} {poll.player2.position}
      </td>
      <td className="px-4 py-2">{poll.id}</td>
      <td className="px-4 py-2">{poll.creator.username}</td>
      <td className="px-4 py-2">{new Date(poll.createdAt).toLocaleString()}</td>
      <td className="px-4 py-2">{poll.votes.length}</td>
      <td className="px-4 py-2">{poll.status}</td>
      <td className="px-4 py-2">
        <PollActions
          poll={poll}
          handleDeletePoll={handleDeletePoll}
          handleResetPoll={handleResetPoll}
          handleChangePollStatus={handleChangePollStatus}
          deletingPollId={deletingPollId}
          resettingPollId={resettingPollId}
          changingStatusPollId={changingStatusPollId}
        />
      </td>
      <td className="px-4 py-2">
        <PollResultsUpdate
          poll={poll}
          handleSelectWinner={handleSelectWinner}
          handleManualUpdate={handleManualUpdate}
          updatingPollId={updatingPollId}
          winningPlayerIds={winningPlayerIds}
        />
      </td>
    </tr>
  );
}