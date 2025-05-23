'use client';

import React, { useState } from 'react';
import { PlayerState, Item } from '../utils/types';

interface InventoryProps {
  playerState: PlayerState;
  onUseItem: (itemId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Inventory: React.FC<InventoryProps> = ({ 
  playerState, 
  onUseItem, 
  isOpen, 
  onClose 
}) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent, item: Item) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setSelectedItem(item);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900 p-3 sm:p-4 rounded-lg shadow-lg w-full max-w-3xl max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-green-400 font-mono">Inventory</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            aria-label="Close inventory"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            <div className="bg-gray-800 p-3 rounded mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-green-300 mb-1 sm:mb-0">Player Info</h3>
                <div className="text-sm">
                  HP: {playerState.health}/{playerState.maxHealth}
                </div>
              </div>
              <div className="text-sm mt-2">
                <div>Level: {playerState.level}</div>
                <div>XP: {playerState.xp}/{playerState.xpToNextLevel}</div>
                <div>Gold: {playerState.gold}</div>
              </div>
            </div>

            <h3 className="text-green-300 mb-2">Items</h3>
            <div className="h-48 sm:h-64 overflow-y-auto bg-gray-800 rounded">
              {playerState.inventory.length === 0 ? (
                <p className="p-3 text-gray-400">No items in inventory</p>
              ) : (
                <ul>
                  {playerState.inventory.map(item => (
                    <li
                      key={item.id}
                      className={`cursor-pointer transition-colors duration-200 ${
                        selectedItem && selectedItem.id === item.id
                          ? 'bg-blue-900'
                          : 'hover:bg-gray-700'
                      }`}
                      onClick={() => setSelectedItem(item)}
                      onKeyDown={(e) => handleKeyDown(e, item)}
                      tabIndex={0}
                      aria-label={`Item: ${item.name}, ${item.description}`}
                    >
                      <div className="p-2 sm:p-3 border-b border-gray-700">
                        <div className="flex justify-between">
                          <span className="text-sm sm:text-base">{item.name}</span>
                        </div>
                        <p className="text-gray-400 text-xs mt-1">{item.description}</p>
                        <div className="flex justify-between items-center mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onUseItem(item.id);
                            }}
                            className="bg-blue-900 hover:bg-blue-800 text-white px-2 py-1 text-xs rounded"
                            aria-label={`Use ${item.name}`}
                          >
                            {item.type === 'weapon' ? 'Equip' : 'Use'}
                          </button>
                          <span className="text-xs text-gray-400">
                            {item.type}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="w-full md:w-1/2 mt-4 md:mt-0">
            <div className="bg-gray-800 p-3 rounded mb-4">
              <h3 className="text-green-300">Item Details</h3>
            </div>
            
            {selectedItem ? (
              <div>
                <div className="mb-2">
                  <h4 className="font-bold mb-1">{selectedItem.name}</h4>
                  <div className="text-xs text-gray-400">Type: {selectedItem.type}</div>
                </div>
                
                <p className="text-sm mb-2">{selectedItem.description}</p>
                
                {selectedItem.effect && Object.keys(selectedItem.effect).length > 0 && (
                  <div className="mb-2">
                    <h5 className="text-green-300 text-sm">Effects:</h5>
                    <ul className="text-xs">
                      {selectedItem.effect.health && (
                        <li className="text-green-400">Health: +{selectedItem.effect.health}</li>
                      )}
                      {selectedItem.effect.damage && (
                        <li className="text-red-400">Damage: +{selectedItem.effect.damage}</li>
                      )}
                      {selectedItem.effect.defense && (
                        <li className="text-blue-400">Defense: +{selectedItem.effect.defense}</li>
                      )}
                      {selectedItem.effect.tempDamage && (
                        <li className="text-orange-400">Temp Damage: +{selectedItem.effect.tempDamage}</li>
                      )}
                      {selectedItem.effect.value && (
                        <li className="text-yellow-400">Value: {selectedItem.effect.value} gold</li>
                      )}
                    </ul>
                  </div>
                )}
                
                <div className="mt-4">
                  <button
                    onClick={() => onUseItem(selectedItem.id)}
                    className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 text-sm rounded"
                    aria-label={`Use ${selectedItem.name}`}
                  >
                    {selectedItem.type === 'weapon' ? 'Equip' : 'Use'}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-sm p-3">Select an item to see details</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory; 