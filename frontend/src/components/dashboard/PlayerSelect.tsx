import React, { useState, useEffect } from 'react';

interface Player {
  id: number;
  name: string;
  position: string;
}

interface PlayerSelectProps {
  label: string;
  players: Player[];
  selectedPlayer: string | null;
  onChange: (playerId: string) => void;
}

export default function PlayerSelect({ label, players, selectedPlayer, onChange }: PlayerSelectProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  // Reset searchTerm when selectedPlayer is cleared
  useEffect(() => {
    if (!selectedPlayer) {
      setSearchTerm('');
    }
  }, [selectedPlayer]);

  // Filter players based on search term
  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setIsDropdownVisible(true);
  };

  // Handle player selection
  const handlePlayerSelect = (playerId: string) => {
    onChange(playerId);
    setSearchTerm(players.find((player) => player.id === parseInt(playerId))?.name || '');
    setIsDropdownVisible(false);
  };

  return (
    <div className="mb-4 relative">
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => setIsDropdownVisible(true)}
        onBlur={() => setTimeout(() => setIsDropdownVisible(false), 200)} // Delay to allow click on dropdown
        placeholder="Search player by name"
        className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
      />

      {/* Dropdown list */}
      {isDropdownVisible && searchTerm && (
        <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filteredPlayers.map((player) => (
            <div
              key={player.id}
              onClick={() => handlePlayerSelect(player.id.toString())}
              className="p-2 hover:bg-gray-700 cursor-pointer"
            >
              {player.name} ({player.position})
            </div>
          ))}
          {filteredPlayers.length === 0 && (
            <div className="p-2 text-gray-400">No players found</div>
          )}
        </div>
      )}
    </div>
  );
}