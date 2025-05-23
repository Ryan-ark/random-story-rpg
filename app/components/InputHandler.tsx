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
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input field when component mounts
  useEffect(() => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSubmit(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle numeric shortcuts for options
    if (!disabled && options.length > 0 && e.key >= '1' && e.key <= `${options.length}`) {
      const optionIndex = parseInt(e.key) - 1;
      if (optionIndex >= 0 && optionIndex < options.length) {
        onSubmit(options[optionIndex]);
        setInput('');
      }
    }
  };

  // Quick combat commands
  const handleQuickCommand = (command: string) => {
    if (!disabled) {
      onSubmit(command);
      setInput('');
    }
  };

  return (
    <div className="mt-4 w-full">
      {inCombat && (
        <div className="flex flex-wrap gap-2 mb-2">
          <button
            onClick={() => handleQuickCommand('attack')}
            disabled={disabled}
            className="flex-1 min-w-[80px] bg-red-800 hover:bg-red-700 text-white px-2 sm:px-4 py-1 rounded font-mono disabled:opacity-50 text-sm sm:text-base"
          >
            Attack
          </button>
          <button
            onClick={() => handleQuickCommand('defend')}
            disabled={disabled}
            className="flex-1 min-w-[80px] bg-blue-800 hover:bg-blue-700 text-white px-2 sm:px-4 py-1 rounded font-mono disabled:opacity-50 text-sm sm:text-base"
          >
            Defend
          </button>
          <button
            onClick={() => handleQuickCommand('flee')}
            disabled={disabled}
            className="flex-1 min-w-[80px] bg-gray-800 hover:bg-gray-700 text-white px-2 sm:px-4 py-1 rounded font-mono disabled:opacity-50 text-sm sm:text-base"
          >
            Flee
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row">
        <div className="hidden sm:flex bg-gray-800 text-green-400 px-2 py-2 font-mono">
          &gt;
        </div>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="flex-1 bg-black text-green-400 px-2 py-2 font-mono focus:outline-none border sm:border-l-0 border-gray-800 rounded-t sm:rounded-none"
          aria-label="Game command input"
          placeholder={disabled ? "Waiting for adventure..." : "Enter command..."}
          tabIndex={0}
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="bg-green-900 hover:bg-green-800 text-white px-4 py-2 font-mono disabled:opacity-50 rounded-b sm:rounded-none"
          aria-label="Submit command"
        >
          Enter
        </button>
      </form>

      {options.length > 0 && (
        <div className="mt-2 text-xs sm:text-sm text-gray-500 font-mono">
          Tip: Type a number (1-{options.length}) to quickly select an option
        </div>
      )}
    </div>
  );
};

export default InputHandler; 