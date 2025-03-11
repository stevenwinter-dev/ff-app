import React from 'react';

interface Player {
  id: number;
  name: string;
  position: string;
}

interface PlayerSelectProps {
  label: string;
  players: Player[];
  selectedPlayer: string | null;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function PlayerSelect({ label, players, selectedPlayer, onChange }: PlayerSelectProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">{label}</label>
      <select
        value={selectedPlayer || ''}
        onChange={onChange}
        className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
      >
        <option value="" disabled>
          Select a player
        </option>
        {players.map((player) => (
          <option key={player.id} value={player.id} className="bg-gray-800">
            {player.name} ({player.position})
          </option>
        ))}
      </select>
    </div>
  );
}