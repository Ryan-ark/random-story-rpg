import React, { useState, useRef, useEffect } from 'react';

interface InputHandlerProps {
  onSubmit: (input: string) => void;
  disabled?: boolean;
  options?: string[];
  inCombat?: boolean;
}

const InputHandler = ({ 
  onSubmit, 
  disabled = false, 
  options = [],
  inCombat = false
}: InputHandlerProps) => {
  // Handle option button click
  const handleOptionClick = (option: string) => {
    if (!disabled) {
      onSubmit(option);
    }
  };

  // Quick combat commands
  const handleQuickCommand = (command: string) => {
    if (!disabled) {
      onSubmit(command);
    }
  };

  return (
    <div className="mt-4 w-full">
      {/* Combat buttons */}
      {inCombat && (
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => handleQuickCommand('attack')}
            disabled={disabled}
            className="flex-1 min-w-[80px] bg-red-800 hover:bg-red-700 text-white px-2 sm:px-4 py-2 rounded font-mono disabled:opacity-50 text-sm sm:text-base"
          >
            Attack
          </button>
          <button
            onClick={() => handleQuickCommand('defend')}
            disabled={disabled}
            className="flex-1 min-w-[80px] bg-blue-800 hover:bg-blue-700 text-white px-2 sm:px-4 py-2 rounded font-mono disabled:opacity-50 text-sm sm:text-base"
          >
            Defend
          </button>
          <button
            onClick={() => handleQuickCommand('flee')}
            disabled={disabled}
            className="flex-1 min-w-[80px] bg-gray-800 hover:bg-gray-700 text-white px-2 sm:px-4 py-2 rounded font-mono disabled:opacity-50 text-sm sm:text-base"
          >
            Flee
          </button>
        </div>
      )}

      {/* Option buttons */}
      {options.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              disabled={disabled}
              className="bg-green-800 hover:bg-green-700 text-white px-3 py-3 rounded font-mono text-left disabled:opacity-50 text-sm sm:text-base transition-colors duration-200"
            >
              {option}
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 text-sm font-mono p-3">
          {disabled ? "Waiting for adventure..." : "Choose your path..."}
        </div>
      )}
    </div>
  );
};

export default InputHandler; 