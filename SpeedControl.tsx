import React from 'react';
import { useGame, GameSpeed } from '../context/GameContext';

const speedLabels: Record<GameSpeed, { label: string; labelRu: string; icon: string }> = {
  0: { label: 'Paused', labelRu: 'Пауза', icon: '⏸' },
  1: { label: 'Slow', labelRu: 'Медленно', icon: '▶' },
  2: { label: 'Normal', labelRu: 'Стандарт', icon: '▶▶' },
  3: { label: 'Fast', labelRu: 'Быстро', icon: '▶▶▶' },
};

const SpeedControl: React.FC = () => {
  const { state, setGameSpeed } = useGame();
  const currentSpeed = state.gameSpeed;

  const speeds: GameSpeed[] = [0, 1, 2, 3];

  return (
    <div className="flex items-center gap-2 bg-[#1a1d24] rounded-lg px-3 py-2 border border-gray-700">
      <span className="text-xs text-gray-400 mr-1 hidden sm:inline">Скорость:</span>
      
      <div className="flex items-center gap-1">
        {speeds.map((speed) => (
          <button
            key={speed}
            onClick={() => setGameSpeed(speed)}
            className={`
              relative px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
              ${currentSpeed === speed 
                ? speed === 0 
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                : 'bg-gray-800 text-gray-400 border border-gray-600 hover:bg-gray-700 hover:text-gray-200'
              }
            `}
            title={speedLabels[speed].labelRu}
          >
            <span className="hidden sm:inline">{speed}</span>
            <span className="sm:hidden text-xs">{speedLabels[speed].icon}</span>
            
            {currentSpeed === speed && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            )}
          </button>
        ))}
      </div>

      <div className="hidden md:flex items-center gap-2 ml-2 pl-2 border-l border-gray-600">
        <span className={`text-xs ${currentSpeed === 0 ? 'text-yellow-400' : 'text-gray-400'}`}>
          {speedLabels[currentSpeed].labelRu}
        </span>
        {currentSpeed > 0 && (
          <span className="text-xs text-gray-500">
            ({currentSpeed === 1 ? '4с' : currentSpeed === 2 ? '2с' : '0.8с'}/мес)
          </span>
        )}
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="hidden lg:flex items-center gap-1 ml-2 pl-2 border-l border-gray-600">
        <span className="text-[10px] text-gray-500">Пробел: пауза</span>
      </div>
    </div>
  );
};

// Hook for keyboard shortcuts
export const useSpeedKeyboard = () => {
  const { state, setGameSpeed, advanceTime } = useGame();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case ' ':
          e.preventDefault();
          // Toggle pause
          if (state.gameSpeed === 0) {
            setGameSpeed(2); // Resume at normal speed
          } else {
            setGameSpeed(0); // Pause
          }
          break;
        case '0':
          setGameSpeed(0);
          break;
        case '1':
          setGameSpeed(1);
          break;
        case '2':
          setGameSpeed(2);
          break;
        case '3':
          setGameSpeed(3);
          break;
        case '.':
        case '>':
          // Manual advance one month (only when paused)
          if (state.gameSpeed === 0) {
            advanceTime();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.gameSpeed, setGameSpeed, advanceTime]);
};

export default SpeedControl;
