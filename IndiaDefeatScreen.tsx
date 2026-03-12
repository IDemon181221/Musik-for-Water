import { useState, useEffect } from 'react';
import { IndiaGameState } from '../../contexts/IndiaGameContext';

interface Props {
  state: IndiaGameState;
  onExit: () => void;
}

export function IndiaDefeatScreen({ state, onExit }: Props) {
  const [phase, setPhase] = useState(0);
  
  const isNuclear = state.gameOverReason?.includes('Nuclear');
  
  useEffect(() => {
    if (isNuclear) {
      // Phase 0: White flash (8 seconds)
      setTimeout(() => setPhase(1), 8000);
      // Phase 1: Fade to black
      setTimeout(() => setPhase(2), 10000);
      // Phase 2: Show text
      setTimeout(() => setPhase(3), 12000);
    } else {
      // Non-nuclear defeat - skip flash
      setPhase(3);
    }
  }, [isNuclear]);
  
  // Nuclear flash phase
  if (isNuclear && phase === 0) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        {/* Pure white - silence */}
      </div>
    );
  }
  
  // Fade to black
  if (isNuclear && phase === 1) {
    return (
      <div 
        className="fixed inset-0 flex items-center justify-center transition-colors duration-2000"
        style={{ backgroundColor: 'rgb(0, 0, 0)' }}
      />
    );
  }
  
  // Final screen
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      {/* Nuclear winter simulation background */}
      {isNuclear && (
        <div className="absolute inset-0 opacity-30">
          {/* Dusty, grey atmosphere */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at center, #1a1a1a 0%, #0a0505 100%)'
            }}
          />
          
          {/* Ash particles */}
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-gray-500 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`
              }}
            />
          ))}
          
          {/* Dead landscape silhouette */}
          <svg className="absolute bottom-0 w-full h-32" viewBox="0 0 100 20" preserveAspectRatio="none">
            <path
              d="M 0 20 L 0 15 Q 10 12, 20 14 Q 30 10, 40 13 Q 50 8, 60 12 Q 70 10, 80 14 Q 90 11, 100 15 L 100 20 Z"
              fill="#1a1a1a"
            />
          </svg>
        </div>
      )}
      
      {/* Content */}
      <div 
        className={`relative z-10 text-center max-w-2xl px-8 transition-opacity duration-2000 ${
          phase >= 3 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {isNuclear ? (
          <>
            <div className="text-6xl mb-8">☢️</div>
            
            <p className="text-xl text-gray-300 mb-8">
              {state.year} год так и не наступил.
            </p>
            
            <p className="text-2xl text-white font-light">
              Вода закончилась раньше.
            </p>
          </>
        ) : (
          <>
            <div className="text-6xl mb-8">💀</div>
            
            <h1 className="text-3xl font-light mb-4" style={{ fontFamily: 'PP Mori, sans-serif' }}>
              Поражение
            </h1>
            
            <p className="text-xl text-red-400 mb-4">
              {state.gameOverReason}
            </p>
            
            <p className="text-lg text-gray-400">
              Индия погрузилась в хаос. Водные войны между штатами 
              превратились в полномасштабный гражданский конфликт.
            </p>
          </>
        )}
        
        {/* Stats */}
        <div className="mt-12 grid grid-cols-3 gap-4 text-sm">
          <div className="bg-gray-900/50 p-4 rounded-lg">
            <div className="text-gray-500">Год поражения</div>
            <div className="text-2xl text-red-400">{state.year}</div>
          </div>
          <div className="bg-gray-900/50 p-4 rounded-lg">
            <div className="text-gray-500">Ядерный таймер</div>
            <div className="text-2xl text-red-400">{Math.round(state.nuclearTimer)} дней</div>
          </div>
          <div className="bg-gray-900/50 p-4 rounded-lg">
            <div className="text-gray-500">Месяцев прожито</div>
            <div className="text-2xl text-gray-400">{state.totalMonths}</div>
          </div>
        </div>
        
        <button
          onClick={onExit}
          className="mt-12 px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-colors"
        >
          Вернуться в меню
        </button>
      </div>
      
      {/* CSS for floating animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-10px) translateX(5px); }
          50% { transform: translateY(-5px) translateX(-5px); }
          75% { transform: translateY(-15px) translateX(3px); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
