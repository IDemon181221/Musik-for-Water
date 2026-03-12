import React, { useState, useEffect } from 'react';
import { useTutorial } from '../../context/TutorialContext';

interface TutorialBlackSwanProps {
  onExit?: () => void;
}

export const TutorialBlackSwan: React.FC<TutorialBlackSwanProps> = ({ onExit }) => {
  const tutorial = useTutorial();
  const [phase, setPhase] = useState(0);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 4000),
      setTimeout(() => setShowButton(true), 6000)
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleExit = () => {
    if (onExit) {
      onExit();
    }
    tutorial.exitTutorial();
  };

  return (
    <div className="h-screen w-screen bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Red flash effect */}
      <div 
        className={`absolute inset-0 bg-red-900 transition-opacity duration-1000 ${
          phase >= 1 ? 'opacity-20' : 'opacity-0'
        }`}
      />

      {/* Black swan title */}
      <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${
        phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-150'
      }`}>
        <div className="text-center">
          <h1 className="text-7xl md:text-9xl font-bold text-red-600 tracking-widest animate-pulse">
            ЧЁРНЫЙ ЛЕБЕДЬ
          </h1>
          <div className="text-2xl text-red-400 mt-8 tracking-wide">
            BLACK SWAN EVENT
          </div>
        </div>
      </div>

      {/* Event description */}
      <div className={`absolute bottom-1/3 left-0 right-0 text-center transition-all duration-1000 ${
        phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="max-w-3xl mx-auto px-8">
          <div className="bg-red-950/80 border border-red-800 rounded-xl p-8">
            <div className="text-red-400 text-sm uppercase tracking-widest mb-4">
              Экстренное сообщение • Июль 2020
            </div>
            <h2 className="text-3xl text-white font-light mb-6">
              Турция объявила внеплановый ремонт плотины Кебан
            </h2>
            <p className="text-xl text-red-300 leading-relaxed">
              Евфрат полностью перекрыт на 60 дней.
            </p>
            <div className="mt-6 flex items-center justify-center gap-8 text-red-400">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚠️</span>
                <span>Спуск воды: 0 м³/с</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <span>Ирак: паника</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className={`absolute bottom-20 left-0 right-0 text-center transition-all duration-1000 ${
        phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="max-w-2xl mx-auto px-8">
          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            Вот что такое чёрный лебедь. Это событие, которого ты не можешь предсказать и не можешь отменить.
            В настоящей игре их 23 вида. Некоторые из них заканчивают игру мгновенно.
            <br /><br />
            <span className="text-gray-300">Сейчас ты увидел самое лёгкое.</span>
          </p>
        </div>
      </div>

      {/* Continue button */}
      <button
        onClick={() => tutorial.acknowledgeBlackSwan()}
        className={`fixed bottom-8 px-10 py-4 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-all duration-500 ${
          showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        Я понял. Продолжить →
      </button>

      {/* Exit button */}
      <button
        onClick={handleExit}
        className="fixed top-6 right-6 px-4 py-2 bg-red-900/50 text-red-400 hover:bg-red-800 hover:text-red-300 rounded-lg transition-colors text-sm"
      >
        ✕ Выйти из обучения
      </button>

      {/* Pulsing border effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute inset-4 border-2 border-red-600 rounded-lg transition-opacity duration-500 ${
          phase >= 1 ? 'opacity-50 animate-pulse' : 'opacity-0'
        }`} />
      </div>
    </div>
  );
};
