'use client';

import React from 'react';
import { PlayerState, Item } from '../utils/types';

interface PlayerInfoProps {
  playerState: PlayerState;
  onSelectItem: (item: Item) => void;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ playerState, onSelectItem }) => {
  return (
    <div className="p-5">
      <div className="mb-4">
        <h3 className="text-green-300 mb-2">Player Info</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Health: {playerState.health}/{playerState.maxHealth}</div>
          <div>Level: {playerState.level}</div>
          <div>XP: {playerState.xp}/{playerState.xpToNextLevel}</div>
          <div>Gold: {playerState.gold}</div>
          <div>Location: {playerState.location}</div>
        </div>
      </div>
      
      <div>
        <h3 className="text-green-300 mb-2">Inventory</h3>
        <div className="max-h-96 overflow-y-auto">
          {playerState.inventory.length === 0 ? (
            <p className="text-gray-400 text-sm">Your inventory is empty.</p>
          ) : (
            <ul className="space-y-2">
              {playerState.inventory.map((item) => (
                <li 
                  key={item.id}
                  className="bg-gray-800 p-2 rounded cursor-pointer hover:bg-gray-700"
                  onClick={() => onSelectItem(item)}
                >
                  <div className="flex justify-between">
                    <span>{item.name}</span>
                  </div>
                  <div className="text-xs text-gray-400">{item.type}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerInfo; 