import React, { useState, useEffect } from 'react';
import { useTutorial } from '../../context/TutorialContext';

interface TutorialFinalScreenProps {
  onExit?: () => void;
}

export const TutorialFinalScreen: React.FC<TutorialFinalScreenProps> = ({ onExit }) => {
  const tutorial = useTutorial();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1000),
      setTimeout(() => setPhase(2), 3000),
      setTimeout(() => setPhase(3), 6000),
      setTimeout(() => setPhase(4), 9000),
      setTimeout(() => setPhase(5), 12000)
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
      {/* Background fade from dark to slightly lit */}
      <div 
        className={`absolute inset-0 transition-all duration-3000 ${
          phase >= 4 ? 'bg-gradient-to-b from-green-950/20 to-black' : 'bg-black'
        }`}
      />

      {/* Phase 1: Congratulations */}
      <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${
        phase >= 1 && phase < 3 ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-light text-white mb-8">
            Поздравляю
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Ты только что прошёл обучение, потратив реальные игровые деньги
            и увидев реальные последствия.
          </p>
        </div>
      </div>

      {/* Phase 2: Ready for real */}
      <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${
        phase >= 3 && phase < 4 ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-light text-white mb-8">
            Теперь ты готов к настоящим бассейнам
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Там будет сложнее. Там будет больно.
            <br />
            Но теперь ты точно знаешь, что делать.
          </p>
        </div>
      </div>

      {/* Phase 3: Historical note */}
      <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${
        phase >= 4 ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="text-center max-w-4xl mx-auto px-8">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-12">
            <p className="text-lg text-gray-400 leading-loose mb-8">
              В реальной жизни с 2015 по 2025 год Турция именно так и делала —
              перекрывала реку на ремонты, Ирак молчал, Сирия умирала тихо.
            </p>
            <div className="w-32 h-px bg-gray-700 mx-auto my-8" />
            <p className="text-xl text-white leading-relaxed">
              Ты только что прошёл лёгкую версию.
              <br />
              <span className="text-red-400">В следующих кампаниях лёгкого не будет.</span>
            </p>
          </div>
        </div>
      </div>

      {/* Progress complete indicator */}
      <div className={`absolute top-8 left-1/2 -translate-x-1/2 transition-all duration-1000 ${
        phase >= 1 ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="flex items-center gap-3 bg-green-900/30 border border-green-800 rounded-full px-6 py-2">
          <span className="text-green-400">✓</span>
          <span className="text-green-300 text-sm">Обучение завершено на 100%</span>
        </div>
      </div>

      {/* Continue button */}
      <button
        onClick={() => tutorial.completeTutorial()}
        className={`fixed bottom-12 px-12 py-5 bg-green-600 hover:bg-green-500 text-white font-semibold text-lg rounded-xl transition-all duration-500 shadow-lg shadow-green-900/50 ${
          phase >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
        }`}
      >
        Начать настоящую игру →
      </button>

      {/* Exit button */}
      <button
        onClick={handleExit}
        className="fixed top-6 right-6 px-4 py-2 bg-red-900/50 text-red-400 hover:bg-red-800 hover:text-red-300 rounded-lg transition-colors text-sm"
      >
        ✕ Выйти из обучения
      </button>

      {/* Unlocked campaigns preview */}
      <div className={`fixed bottom-32 left-1/2 -translate-x-1/2 transition-all duration-1000 ${
        phase >= 5 ? 'opacity-100' : 'opacity-0'
      }`}>
        <p className="text-gray-500 text-sm mb-4 text-center">Разблокированы кампании:</p>
        <div className="flex items-center gap-3">
          {[
            { name: 'Нил', flag: '🇪🇹' },
            { name: 'Инд', flag: '🇮🇳' },
            { name: 'Меконг', flag: '🇨🇳' },
            { name: 'Арал', flag: '🇰🇿' },
            { name: 'Евфрат', flag: '🇹🇷' },
            { name: 'Колорадо', flag: '🇺🇸' },
            { name: 'ООН', flag: '🇺🇳' }
          ].map((campaign, i) => (
            <div 
              key={campaign.name}
              className="flex flex-col items-center gap-1 px-3 py-2 bg-gray-900/50 border border-gray-800 rounded-lg"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <span className="text-2xl">{campaign.flag}</span>
              <span className="text-xs text-gray-400">{campaign.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
