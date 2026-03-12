import React, { useState } from 'react';
import { useGame, getPressureLevel, PRESSURE_LEVELS } from '../context/GameContext';

export const PressurePanel: React.FC = () => {
  const { state } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentLevel = getPressureLevel(state.internationalPressure);
  
  const formatPercent = (value: number) => `${Math.round(value * 100)}%`;
  
  return (
    <div className="relative">
      {/* Pressure indicator button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all hover:bg-white/10"
        style={{ 
          backgroundColor: `${currentLevel.color}20`,
          borderLeft: `3px solid ${currentLevel.color}`,
        }}
      >
        <span className="text-xs text-gray-400">Давление</span>
        <span 
          className="text-lg font-bold"
          style={{ color: currentLevel.color }}
        >
          {Math.round(state.internationalPressure)}
        </span>
        <span 
          className="text-xs px-1.5 py-0.5 rounded"
          style={{ 
            backgroundColor: currentLevel.color,
            color: currentLevel.level >= 3 ? 'white' : 'black',
          }}
        >
          {currentLevel.nameRu}
        </span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50">
          <div className="p-4">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <span>🌍</span>
              Международное давление
            </h3>
            
            {/* Pressure bar */}
            <div className="relative h-8 bg-gray-800 rounded-full overflow-hidden mb-4">
              <div 
                className="absolute inset-y-0 left-0 transition-all duration-500"
                style={{ 
                  width: `${state.internationalPressure}%`,
                  background: `linear-gradient(90deg, #22c55e 0%, #eab308 40%, #f97316 60%, #ef4444 80%, #7f1d1d 100%)`,
                }}
              />
              {/* Level markers */}
              {PRESSURE_LEVELS.slice(1).map((level) => (
                <div
                  key={level.level}
                  className="absolute inset-y-0 w-px bg-gray-600"
                  style={{ left: `${level.minPressure}%` }}
                />
              ))}
              <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                {Math.round(state.internationalPressure)}/100
              </span>
            </div>

            {/* Current effects */}
            <div className="space-y-2 mb-4">
              <h4 className="text-sm font-semibold text-gray-400">Активные санкции:</h4>
              
              {currentLevel.level === 0 ? (
                <div className="text-green-400 text-sm">✓ Санкций нет</div>
              ) : (
                <div className="space-y-1">
                  {currentLevel.effects.incomeReduction > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-red-400">💰</span>
                      <span>Доход от экспорта: -{formatPercent(currentLevel.effects.incomeReduction)}</span>
                    </div>
                  )}
                  {currentLevel.effects.fertilizerEmbargo && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-red-400">🚫</span>
                      <span>Эмбарго на удобрения (урожайность -{formatPercent(currentLevel.effects.yieldReduction)})</span>
                    </div>
                  )}
                  {currentLevel.effects.assetFreeze && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-red-400">🏦</span>
                      <span>Заморозка счетов (-{currentLevel.effects.assetFreezeAmount[0]}-{currentLevel.effects.assetFreezeAmount[1]} млрд $)</span>
                    </div>
                  )}
                  {currentLevel.effects.creditBan && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-red-400">📊</span>
                      <span>Запрет на кредиты МВФ/ВБ</span>
                    </div>
                  )}
                  {currentLevel.effects.fullBlockade && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-red-500 font-bold">⛔</span>
                      <span className="text-red-400 font-bold">ПОЛНАЯ БЛОКАДА (-{formatPercent(currentLevel.effects.blockadeIncomeReduction)} дохода)</span>
                    </div>
                  )}
                  {currentLevel.effects.militaryInterventionChance > 0 && (
                    <div className="flex items-center gap-2 text-sm bg-red-900/50 p-2 rounded">
                      <span className="text-red-500 animate-pulse">⚠️</span>
                      <span className="text-red-300">
                        Риск военного вмешательства: {formatPercent(currentLevel.effects.militaryInterventionChance)}/год
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* All levels */}
            <div className="border-t border-gray-700 pt-3">
              <h4 className="text-sm font-semibold text-gray-400 mb-2">Уровни давления:</h4>
              <div className="space-y-1">
                {PRESSURE_LEVELS.map((level) => (
                  <div 
                    key={level.level}
                    className={`flex items-center gap-2 text-xs p-1 rounded ${
                      level.level === currentLevel.level ? 'bg-white/10' : ''
                    }`}
                  >
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: level.color }}
                    />
                    <span className="w-16">{level.minPressure}-{level.maxPressure}</span>
                    <span className={level.level === currentLevel.level ? 'font-bold' : ''}>
                      {level.nameRu}
                    </span>
                    {level.level === currentLevel.level && (
                      <span className="text-yellow-400 ml-auto">← Сейчас</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Hint */}
            <div className="mt-3 text-xs text-gray-500 italic">
              Давление снижается очень медленно (max -8/год через дипломатию).
              Растёт мгновенно при жёстких действиях.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
