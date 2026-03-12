import React from 'react';
import { useGame } from '../context/GameContext';

interface GameOverScreenProps {
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ onRestart }) => {
  const { state } = useGame();

  const isVictory = state.gameOverReason.includes('Победа');

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gray-600 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative text-center max-w-2xl mx-auto px-8">
        {isVictory ? (
          <>
            {/* Victory */}
            <div className="mb-8">
              <div className="text-6xl mb-4">🏆</div>
              <h1 className="text-4xl font-extralight text-[#E8E7E4] mb-4">
                ПОБЕДА
              </h1>
              <div className="w-24 h-0.5 bg-green-500 mx-auto mb-6" />
            </div>

            <p className="text-xl text-green-400 mb-8">
              {state.gameOverReason}
            </p>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 mb-8">
              <p className="text-gray-400">
                Вы провели страну через водный кризис, сохранив стабильность и избежав войны.
                Это достижение, которого не смогли добиться многие реальные лидеры.
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Defeat */}
            <div className="mb-8">
              <h1 className="text-5xl font-extralight text-[#E8E7E4] mb-4">
                ВОДА ЗАКОНЧИЛАСЬ
              </h1>
              <div className="w-24 h-0.5 bg-[#D94F3B] mx-auto mb-6" />
            </div>

            <p className="text-xl text-[#D94F3B] mb-8">
              {state.gameOverReason}
            </p>

            <div className="bg-[#D94F3B]/10 border border-[#D94F3B]/30 rounded-lg p-6 mb-8">
              <p className="text-gray-400 italic">
                «Вода закончилась.<br />
                Всё остальное — вопрос времени.»
              </p>
            </div>
          </>
        )}

        {/* Final Statistics */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-2xl font-bold text-[#E8E7E4]">{state.year}</p>
            <p className="text-xs text-gray-500">Последний год</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-2xl font-bold text-[#E8E7E4]">
              {state.activeInitiatives.filter(i => i.completed).length}
            </p>
            <p className="text-xs text-gray-500">Инициатив завершено</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-2xl font-bold text-[#E8E7E4]">
              ${state.budget.toFixed(1)}B
            </p>
            <p className="text-xs text-gray-500">Финальный бюджет</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-2xl font-bold text-[#E8E7E4]">
              {Math.round(state.damFillLevel)}%
            </p>
            <p className="text-xs text-gray-500">Уровень GERD</p>
          </div>
        </div>

        <button
          onClick={onRestart}
          className={`
            px-8 py-3 rounded-lg font-semibold transition-all duration-300
            ${isVictory 
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-[#D94F3B] hover:bg-[#c44433] text-white'
            }
          `}
        >
          Начать заново
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen;
